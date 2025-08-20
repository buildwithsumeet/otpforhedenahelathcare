import React, { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Hash,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

const UserTable = ({
  paginatedUsers = [],
  filteredUsers = [],
  currentPage = 1,
  totalPages = 1,
  setCurrentPage = () => {},
  itemsPerPage = 10,
  onViewUser,
  onEditUser,
  onDeleteUser,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status) => {
    const statusStyles = {
      Active: "bg-green-100 text-green-700 border-green-200",
      Inactive: "bg-gray-100 text-gray-700 border-gray-200",
      Suspended: "bg-red-100 text-red-700 border-red-200",
    };
    return `px-3 py-1 rounded-full text-xs font-medium border ${
      statusStyles[status] || statusStyles.Inactive
    }`;
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      "Senior Developer": "bg-purple-100 text-purple-700",
      "Marketing Manager": "bg-blue-100 text-blue-700",
      "Sales Representative": "bg-orange-100 text-orange-700",
      "HR Specialist": "bg-pink-100 text-pink-700",
      "Financial Analyst": "bg-emerald-100 text-emerald-700",
      "UI/UX Designer": "bg-indigo-100 text-indigo-700",
      Admin: "bg-red-100 text-red-700",
      Manager: "bg-blue-100 text-blue-700",
      Employee: "bg-gray-100 text-gray-700",
    };
    return `px-2 py-1 rounded-md text-xs font-medium ${
      roleColors[role] || "bg-gray-100 text-gray-700"
    }`;
  };

  const handleDeleteClick = (user) => setDeleteConfirm(user);

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onDeleteUser?.(deleteConfirm);

      setSuccessAlert({
        user: deleteConfirm,
        message: `${
          deleteConfirm.fullName ||
          `${deleteConfirm.firstName} ${deleteConfirm.lastName}`
        } has been successfully deleted.`,
      });

      setTimeout(() => setSuccessAlert(null), 4000);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="relative">
      {/* ✅ Success Alert */}
      {successAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className="bg-white border border-green-200 rounded-xl shadow-lg p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={18} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 text-sm">
                User Deleted Successfully
              </h4>
              <p className="text-green-700 text-xs mt-1">
                {successAlert.message}
              </p>
            </div>
            <button
              onClick={() => setSuccessAlert(null)}
              className="text-green-400 hover:text-green-600 p-1"
              aria-label="Close alert"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/95 rounded-2xl border border-indigo-200/50 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50 to-cyan-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-800">
              Users ({filteredUsers.length})
            </h3>
            <div className="text-sm text-slate-600">
              Showing {paginatedUsers.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {paginatedUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 mb-4">No users found</p>
            <p className="text-xs text-slate-400">
              Use the "Add User" button above to create your first user
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden p-4 space-y-4">
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                >
                  {/* avatar + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 text-sm">
                        {user.fullName ||
                          `${user.firstName} ${user.lastName}`}
                      </div>
                      <div className="text-xs text-slate-500 flex gap-1 items-center">
                        <Hash size={10} />
                        <span>{user.employeeId || user.id}</span>•@
                        {user.username}
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="text-sm text-slate-600 space-y-1 mb-2">
                    <div className="flex gap-2 items-center">
                      <Mail size={14} /> {user.email}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Phone size={14} /> {user.phone || user.phoneNumber}
                    </div>
                  </div>

                  {/* Department + Role */}
                  <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                    <Building size={14} />
                    {user.department || user.designation}
                  </div>
                  <div className="mb-2">
                    <span className={getRoleBadge(user.role)}>{user.role}</span>
                  </div>

                  {/* Status + Last login */}
                  <div className="flex justify-between text-sm mb-3">
                    <span className={getStatusBadge(user.status)}>
                      {user.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {user.lastLogin}
                    </span>
                  </div>

                  {/* Action Btns */}
                  <div className="flex gap-2">
                    <ActionButton
                      label="View User"
                      icon={<Eye size={16} />}
                      onClick={() => onViewUser?.(user)}
                      hover="hover:text-indigo-600 hover:bg-indigo-50"
                    />
                    <ActionButton
                      label="Edit User"
                      icon={<Edit size={16} />}
                      onClick={() => onEditUser?.(user)}
                      hover="hover:text-green-600 hover:bg-green-50"
                    />
                    <ActionButton
                      label="Delete User"
                      icon={<Trash2 size={16} />}
                      onClick={() => handleDeleteClick(user)}
                      hover="hover:text-red-600 hover:bg-red-50"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "User",
                      "ID",
                      "Contact",
                      "Department",
                      "Role",
                      "Status",
                      "Last Login",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-indigo-50/20">
                      <td className="px-4 py-3">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {user.fullName ||
                                `${user.firstName} ${user.lastName}`}
                            </div>
                            <div className="text-xs text-slate-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 flex gap-1 items-center">
                        <Hash size={12} /> {user.employeeId || user.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        <div className="flex gap-2 items-center">
                          <Mail size={14} /> {user.email}
                        </div>
                        <div className="flex gap-2 items-center">
                          <Phone size={14} /> {user.phone || user.phoneNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 flex gap-2 items-center">
                        <Building size={14} /> {user.department}
                      </td>
                      <td className="px-4 py-3">
                        <span className={getRoleBadge(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadge(user.status)}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {user.lastLogin}
                      </td>
                      <td className="px-4 py-3 flex gap-1">
                        <ActionButton
                          label="View User"
                          icon={<Eye size={16} />}
                          onClick={() => onViewUser?.(user)}
                          hover="hover:text-indigo-600 hover:bg-indigo-50"
                        />
                        <ActionButton
                          label="Edit User"
                          icon={<Edit size={16} />}
                          onClick={() => onEditUser?.(user)}
                          hover="hover:text-green-600 hover:bg-green-50"
                        />
                        <ActionButton
                          label="Delete User"
                          icon={<Trash2 size={16} />}
                          onClick={() => handleDeleteClick(user)}
                          hover="hover:text-red-600 hover:bg-red-50"
                        />
                        <ActionButton
                          label="More"
                          icon={<MoreVertical size={16} />}
                          hover="hover:text-slate-600 hover:bg-slate-50"
                        />
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
          <div className="px-4 py-4 border-t border-indigo-100 bg-slate-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
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
                            ? "bg-indigo-500 text-white"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2)
                    return (
                      <span
                        key={pageNum}
                        className="px-2 text-slate-400 select-none"
                      >
                        ...
                      </span>
                    );
                  return null;
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Delete User
                </h3>
                <p className="text-sm text-slate-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="mb-6 text-slate-700">
              Permanently delete{" "}
              <span className="font-semibold">
                {deleteConfirm.fullName ||
                  `${deleteConfirm.firstName} ${deleteConfirm.lastName}`}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Small reusable button */
const ActionButton = ({ label, icon, onClick, hover }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`p-2 text-slate-400 rounded-lg transition-colors ${hover}`}
  >
    {icon}
  </button>
);

/** Tailwind custom animation (add to global CSS) */
/* 
.animate-slide-in { 
  @apply transform transition-transform duration-300 translate-x-0 opacity-100; 
}
*/

export default UserTable;
