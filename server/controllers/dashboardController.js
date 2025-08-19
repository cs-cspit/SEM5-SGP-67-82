import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total employees
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });
    
    // Get total departments
    const totalDepartments = await Department.countDocuments({ status: 'Active' });
    
    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    });
    
    const presentToday = todayAttendance.filter(att => att.status === 'Present').length;
    const lateToday = todayAttendance.filter(att => att.status === 'Late').length;
    const absentToday = totalEmployees - todayAttendance.length;
    
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
    
    // Get recent attendance trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const attendanceTrend = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);
    
    res.json({
      totalEmployees,
      totalDepartments,
      attendanceToday: {
        present: presentToday,
        late: lateToday,
        absent: absentToday
      },
      pendingLeaves,
      departmentStats,
      attendanceTrend
    });
  } catch (error) {
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
