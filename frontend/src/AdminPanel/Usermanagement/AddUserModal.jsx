import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { userFields } from "./userFields";

const initialValues = userFields.reduce((acc, field) => {
  acc[field.name] = field.type === "file" ? null : "";
  return acc;
}, {});

const AddUserModal = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const [values, setValues] = useState(initialValues);
  const [fileURL, setFileURL] = useState(null);
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing user
  useEffect(() => {
    if (editingUser && isOpen) {
      // Map existing user data to form fields
      setValues({
        userType: editingUser.userType || '',
        employeeId: editingUser.employeeId || editingUser.id,
        designation: editingUser.designation || editingUser.role || '',
        gender: editingUser.gender || '',
        fullName: editingUser.fullName || `${editingUser.firstName || ''} ${editingUser.lastName || ''}`.trim(),
        email: editingUser.email || '',
        role: editingUser.role || '',
        phoneNumber: editingUser.phoneNumber || editingUser.phone || '',
        dateOfBirth: editingUser.dateOfBirth || '',
        dateOfJoining: editingUser.dateOfJoining || '',
        dateOfAnniversary: editingUser.dateOfAnniversary || '',
        status: editingUser.status || 'Active',
        // Add any additional fields from your userFields
        ...Object.keys(initialValues).reduce((acc, key) => {
          if (editingUser[key] !== undefined) {
            acc[key] = editingUser[key];
          }
          return acc;
        }, {})
      });
    } else {
      setValues(initialValues);
    }
    
    // Reset file preview and errors when modal opens/closes
    setFileURL(null);
    setErrors({});
  }, [editingUser, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setValues((prev) => ({ ...prev, [name]: files[0] || null }));
      setFileURL(files ? URL.createObjectURL(files) : null);
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    userFields.forEach(field => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    // Email validation
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Prepare user data
    const userDataWithId = {
      ...values,
      employeeId: editingUser ? editingUser.employeeId : `EMP${Date.now()}`,
      avatar: values.fullName ? 
        values.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 
        (editingUser ? editingUser.avatar : 'U'),
      lastLogin: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '')
    };

    onSubmit(userDataWithId);
    handleClose();
  };

  const handleClose = () => {
    setValues(initialValues);
    setFileURL(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg">
              <Save className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Edit Mode Info Banner */}
        {editingUser && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                {editingUser.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Editing: {editingUser.fullName || `${editingUser.firstName} ${editingUser.lastName}`}
                </p>
                <p className="text-xs text-blue-600">
                  ID: {editingUser.employeeId || editingUser.id} • {editingUser.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body - Dynamic Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {userFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="font-medium text-slate-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    disabled={field.disabled}
                    className={`border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors[field.name] ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-indigo-300'
                    } ${field.disabled ? 'bg-slate-100 text-slate-500' : ''}`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>

                ) : field.type === "file" ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      name={field.name}
                      accept="image/*"
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2.5 w-full file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {fileURL && (
                      <div className="flex items-center gap-3">
                        <img src={fileURL} alt="Profile Preview" className="h-16 w-16 rounded-full border-2 border-indigo-200 object-cover" />
                        <p className="text-sm text-slate-600">Preview</p>
                      </div>
                    )}
                    {editingUser && !fileURL && (
                      <p className="text-xs text-slate-500">
                        Current: {editingUser.profilePicture ? 'Has profile picture' : 'No profile picture'}
                      </p>
                    )}
                  </div>

                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    value={field.type === "file" ? undefined : values[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    className={`border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors[field.name] ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-indigo-300'
                    } ${field.disabled ? 'bg-slate-100 text-slate-500' : ''}`}
                  />
                )}

                {/* Error Messages */}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors[field.name]}
                  </p>
                )}

                {/* Employee ID Help Text */}
                {field.name === "employeeId" && (
                  <p className="text-xs text-slate-500">
                    {editingUser 
                      ? 'Employee ID cannot be changed' 
                      : 'ID will be generated when you submit'
                    }
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg font-medium"
            >
              <Save size={16} />
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
