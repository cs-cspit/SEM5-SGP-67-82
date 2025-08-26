import Employee from '../models/Employee.js';

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new employee
export const createEmployee = async (req, res) => {
  try {
    console.log('Received employee data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'position', 'department'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          message: `${field} is required`,
          field: field 
        });
      }
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: req.body.email.toLowerCase() });
    if (existingEmployee) {
      return res.status(409).json({ 
        message: 'Employee with this email already exists',
        field: 'email'
      });
    }

    const employee = new Employee({
      ...req.body,
      email: req.body.email.toLowerCase(),
      status: req.body.status || 'Active'
    });
    
    const savedEmployee = await employee.save();
    console.log('Employee saved successfully:', savedEmployee._id);
    
    // Populate department information before sending response
    const populatedEmployee = await Employee.findById(savedEmployee._id).populate('department');
    
    res.status(201).json(populatedEmployee || savedEmployee);
  } catch (error) {
    console.error('Error creating employee:', error.message);
    console.error('Error details:', error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errorMessages 
      });
    }
    
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(409).json({ 
        message: `Employee with this ${duplicateField} already exists`, 
        field: duplicateField 
      });
    }
    
    res.status(400).json({ message: error.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
