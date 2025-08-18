import React from 'react';
import { Eye, Edit, Trash2, MoreVertical, Mail, Phone, Building } from 'lucide-react';

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
      'UI/UX Designer': 'bg-indigo-100 text-indigo-700'
    };
    return `px-2 py-1 rounded-md text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-700'}`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg overflow-hidden">
      {/* Custom CSS */}
      <style jsx>{`
        .sticky-col {
          position: sticky !important;
          left: 0 !important;
          z-index: 5;
          background-color: #fff !important;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
        }

        .sticky-col-header {
          position: sticky !important;
          left: 0 !important;
          z-index: 15;
          background-color: rgb(248 250 252 / 0.8) !important;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
        }

        .table-container {
          max-height: 600px;
          overflow-y: auto;
        }
      `}</style>

      {/* Table Header */}
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
      
      {/* Table content with proper scrolling */}
      <div className="table-container scrollbar-hide">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-50/50 sticky top-0 z-10">
              <tr>
                <th className="sticky-col-header px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-[240px]">User</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[280px]">Contact</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[140px]">Department</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">Role</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[100px]">Status</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[140px]">Last Login</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map(user => (
                <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors">
                  {/* User - Sticky Column */}
                  <td className="sticky-col px-4 sm:px-6 py-4 w-[240px]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-800 text-sm">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-slate-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  {/* Contact */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="flex-shrink-0" />
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="flex-shrink-0" />
                        <span className="text-xs">{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  {/* Department */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-slate-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{user.department}</span>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-4 sm:px-6 py-4">
                    <span className={getRoleBadge(user.role)}>{user.role}</span>
                  </td>
                  {/* Status */}
                  <td className="px-4 sm:px-6 py-4">
                    <span className={getStatusBadge(user.status)}>{user.status}</span>
                  </td>
                  {/* Last Login */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-slate-600">{user.lastLogin}</div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => onViewUser?.(user)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onEditUser?.(user)}
                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteUser?.(user)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-indigo-100/50 bg-slate-50/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="px-2 text-slate-400">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
