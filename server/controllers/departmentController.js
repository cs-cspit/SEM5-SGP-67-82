import Department from '../models/Department.js';

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ status: 'Active' });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new department
export const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    const savedDepartment = await department.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
