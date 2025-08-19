import React, { useState } from 'react';
import { Eye, Edit, Trash2, MoreVertical, Mail, Phone, Building, Hash, AlertTriangle, CheckCircle, X } from 'lucide-react';

const UserTable = ({
  paginatedUsers,
  filteredUsers,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  onViewUser,
  onEditUser,
  onDeleteUser
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status) => {
    const statusStyles = {
      Active: 'bg-green-100 text-green-700 border-green-200',
      Inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      Suspended: 'bg-red-100 text-red-700 border-red-200'
    };
    return `px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.Inactive}`;
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'Senior Developer': 'bg-purple-100 text-purple-700',
      'Marketing Manager': 'bg-blue-100 text-blue-700',
      'Sales Representative': 'bg-orange-100 text-orange-700',
      'HR Specialist': 'bg-pink-100 text-pink-700',
      'Financial Analyst': 'bg-emerald-100 text-emerald-700',
      'UI/UX Designer': 'bg-indigo-100 text-indigo-700',
      'Admin': 'bg-red-100 text-red-700',
      'Manager': 'bg-blue-100 text-blue-700',
      'Employee': 'bg-gray-100 text-gray-700'
    };
    return `px-2 py-1 rounded-md text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-700'}`;
  };

  // Enhanced delete with confirmation
  const handleDeleteClick = (user) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      setIsDeleting(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Call the actual delete function
        onDeleteUser?.(deleteConfirm);
        
        // Show success alert
        setSuccessAlert({
          user: deleteConfirm,
          message: `${deleteConfirm.fullName || `${deleteConfirm.firstName} ${deleteConfirm.lastName}`} has been successfully deleted.`
        });
        
        // Auto-hide success alert after 4 seconds
        setTimeout(() => {
          setSuccessAlert(null);
        }, 4000);
        
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

  return (
    <div className="relative">
      {/* Success Alert */}
      {successAlert && (
        <div className="fixed top-4 right-4 z-[60] max-w-md">
          <div className="bg-white border border-green-200 rounded-xl shadow-2xl p-4 flex items-start gap-3 transform animate-in slide-in-from-right-full duration-300">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="text-green-600" size={18} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 text-sm">User Deleted Successfully</h4>
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

      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-cyan-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-800">
              Users ({filteredUsers.length})
            </h3>
            <div className="text-sm text-slate-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {paginatedUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 mb-4">No users found</p>
            <p className="text-xs text-slate-400">Use the "Add User" button above to create your first user</p>
          </div>
        ) : (
          <>
            {/* Mobile View - FIXED */}
            <div className="sm:hidden p-4 space-y-4">
              {paginatedUsers.map((user) => (
                <div key={user.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800 text-sm">
                        {user.fullName || `${user.firstName} ${user.lastName}`}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Hash size={10} />
                        <span>{user.employeeId || `ID: ${user.id}`}</span>
                        <span>•</span>
                        <span>@{user.username}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm mb-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={14} /> {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={14} /> {user.phone || user.phoneNumber}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                    <Building size={14} className="text-slate-400" /> 
                    {user.department || user.designation}
                  </div>
                  <div className="mb-2">
                    <span className={getRoleBadge(user.role)}>{user.role}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className={getStatusBadge(user.status)}>{user.status}</span>
                    <span className="text-xs text-slate-500">{user.lastLogin}</span>
                  </div>

                  {/* FIXED: Mobile Actions with proper event handling */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onViewUser?.(user);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative z-20 touch-manipulation"
                      title="View User"
                      style={{ minHeight: '40px', minWidth: '40px' }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEditUser?.(user);
                      }}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors relative z-20 touch-manipulation"
                      title="Edit User"
                      style={{ minHeight: '40px', minWidth: '40px' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(user);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors relative z-20 touch-manipulation"
                      title="Delete User"
                      style={{ minHeight: '40px', minWidth: '40px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-50/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-[280px]">User</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[100px]">ID</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[280px]">Contact</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[140px]">Department</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">Role</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[100px]">Status</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[140px]">Last Login</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-4 sm:px-6 py-4 w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-800 text-sm">
                              {user.fullName || `${user.firstName} ${user.lastName}`}
                            </div>
                            <div className="text-xs text-slate-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Hash size={12} />
                          <span className="font-mono">{user.employeeId || user.id}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={14} /> {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} /> {user.phone || user.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building size={16} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">
                            {user.department || user.designation}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={getRoleBadge(user.role)}>{user.role}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={getStatusBadge(user.status)}>{user.status}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-slate-600">{user.lastLogin}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => onViewUser?.(user)} 
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors z-10 relative"
                            title="View User"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => onEditUser?.(user)} 
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors z-10 relative"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(user)} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10 relative"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button 
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors z-10 relative"
                            title="More Options"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-indigo-100/50 bg-slate-50/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded transition-colors ${
                          currentPage === pageNum
                            ? 'bg-indigo-500 text-white border-indigo-500'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
                  <h3 className="text-lg font-semibold text-slate-800">Delete User</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-slate-700 leading-relaxed">
                  Are you sure you want to permanently delete{' '}
                  <span className="font-semibold text-slate-900">
                    {deleteConfirm.fullName || `${deleteConfirm.firstName} ${deleteConfirm.lastName}`}
                  </span>
                  {' '}from the system?
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  This will remove all user data including their profile, permissions, and activity history.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {deleteConfirm.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 text-sm">
                      {deleteConfirm.fullName || `${deleteConfirm.firstName} ${deleteConfirm.lastName}`}
                    </div>
                    <div className="text-xs text-slate-500">
                      {deleteConfirm.email} • {deleteConfirm.role}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slide-in-from-right-full {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default UserTable;
