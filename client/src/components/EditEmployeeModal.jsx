import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  IndianRupee,
  Users,
  AlertCircle,
  Save,
  Edit3,
  Trash2,
} from "lucide-react";
import "./EditEmployeeModal.css";

const EditEmployeeModal = ({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  employee,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    hourlySalary: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form when employee data changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        position: employee.position || "",
        department: employee.department || "",
        hourlySalary: employee.hourlySalary || "",
      });
    }
  }, [employee]);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.hourlySalary.toString().trim()) {
      newErrors.hourlySalary = "Hourly salary is required";
    } else if (parseFloat(formData.hourlySalary) <= 0) {
      newErrors.hourlySalary = "Hourly salary must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare data for submission
      const employeeData = {
        id: employee.id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        department: formData.department,
        hourlySalary: parseFloat(formData.hourlySalary),
        // Preserve existing data that shouldn't be edited
        joinDate: employee.joinDate,
        dateOfBirth: employee.dateOfBirth || null,
        gender: employee.gender || null,
        maritalStatus: employee.maritalStatus || null,
        address: employee.address || null,
        location: employee.location || "Not specified",
        status: employee.status || "Active",
        attendance: employee.attendance || 0,
      };

      await onUpdate(employeeData);
      handleClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      setErrors({ submit: "Failed to update employee. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete employee ${employee?.name}? This action cannot be undone.`
    );

    if (confirmDelete) {
      onDelete(employee.id);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !employee) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-section">
            <Edit3 className="w-6 h-6" />
            <h2>Edit Employee</h2>
          </div>
          <button onClick={handleClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-step">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "error" : ""}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "error" : ""}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "error" : ""}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="position">Position *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={errors.position ? "error" : ""}
                  placeholder="Enter job position"
                />
                {errors.position && (
                  <span className="error-message">{errors.position}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={errors.department ? "error" : ""}
                >
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
                {errors.department && (
                  <span className="error-message">{errors.department}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="hourlySalary">Hourly Salary *</label>
                <div className="input-with-icon">
                  <IndianRupee className="input-icon" />
                  <input
                    type="number"
                    id="hourlySalary"
                    name="hourlySalary"
                    value={formData.hourlySalary}
                    onChange={handleInputChange}
                    className={errors.hourlySalary ? "error" : ""}
                    placeholder="Enter hourly salary rate"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.hourlySalary && (
                  <span className="error-message">{errors.hourlySalary}</span>
                )}
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="error-alert">
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <div className="form-actions-left">
              <button
                type="button"
                className="btn-delete"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

            <div className="form-actions-right">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
