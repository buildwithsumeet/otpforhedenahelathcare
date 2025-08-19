import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, X, CheckCircle, ArrowLeft, CalendarDays } from 'lucide-react';

const HolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    holidayName: '',
    description: ''
  });

  // Sample holiday data
  useEffect(() => {
    setHolidays([
      {
        id: 1,
        date: '2025-07-07',
        holidayName: 'vgh',
        description: 'vjh'
      },
      {
        id: 2,
        date: '2025-07-07',
        holidayName: 'holiday',
        description: 'test'
      },
      {
        id: 3,
        date: '2025-07-11',
        holidayName: 'gy',
        description: 'gvhj'
      }
    ]);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open add modal
  const handleAddHoliday = () => {
    setEditingHoliday(null);
    setFormData({
      date: '',
      holidayName: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditHoliday = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      date: holiday.date,
      holidayName: holiday.holidayName,
      description: holiday.description
    });
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date.trim() || !formData.holidayName.trim()) {
      alert('Date and Holiday Name are required');
      return;
    }

    const holidayData = {
      id: editingHoliday ? editingHoliday.id : Date.now(),
      date: formData.date,
      holidayName: formData.holidayName,
      description: formData.description
    };

    if (editingHoliday) {
      // Update existing holiday
      setHolidays(prev => prev.map(holiday => 
        holiday.id === editingHoliday.id ? holidayData : holiday
      ));
      setSuccessAlert({ message: `${holidayData.holidayName} updated successfully!` });
    } else {
      // Add new holiday
      setHolidays(prev => [...prev, holidayData]);
      setSuccessAlert({ message: `${holidayData.holidayName} added successfully!` });
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  // Delete holiday
  const handleDeleteHoliday = (holidayId) => {
    const holidayToDelete = holidays.find(h => h.id === holidayId);
    setHolidays(prev => prev.filter(holiday => holiday.id !== holidayId));
    setSuccessAlert({ message: `${holidayToDelete?.holidayName} deleted successfully!` });
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHoliday(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        
        {/* Success Alert */}
        {successAlert && (
          <div className="fixed top-4 right-4 z-[60] max-w-md">
            <div className="bg-white border border-green-200 rounded-xl shadow-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-green-600" size={18} />
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
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-slate-700">Manage Holidays</h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-600 text-base sm:text-lg font-light ml-0 sm:ml-14">
              Add and manage company holidays and important dates
            </p>
            {/* <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all shadow-lg font-medium"
            >
              <ArrowLeft size={16} />
              Back to List
            </button> */}
          </div>
        </div>

        {/* Add Holiday Button */}
        <div className="mb-6">
          <button
            onClick={handleAddHoliday}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg font-medium"
          >
            <Plus size={16} />
            Add Holiday
          </button>
        </div>

        {/* Holidays Table */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg overflow-hidden">
          
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Holiday Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holidays.map((holiday) => (
                  <tr key={holiday.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {formatDate(holiday.date)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {holiday.holidayName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {holiday.description}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditHoliday(holiday)}
                          className="px-3 py-1.5 bg-yellow-400 text-yellow-800 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
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
            {holidays.map((holiday) => (
              <div key={holiday.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-indigo-500" size={16} />
                    <span className="font-medium text-slate-800">{holiday.holidayName}</span>
                  </div>
                  <span className="text-sm text-slate-600">{formatDate(holiday.date)}</span>
                </div>
                
                {holiday.description && (
                  <p className="text-sm text-slate-600 mb-3">{holiday.description}</p>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditHoliday(holiday)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-400 text-yellow-800 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHoliday(holiday.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {holidays.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto mb-4 text-slate-400" size={48} />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No Holidays Added</h3>
              <p className="text-slate-500 mb-4">Start by adding your first holiday</p>
              <button
                onClick={handleAddHoliday}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg font-medium mx-auto"
              >
                <Plus size={16} />
                Add First Holiday
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Holiday Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg">
                    <Calendar className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
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
                
                {/* Date Input */}
                <div className="mb-6">
                  <label className="block font-medium text-slate-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Holiday Name Input */}
                <div className="mb-6">
                  <label className="block font-medium text-slate-700 mb-2">
                    Holiday Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="holidayName"
                    value={formData.holidayName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter holiday name"
                    required
                  />
                </div>

                {/* Description Input */}
                <div className="mb-6">
                  <label className="block font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter holiday description (optional)"
                    rows={4}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg font-medium"
                  >
                    <Calendar size={16} />
                    {editingHoliday ? 'Update Holiday' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayManagement;
