import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total employees (Active + On Leave)
    const totalEmployees = await Employee.countDocuments({ 
      status: { $in: ['Active', 'On Leave'] } 
    });
    
    // Get total departments
    const totalDepartments = await Department.countDocuments({ status: 'Active' });
    
    // Get today's attendance (only approved records)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get all approved attendance records for today
    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
      approvalStatus: 'approved'
    });
    
    // Count present employees (approved Present status)
    const presentToday = todayAttendance.filter(att => 
      att.status === 'Present'
    ).length;
    
    // Calculate absent count: active employees minus present employees
    // Only active employees can be marked as absent (we'll get breakdown later)
    // For now, use a temporary calculation
    const absentToday = Math.max(0, totalEmployees - presentToday);
    
    // Get pending attendance requests
    const pendingAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      approvalStatus: 'pending'
    });
    
    // Get pending leave requests
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    
    // Get department-wise employee count
    const departmentStats = await Employee.aggregate([
      { $match: { status: 'Active' } },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'departmentInfo'
        }
      },
      { $unwind: '$departmentInfo' },
      {
        $group: {
          _id: '$departmentInfo.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get recent attendance trends (last 7 days) - only approved records
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const attendanceTrend = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo, $lt: tomorrow },
          approvalStatus: 'approved'
        }
      },
      {
        $addFields: {
          simplifiedStatus: {
            $cond: {
              if: { $eq: ["$status", "Present"] },
              then: "Present",
              else: "Absent"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            status: "$simplifiedStatus"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Get employee status breakdown
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const onLeaveEmployees = await Employee.countDocuments({ status: 'On Leave' });
    
    // Recalculate absent count with correct logic: active employees minus present employees
    const correctAbsentToday = Math.max(0, activeEmployees - presentToday);
    
    // Verify total calculation (for debugging)
    console.log(`Dashboard Stats: Active=${activeEmployees}, OnLeave=${onLeaveEmployees}, Total=${totalEmployees}, Present=${presentToday}, Absent=${correctAbsentToday}`);
    
    res.json({
      totalEmployees, // This equals activeEmployees + onLeaveEmployees
      totalDepartments,
      employeeStatusBreakdown: {
        active: activeEmployees,
        onLeave: onLeaveEmployees
      },
      attendanceToday: {
        present: presentToday,
        absent: correctAbsentToday,
        onLeave: onLeaveEmployees
      },
      pendingAttendance,
      pendingLeaves,
      departmentStats,
      attendanceTrend
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    // Get recent leave applications
    const recentLeaves = await Leave.find()
      .populate('employee', 'firstName lastName employeeId')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent employee additions
    const recentEmployees = await Employee.find()
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      recentLeaves,
      recentEmployees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Quick approve attendance from dashboard
export const quickApproveAttendance = async (req, res) => {
  try {
    const { attendanceId, status } = req.body; // status: 'Present' or 'Absent'
    
    console.log('Quick approve attendance:', { attendanceId, status });

    const attendance = await Attendance.findById(attendanceId).populate('employee');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Update attendance status
    attendance.approvalStatus = 'approved';
    attendance.status = status;

    if (status === 'Present') {
      // Set check-in if not already set
      if (!attendance.checkIn && attendance.checkInTime) {
        attendance.checkIn = attendance.checkInTime.toLocaleTimeString();
      } else if (!attendance.checkInTime) {
        attendance.checkInTime = new Date();
        attendance.checkIn = new Date().toLocaleTimeString();
      }
    } else {
      // For absent status, clear time fields
      attendance.checkInTime = null;
      attendance.checkOutTime = null;
      attendance.checkIn = null;
      attendance.checkOut = null;
      attendance.totalHours = 0;
      attendance.workingHours = 0;
      attendance.regularHours = 0;
      attendance.overtimeHours = 0;
      attendance.overtime = 0;
      attendance.regularPay = 0;
      attendance.overtimePay = 0;
      attendance.totalPay = 0;
      attendance.dailySalary = 0;
    }

    // Clear request type
    attendance.requestType = undefined;

    await attendance.save();

    res.json({
      message: `Attendance ${status.toLowerCase()} approved successfully`,
      attendance
    });
  } catch (error) {
    console.error('Error in quick approve attendance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Auto-mark absent and get today's attendance summary
export const getTodayAttendanceSummary = async (req, res) => {
  try {
    const { autoMarkAbsent = false } = req.query;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // If requested, auto-mark absent employees
    if (autoMarkAbsent === 'true') {
      console.log('Auto-marking absent employees...');
      
      // Get all active employees
      const activeEmployees = await Employee.find({ status: 'Active' });
      
      // Get existing attendance records for today
      const existingAttendance = await Attendance.find({
        date: { $gte: today, $lt: tomorrow }
      });

      // Create a set of employee IDs who already have attendance records
      const markedEmployeeIds = new Set(
        existingAttendance.map(att => att.employee.toString())
      );

      // Find employees without attendance records
      const unmarkedEmployees = activeEmployees.filter(
        emp => !markedEmployeeIds.has(emp._id.toString())
      );

      // Create absent records for unmarked employees
      if (unmarkedEmployees.length > 0) {
        const absentRecords = unmarkedEmployees.map(employee => ({
          employee: employee._id,
          employeeId: employee.employeeId,
          name: employee.name,
          department: employee.department,
          position: employee.position,
          date: today,
          status: 'Absent',
          approvalStatus: 'approved',
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
          dailySalary: 0
        }));

        await Attendance.insertMany(absentRecords);
        console.log(`Auto-marked ${absentRecords.length} employees as absent`);
      }
    }

    // Get updated attendance summary
    const allAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate('employee', 'name employeeId department position');

    const totalEmployees = await Employee.countDocuments({ 
      status: { $in: ['Active', 'On Leave'] } 
    });
    
    // Count by status
    const statusCounts = {
      Present: 0,
      Absent: 0,
      Pending: 0
    };

    allAttendance.forEach(record => {
      if (record.approvalStatus === 'pending') {
        statusCounts.Pending++;
      } else if (record.status === 'Present') {
        statusCounts.Present++;
      } else {
        statusCounts.Absent++;
      }
    });

    // Get pending requests
    const pendingRequests = allAttendance.filter(att => att.approvalStatus === 'pending');

    res.json({
      date: today.toISOString().split('T')[0],
      totalEmployees,
      statusCounts,
      pendingRequests: pendingRequests.map(req => ({
        _id: req._id,
        employeeId: req.employeeId,
        name: req.name,
        department: req.department,
        position: req.position,
        checkInTime: req.checkInTime,
        location: req.location,
        requestType: req.requestType || 'checkin'
      })),
      allAttendance: allAttendance.map(att => ({
        _id: att._id,
        employeeId: att.employeeId,
        name: att.name,
        department: att.department,
        status: att.status,
        approvalStatus: att.approvalStatus,
        checkIn: att.checkIn,
        checkOut: att.checkOut,
        workingHours: att.workingHours || 0,
        totalPay: att.totalPay || 0
      }))
    });
  } catch (error) {
    console.error('Error getting today\'s attendance summary:', error);
    res.status(500).json({ message: error.message });
  }
};
