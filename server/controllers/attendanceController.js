import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, method, data } = req.body;
    
    console.log('Marking attendance:', { employeeId, method, data });

    // Get employee details and validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Allow attendance for Active employees only
    // On Leave employees can still mark attendance in case they're present
    if (employee.status !== 'Active' && employee.status !== 'On Leave') {
      return res.status(400).json({ message: 'Cannot mark attendance for employee with this status' });
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already marked today
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    // Validate attendance method
    let attendanceData = {
      employee: employeeId,
      employeeId: employee.employeeId,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      date: today,
      checkIn: new Date().toLocaleTimeString(),
      status: 'Present', // Default status
      approvalStatus: 'pending', // Requires admin approval
      method: method
    };

    // Add location data
    if (method === 'location' && data.lat && data.lng) {
      attendanceData.location = {
        lat: data.lat,
        lng: data.lng,
        accuracy: data.accuracy || 0
      };
    }

    // Create attendance record
    const attendance = new Attendance(attendanceData);
    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance: attendance
    });

  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get attendance records (enhanced by default)
export const getAttendance = async (req, res) => {
  try {
    const { employeeId, date, month, includeAll = false } = req.query;
    
    let filter = {};
    
    // Include all records or only approved ones based on query parameter
    if (includeAll !== 'true') {
      filter.approvalStatus = 'approved';
    }
    
    if (employeeId) {
      filter.employee = employeeId;
    }
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      filter.date = targetDate;
    } else if (month) {
      const startOfMonth = new Date(month);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      
      filter.date = {
        $gte: startOfMonth,
        $lt: endOfMonth
      };
    }

    // Get attendance records with populated employee data
    const attendance = await Attendance.find(filter)
      .populate('employee', 'name employeeId department position hourlySalary')
      .sort({ date: -1 });

    // Enhanced data formatting for frontend consumption
    const enhancedAttendance = attendance.map(record => {
      const employee = record.employee;
      const hourlyRate = employee?.hourlySalary || 15;
      
      return {
        _id: record._id,
        employee: record.employee,
        employeeId: record.employeeId,
        name: record.name,
        department: record.department,
        position: record.position,
        date: record.date,
        checkIn: record.checkIn || (record.checkInTime ? record.checkInTime.toLocaleTimeString() : 'N/A'),
        checkOut: record.checkOut || (record.checkOutTime ? record.checkOutTime.toLocaleTimeString() : 'N/A'),
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        totalHours: record.totalHours || record.workingHours || 0,
        workingHours: record.workingHours || 0,
        breakTime: record.breakTime || 1,
        status: record.status,
        approvalStatus: record.approvalStatus,
        method: record.method,
        hourlyRate: hourlyRate,
        regularHours: record.regularHours || 0,
        overtimeHours: record.overtimeHours || 0,
        overtime: record.overtime || record.overtimeHours || 0,
        regularPay: record.regularPay || 0,
        overtimePay: record.overtimePay || 0,
        totalPay: record.totalPay || 0,
        dailySalary: record.dailySalary || record.totalPay || 0,
        location: record.location,
        requestType: record.requestType
      };
    });

    res.json(enhancedAttendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get attendance statistics for admin dashboard
export const getAttendanceStats = async (req, res) => {
  try {
    const { period = '7' } = req.query; // Default to last 7 days
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get total attendance count
    const totalAttendance = await Attendance.countDocuments({
      date: { $gte: startDate },
      approvalStatus: 'approved'
    });

    // Get attendance by method
    const attendanceByMethod = await Attendance.aggregate([
      { $match: { date: { $gte: startDate }, approvalStatus: 'approved' } },
      { $group: { _id: '$method', count: { $sum: 1 } } }
    ]);

    // Get daily attendance for chart
    const dailyAttendance = await Attendance.aggregate([
      { $match: { date: { $gte: startDate }, approvalStatus: 'approved' } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get unique employees count
    const uniqueEmployees = await Attendance.distinct('employee', {
      date: { $gte: startDate },
      approvalStatus: 'approved'
    });

    // Get department-wise attendance
    const departmentStats = await Attendance.aggregate([
      { $match: { date: { $gte: startDate }, approvalStatus: 'approved' } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.json({
      totalAttendance,
      uniqueEmployees: uniqueEmployees.length,
      attendanceByMethod,
      dailyAttendance,
      departmentStats
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update attendance record (for checkout, salary calculation, etc.)
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('employee', 'name employeeId department');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check today's attendance for employee
export const getTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });
    
    res.json({
      hasMarkedToday: !!attendance,
      attendance: attendance
    });
  } catch (error) {
    console.error('Error checking today\'s attendance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get pending attendance requests
export const getPendingAttendance = async (req, res) => {
  try {
    const pendingAttendance = await Attendance.find({
      approvalStatus: 'pending'
    })
    .populate('employee', 'name employeeId department')
    .sort({ createdAt: -1 });

    res.json(pendingAttendance);
  } catch (error) {
    console.error('Error fetching pending attendance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject attendance with enhanced functionality
export const approveAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, status } = req.body; // action: 'approve' or 'reject'

    const attendance = await Attendance.findById(id).populate('employee');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (action === 'approve') {
      attendance.approvalStatus = 'approved';
      attendance.status = status || 'Present';

      // If approving a check-in request
      if (attendance.requestType === 'checkin') {
        attendance.checkIn = attendance.checkInTime ? attendance.checkInTime.toLocaleTimeString() : new Date().toLocaleTimeString();
      }

      // If approving a check-out request, calculate salary
      if (attendance.requestType === 'checkout' && attendance.checkInTime && attendance.checkOutTime) {
        const employee = attendance.employee;
        
        // Recalculate working hours
        const workingHours = calculateWorkingHours(attendance.checkInTime, attendance.checkOutTime);
        attendance.workingHours = workingHours;
        attendance.totalHours = workingHours;

        // Calculate salary based on working hours
        const hourlyRate = employee.hourlySalary || 15; // Default rate if not set
        const regularHours = Math.min(workingHours, 8); // Regular hours (up to 8)
        const overtimeHours = Math.max(0, workingHours - 8); // Overtime hours
        
        const regularPay = regularHours * hourlyRate;
        const overtimePay = overtimeHours * hourlyRate * 1.5; // 1.5x rate for overtime
        
        attendance.regularHours = regularHours;
        attendance.overtimeHours = overtimeHours;
        attendance.overtime = overtimeHours;
        attendance.regularPay = Math.round(regularPay * 100) / 100; // Round to 2 decimal places
        attendance.overtimePay = Math.round(overtimePay * 100) / 100;
        attendance.totalPay = Math.round((regularPay + overtimePay) * 100) / 100;
        attendance.dailySalary = attendance.totalPay;
        attendance.hourlyRate = hourlyRate;
      }

      // Clear request type after approval
      attendance.requestType = undefined;
    } else {
      attendance.approvalStatus = 'rejected';
      attendance.status = 'Absent';
      
      // If rejecting a check-out, remove the check-out time
      if (attendance.requestType === 'checkout') {
        attendance.checkOutTime = undefined;
        attendance.checkOut = undefined;
        attendance.workingHours = 0;
        attendance.totalHours = 0;
        attendance.regularHours = 0;
        attendance.overtimeHours = 0;
        attendance.overtime = 0;
        attendance.regularPay = 0;
        attendance.overtimePay = 0;
        attendance.totalPay = 0;
        attendance.dailySalary = 0;
      }
      
      // If rejecting a check-in, remove the check-in time
      if (attendance.requestType === 'checkin') {
        attendance.checkInTime = undefined;
        attendance.checkIn = undefined;
      }
      
      // Clear request type after rejection
      attendance.requestType = undefined;
    }

    await attendance.save();

    res.json({
      message: `Attendance ${action}d successfully`,
      attendance
    });
  } catch (error) {
    console.error('Error approving attendance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check-in function
export const checkIn = async (req, res) => {
  try {
    const { employeeId, location, timestamp } = req.body;
    
    console.log('Processing check-in request:', { employeeId, location, timestamp });

    // Get employee details and validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if employee is active or on leave
    if (employee.status !== 'Active' && employee.status !== 'On Leave') {
      return res.status(400).json({ message: 'Cannot check in for employee with this status' });
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already has a check-in request today (pending or approved)
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ message: 'Check-in request already exists for today' });
    }

    // Create attendance record with pending approval status
    const attendanceData = {
      employee: employeeId,
      employeeId: employee.employeeId,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      date: today,
      checkInTime: new Date(timestamp),
      status: 'Present',
      approvalStatus: 'pending', // Requires admin approval
      method: 'location',
      location: location,
      requestType: 'checkin' // New field to identify request type
    };

    let attendance;
    if (existingAttendance) {
      // Update existing record
      Object.assign(existingAttendance, attendanceData);
      attendance = await existingAttendance.save();
    } else {
      // Create new record
      attendance = new Attendance(attendanceData);
      await attendance.save();
    }

    res.status(201).json({
      message: 'Check-in request submitted successfully. Waiting for admin approval.',
      attendance: attendance,
      status: 'pending'
    });

  } catch (error) {
    console.error('Error during check-in request:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check-out function
export const checkOut = async (req, res) => {
  try {
    const { employeeId, location, timestamp } = req.body;
    
    console.log('Processing check-out:', { employeeId, location, timestamp });

    // Get employee details and validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if employee is active or on leave
    if (employee.status !== 'Active' && employee.status !== 'On Leave') {
      return res.status(400).json({ message: 'Cannot check out for employee with this status' });
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'No approved check-in record found for today' });
    }

    if (attendance.approvalStatus !== 'approved') {
      return res.status(400).json({ message: 'Check-in is still pending approval. Cannot check out yet.' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out for today' });
    }

    // Update attendance with check-out time and auto-approve
    attendance.checkOutTime = new Date(timestamp);
    attendance.approvalStatus = 'approved'; // Auto-approve check-out
    
    // Calculate working hours and salary immediately
    const workingHours = calculateWorkingHours(attendance.checkInTime, attendance.checkOutTime);
    attendance.workingHours = workingHours;

    // Calculate salary based on working hours
    const hourlyRate = employee.hourlySalary || 15; // Default rate if not set
    const regularHours = Math.min(workingHours, 8); // Regular hours (up to 8)
    const overtimeHours = Math.max(0, workingHours - 8); // Overtime hours
    
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5; // 1.5x rate for overtime
    
    attendance.regularHours = regularHours;
    attendance.overtimeHours = overtimeHours;
    attendance.regularPay = Math.round(regularPay * 100) / 100; // Round to 2 decimal places
    attendance.overtimePay = Math.round(overtimePay * 100) / 100;
    attendance.totalPay = Math.round((regularPay + overtimePay) * 100) / 100;

    await attendance.save();

    res.json({
      message: 'Check-out successful',
      attendance: attendance,
      status: 'approved'
    });

  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate working hours with rounding logic
function calculateWorkingHours(checkInTime, checkOutTime) {
  const checkIn = new Date(checkInTime);
  const checkOut = new Date(checkOutTime);
  
  // Calculate difference in milliseconds
  const diffMs = checkOut - checkIn;
  
  // Convert to hours
  const hours = diffMs / (1000 * 60 * 60);
  
  // Calculate minutes
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const remainderMinutes = totalMinutes % 60;
  
  // Round up if minutes > 0 (as requested)
  const roundedHours = remainderMinutes > 0 ? Math.ceil(hours) : Math.floor(hours);
  
  return Math.max(0, roundedHours); // Ensure non-negative
}

// Get employee attendance for specific date
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { date } = req.query;
    
    let filter = { employee: employeeId };
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      filter.date = targetDate;
    }
    
    const attendance = await Attendance.findOne(filter);
    
    if (!attendance) {
      return res.status(404).json({ message: 'No attendance record found' });
    }
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mark all unmarked employees as absent for a specific date
export const markAbsentEmployees = async (req, res) => {
  try {
    const { date } = req.body;
    
    let targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    console.log('Marking absent employees for date:', targetDate);

    // Get all active employees (only active employees should be marked absent)
    const activeEmployees = await Employee.find({ status: 'Active' });
    
    // Get total employees count (Active + On Leave) for reporting
    const totalEmployeesCount = await Employee.countDocuments({ 
      status: { $in: ['Active', 'On Leave'] } 
    });
    
    // Get existing attendance records for the date
    const existingAttendance = await Attendance.find({
      date: targetDate
    });

    // Create a set of employee IDs who already have attendance records
    const markedEmployeeIds = new Set(
      existingAttendance.map(att => att.employee.toString())
    );

    // Find employees without attendance records
    const unmarkedEmployees = activeEmployees.filter(
      emp => !markedEmployeeIds.has(emp._id.toString())
    );

    console.log(`Found ${unmarkedEmployees.length} unmarked employees out of ${activeEmployees.length} total employees`);

    // Create absent records for unmarked employees
    const absentRecords = unmarkedEmployees.map(employee => ({
      employee: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      date: targetDate,
      status: 'Absent',
      approvalStatus: 'approved', // Auto-approved absent status
      method: 'auto',
      checkIn: null,
      checkOut: null,
      checkInTime: null,
      checkOutTime: null,
      totalHours: 0,
      workingHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      overtime: 0,
      regularPay: 0,
      overtimePay: 0,
      totalPay: 0,
      dailySalary: 0,
      hourlyRate: employee.hourlySalary || 15
    }));

    // Insert absent records if any
    let createdRecords = [];
    if (absentRecords.length > 0) {
      createdRecords = await Attendance.insertMany(absentRecords);
      console.log(`Created ${createdRecords.length} absent records`);
    }

    res.json({
      message: `Successfully marked ${createdRecords.length} employees as absent`,
      date: targetDate.toISOString().split('T')[0],
      totalEmployees: totalEmployeesCount, // Total employees (Active + On Leave)
      activeEmployees: activeEmployees.length, // Only active employees
      markedEmployees: markedEmployeeIds.size,
      absentMarked: createdRecords.length,
      absentEmployees: createdRecords.map(record => ({
        name: record.name,
        employeeId: record.employeeId,
        department: record.department
      }))
    });
  } catch (error) {
    console.error('Error marking absent employees:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get enhanced attendance records with better data formatting
export const getEnhancedAttendance = async (req, res) => {
  try {
    const { employeeId, date, month } = req.query;
    
    let filter = {};
    
    if (employeeId) {
      filter.employee = employeeId;
    }
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      filter.date = targetDate;
    } else if (month) {
      const startOfMonth = new Date(month);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      
      filter.date = {
        $gte: startOfMonth,
        $lt: endOfMonth
      };
    }

    // Get attendance records with populated employee data
    const attendance = await Attendance.find(filter)
      .populate('employee', 'name employeeId department position hourlySalary')
      .sort({ date: -1 });

    // Enhanced data formatting for frontend consumption
    const enhancedAttendance = attendance.map(record => {
      const employee = record.employee;
      const hourlyRate = employee?.hourlySalary || record.hourlyRate || 15;
      
      return {
        _id: record._id,
        employee: record.employee,
        employeeId: record.employeeId,
        name: record.name,
        department: record.department,
        position: record.position,
        date: record.date,
        checkIn: record.checkIn || (record.checkInTime ? record.checkInTime.toLocaleTimeString() : 'N/A'),
        checkOut: record.checkOut || (record.checkOutTime ? record.checkOutTime.toLocaleTimeString() : 'N/A'),
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        totalHours: record.totalHours || record.workingHours || 0,
        workingHours: record.workingHours || 0,
        breakTime: record.breakTime || 1,
        status: record.status,
        approvalStatus: record.approvalStatus,
        method: record.method,
        hourlyRate: hourlyRate,
        regularHours: record.regularHours || 0,
        overtimeHours: record.overtimeHours || 0,
        overtime: record.overtime || record.overtimeHours || 0,
        regularPay: record.regularPay || 0,
        overtimePay: record.overtimePay || 0,
        totalPay: record.totalPay || 0,
        dailySalary: record.dailySalary || record.totalPay || 0,
        location: record.location,
        requestType: record.requestType
      };
    });

    res.json(enhancedAttendance);
  } catch (error) {
    console.error('Error fetching enhanced attendance:', error);
    res.status(500).json({ message: error.message });
  }
};
