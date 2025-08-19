import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Check, X, AlertTriangle } from 'lucide-react';
import { permissionCategories, defaultRoles } from './roleFields';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successAlert, setSuccessAlert] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
    permissions: {}
  });

  // Load initial data
  useEffect(() => {
    const savedRoles = localStorage.getItem('roles');
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    } else {
      setRoles(defaultRoles);
      localStorage.setItem('roles', JSON.stringify(defaultRoles));
    }
  }, []);

  // Save to localStorage whenever roles change
  useEffect(() => {
    if (roles.length > 0) {
      localStorage.setItem('roles', JSON.stringify(roles));
    }
  }, [roles]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle permission toggle
  const handlePermissionToggle = (category, permission) => {
    setFormData(prev => {
      const categoryPerms = prev.permissions[category] || [];
      const isChecked = categoryPerms.includes(permission);

      let updatedPerms;
      if (isChecked) {
        updatedPerms = categoryPerms.filter(p => p !== permission);
      } else {
        updatedPerms = [...categoryPerms, permission];
      }

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [category]: updatedPerms
        }
      };
    });
  };

  // Handle select all for category
  const handleSelectAllCategory = (category, permissions) => {
    setFormData(prev => {
      const categoryPerms = prev.permissions[category] || [];
      const allSelected = permissions.every(perm => categoryPerms.includes(perm));

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [category]: allSelected ? [] : [...permissions]
        }
      };
    });
  };

  // Open add modal
  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({
      roleName: '',
      description: '',
      permissions: {}
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      roleName: role.roleName,
      description: role.description,
      permissions: role.permissions
    });
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.roleName.trim()) {
      alert('Role name is required');
      return;
    }

    const roleData = {
      id: editingRole ? editingRole.id : Date.now(),
      roleName: formData.roleName,
      description: formData.description,
      permissions: formData.permissions
    };

    if (editingRole) {
      // Update existing role
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id ? roleData : role
      ));
      setSuccessAlert({ message: `Role "${roleData.roleName}" updated successfully!` });
    } else {
      // Add new role
      setRoles(prev => [...prev, roleData]);
      setSuccessAlert({ message: `Role "${roleData.roleName}" created successfully!` });
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  // Handle delete
  const handleDeleteClick = (role) => {
    setDeleteConfirm(role);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      setIsDeleting(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setRoles(prev => prev.filter(role => role.id !== deleteConfirm.id));
        setSuccessAlert({ message: `Role "${deleteConfirm.roleName}" deleted successfully!` });
        
        setTimeout(() => setSuccessAlert(null), 4000);
        
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
        setDeleteConfirm(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  // Get permission count for a role
  const getPermissionCount = (permissions) => {
    return Object.values(permissions).reduce((total, perms) => total + perms.length, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        
        {/* Success Alert */}
        {successAlert && (
          <div className="fixed top-4 right-4 z-[60] max-w-md">
            <div className="bg-white border border-green-200 rounded-xl shadow-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="text-green-600" size={18} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 text-sm">Success!</h4>
                <p className="text-green-700 text-xs mt-1">{successAlert.message}</p>
              </div>
              <button
                onClick={() => setSuccessAlert(null)}
                className="text-green-400 hover:text-green-600 p-1 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <Shield className="text-white" size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-slate-700">Role Management</h1>
          </div>
          <p className="text-slate-600 text-base sm:text-lg font-light ml-0 sm:ml-14">
            Manage user roles and permissions
          </p>
        </div>

        {/* Add Role Button */}
        <div className="mb-6">
          <button
            onClick={handleAddRole}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white  rounded-lg transition-colors shadow-lg"
          >
            <Plus size={16} />
            Add Role
          </button>
        </div>

        {/* Roles Table */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <h3 className="text-lg font-semibold text-slate-800">
              Manage Roles ({roles.length})
            </h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{role.roleName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{role.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                          {getPermissionCount(role.permissions)} permissions
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit Role"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(role)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden p-4 space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-slate-800">{role.roleName}</div>
                    <div className="text-sm text-slate-600">{role.description}</div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                    {getPermissionCount(role.permissions)} permissions
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 text-yellow-600 bg-yellow-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(role)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Role Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <Shield className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {editingRole ? 'Edit Role' : 'Add New Role'}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-medium text-slate-700 mb-2">
                      Role Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter role name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter role description"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Assign Permissions:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {permissionCategories.map(({ category, permissions }) => {
                      const categoryPerms = formData.permissions[category] || [];
                      const allSelected = permissions.every(perm => categoryPerms.includes(perm));
                      
                      return (
                        <div key={category} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-slate-700 text-sm">{category}</h4>
                            <button
                              type="button"
                              onClick={() => handleSelectAllCategory(category, permissions)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                allSelected 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {permissions.map(permission => (
                              <label key={permission} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={categoryPerms.includes(permission)}
                                  onChange={() => handlePermissionToggle(category, permission)}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-slate-700">{permission}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg font-medium"
                  >
                    <Shield size={16} />
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[55] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Delete Role</h3>
                    <p className="text-sm text-slate-600">This action cannot be undone</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-slate-700 leading-relaxed">
                    Are you sure you want to permanently delete the role{' '}
                    <span className="font-semibold text-slate-900">"{deleteConfirm.roleName}"</span>?
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    This will remove the role and all its associated permissions.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Role
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
