import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';

// Create a new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    // Get employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    // Calculate number of days
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    if (daysDiff > 7) {
      return res.status(400).json({ message: 'Leave duration cannot exceed 7 days' });
    }

    if (daysDiff < 1) {
      return res.status(400).json({ message: 'Leave duration must be at least 1 day' });
    }

    // Create leave request
    const leaveRequest = new Leave({
      employee: employeeId,
      employeeId: employee.employeeId,
      employeeName: employee.name,
      department: employee.department,
      position: employee.position,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: 'Pending'
    });

    await leaveRequest.save();

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leave: leaveRequest
    });

  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all leave requests
export const getAllLeaves = async (req, res) => {
  try {
    const { status, department, month } = req.query;
    
    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (department && department !== 'all') {
      filter.department = department;
    }
    
    if (month) {
      const startOfMonth = new Date(month);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      
      filter.startDate = {
        $gte: startOfMonth,
        $lt: endOfMonth
      };
    }

    const leaves = await Leave.find(filter)
      .populate('employee', 'name employeeId department position')
      .sort({ appliedDate: -1 });

    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get leave requests for a specific employee
export const getEmployeeLeaves = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { limit = 10 } = req.query;

    const leaves = await Leave.find({ employee: employeeId })
      .sort({ appliedDate: -1 })
      .limit(parseInt(limit));

    res.json(leaves);
  } catch (error) {
    console.error('Error fetching employee leaves:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update leave request status (approve/reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected' });
    }

    const updateData = {
      status,
      ...(status === 'Approved' 
        ? { approvedDate: new Date(), approvedBy } 
        : { rejectedDate: new Date(), rejectedBy: approvedBy })
    };

    const leave = await Leave.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('employee', 'name employeeId department');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave
    });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get leave statistics
export const getLeaveStats = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get total leave requests
    const totalRequests = await Leave.countDocuments({
      appliedDate: { $gte: startDate }
    });

    // Get leave requests by status
    const statusStats = await Leave.aggregate([
      { $match: { appliedDate: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get leave requests by type
    const typeStats = await Leave.aggregate([
      { $match: { appliedDate: { $gte: startDate } } },
      { $group: { _id: '$leaveType', count: { $sum: 1 } } }
    ]);

    // Get department-wise stats
    const departmentStats = await Leave.aggregate([
      { $match: { appliedDate: { $gte: startDate } } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.json({
      totalRequests,
      statusStats,
      typeStats,
      departmentStats
    });
  } catch (error) {
    console.error('Error fetching leave stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete leave request
export const deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Only allow deletion of pending requests
    if (leave.status !== 'Pending') {
      return res.status(400).json({ 
        message: 'Cannot delete leave request that has been approved or rejected' 
      });
    }

    await Leave.findByIdAndDelete(id);

    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({ message: error.message });
  }
};