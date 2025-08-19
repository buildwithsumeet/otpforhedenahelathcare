import React, { useState } from 'react';
import { Eye, Edit, Trash2, MoreVertical, Hash, AlertTriangle, CheckCircle, X } from 'lucide-react';

const ReusableTable = ({
  data = [],
  columns = [],
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onMoreActions,
  title = "Data Table",
  showActions = true,
  showPagination = true,
  customActions = [],
  loading = false,
  emptyMessage = "No data available"
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const startIndex = (currentPage - 1) * itemsPerPage;

  // Enhanced delete with confirmation
  const handleDeleteClick = (item) => {
    setDeleteConfirm(item);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      setIsDeleting(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        onDelete?.(deleteConfirm);
        
        setSuccessAlert({
          item: deleteConfirm,
          message: `Item has been successfully deleted.`
        });
        
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

  // Render cell content based on column configuration
  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }

    const value = column.key.split('.').reduce((obj, key) => obj?.[key], item);
    
    if (column.type === 'badge') {
      return (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${column.badgeColors?.[value] || 'bg-gray-100 text-gray-700'}`}>
          {value}
        </span>
      );
    }

    if (column.type === 'avatar') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {item.avatar || value?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-medium text-slate-800 text-sm">{value}</div>
            {column.subtitle && (
              <div className="text-xs text-slate-500">
                {column.subtitle.split('.').reduce((obj, key) => obj?.[key], item)}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (column.type === 'contact') {
      return (
        <div className="space-y-1">
          {column.fields?.map((field, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
              {field.icon && <field.icon size={14} />}
              {field.key.split('.').reduce((obj, key) => obj?.[key], item)}
            </div>
          ))}
        </div>
      );
    }

    if (column.type === 'id') {
      return (
        <div className="flex items-center gap-1 text-sm text-slate-600">
          <Hash size={12} />
          <span className="font-mono">{value}</span>
        </div>
      );
    }

    return <span className="text-sm text-slate-700">{value || '-'}</span>;
  };

  // Default actions
  const defaultActions = [
    {
      icon: Eye,
      label: 'View',
      onClick: onView,
      className: 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
    },
    {
      icon: Edit,
      label: 'Edit',
      onClick: onEdit,
      className: 'text-slate-400 hover:text-green-600 hover:bg-green-50'
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: handleDeleteClick,
      className: 'text-slate-400 hover:text-red-600 hover:bg-red-50'
    }
  ];

  const actions = customActions.length > 0 ? customActions : defaultActions;

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-2 text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

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
              <h4 className="font-semibold text-green-800 text-sm">Action Completed Successfully</h4>
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
              {title} ({data.length})
            </h3>
            {showPagination && (
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)} of {data.length}
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {data.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">{emptyMessage}</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="sm:hidden p-4 space-y-4">
              {data.map((item, index) => (
                <div key={item.id || index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                  {columns.slice(0, 3).map((column) => (
                    <div key={column.key} className="mb-2">
                      <div className="text-xs font-medium text-slate-500 mb-1">{column.header}</div>
                      {renderCellContent(item, column)}
                    </div>
                  ))}

                  {/* Mobile Actions */}
                  {showActions && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                      {actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => action.onClick?.(item)}
                          className={`p-2 rounded-lg transition-colors z-10 relative ${action.className}`}
                          title={action.label}
                        >
                          <action.icon size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-50/50 sticky top-0 z-10">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${column.width || 'min-w-[120px]'}`}
                      >
                        {column.header}
                      </th>
                    ))}
                    {showActions && (
                      <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-indigo-50/30 transition-colors">
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 sm:px-6 py-4">
                          {renderCellContent(item, column)}
                        </td>
                      ))}
                      {showActions && (
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-1">
                            {actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => action.onClick?.(item)}
                                className={`p-2 rounded-lg transition-colors z-10 relative ${action.className}`}
                                title={action.label}
                              >
                                <action.icon size={16} />
                              </button>
                            ))}
                            {onMoreActions && (
                              <button
                                onClick={() => onMoreActions(item)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors z-10 relative"
                                title="More Options"
                              >
                                <MoreVertical size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-indigo-100/50 bg-slate-50/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
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
                        onClick={() => onPageChange?.(pageNum)}
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
                  onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
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
                  <h3 className="text-lg font-semibold text-slate-800">Delete Item</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-slate-700 leading-relaxed">
                  Are you sure you want to permanently delete this item?
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  This will remove all associated data permanently.
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
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

export default ReusableTable;
