import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, X, AlertTriangle, CheckCircle, CalendarDays, Clock } from 'lucide-react';

const AlertDaysManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'Event Day',
    date: '',
    message: ''
  });

  // Sample data
  useEffect(() => {
    setAlerts([
      {
        id: 1,
        type: 'IMPORTANT',
        date: 'August 14, 2025',
        day: 'Thursday',
        message: 'asdfghjkl',
        addedOn: 'Aug 12, 2025 11:00 AM'
      },
      {
        id: 2,
        type: 'IMPORTANT',
        date: 'August 13, 2025',
        day: 'Wednesday',
        message: 'asdfghjkl',
        addedOn: 'Aug 12, 2025 11:00 AM'
      },
      {
        id: 3,
        type: 'EVENT',
        date: 'August 13, 2025',
        day: 'Wednesday',
        message: 'asdfghjkl',
        addedOn: 'Aug 12, 2025 11:00 AM'
      },
      
      
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

  // Handle type selection
  const handleTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      type: type
    }));
  };

  // Get day name from date
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Open add modal
  const handleAddAlert = () => {
    setEditingAlert(null);
    setFormData({
      type: 'Event Day',
      date: '',
      message: ''
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setFormData({
      type: alert.type === 'EVENT' ? 'Event Day' : 'Important Day',
      date: new Date(alert.date).toISOString().split('T')[0],
      message: alert.message
    });
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date.trim() || !formData.message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const alertData = {
      id: editingAlert ? editingAlert.id : Date.now(),
      type: formData.type === 'Event Day' ? 'EVENT' : 'IMPORTANT',
      date: formatDate(formData.date),
      day: getDayName(formData.date),
      message: formData.message,
      addedOn: editingAlert ? editingAlert.addedOn : new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };

    if (editingAlert) {
      // Update existing alert
      setAlerts(prev => prev.map(alert => 
        alert.id === editingAlert.id ? alertData : alert
      ));
      setSuccessAlert({ message: 'Alert updated successfully!' });
    } else {
      // Add new alert
      setAlerts(prev => [...prev, alertData]);
      setSuccessAlert({ message: 'Alert added successfully!' });
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  // Delete alert
  const handleDeleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setSuccessAlert({ message: 'Alert deleted successfully!' });
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAlert(null);
  };

  // Get type badge styles
  const getTypeBadge = (type) => {
    if (type === 'IMPORTANT') {
      return 'bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium';
    } else {
      return 'bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium';
    }
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
            <h1 className="text-2xl sm:text-3xl font-light text-slate-700">Alert Days Management</h1>
          </div>
          <p className="text-slate-600 text-base sm:text-lg font-light ml-0 sm:ml-14">
            Manage your important dates and reminders
          </p>
        </div>

        {/* Your Alert Days Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg overflow-hidden">
          
          {/* Section Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-slate-600" size={20} />
              <h3 className="text-lg font-semibold text-slate-800">Your Alert Days</h3>
            </div>
            <button
              onClick={handleAddAlert}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg font-medium"
            >
              <Plus size={16} />
              Add New
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Day</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Message</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Added On</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className={getTypeBadge(alert.type)}>
                        {alert.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{alert.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{alert.day}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{alert.message}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{alert.addedOn}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAlert(alert)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit Alert"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Alert"
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
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className={getTypeBadge(alert.type)}>
                    {alert.type}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAlert(alert)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Date:</span>
                    <span className="text-sm text-slate-800">{alert.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Day:</span>
                    <span className="text-sm text-slate-800">{alert.day}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Message:</span>
                    <span className="text-sm text-slate-800">{alert.message}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Added On:</span>
                    <span className="text-sm text-slate-600">{alert.addedOn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Alert Modal */}
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
                    {editingAlert ? 'Edit Alert Day' : 'Add Alert Day'}
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
                
                {/* Alert Type Selection */}
                <div className="mb-6">
                  <label className="block font-medium text-slate-700 mb-3">
                    <AlertTriangle size={16} className="inline mr-2" />
                    Alert Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('Event Day')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.type === 'Event Day' 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <Calendar size={16} />
                      Event Day
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('Important Day')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.type === 'Important Day' 
                          ? 'bg-green-500 text-white border-green-500' 
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      }`}
                    >
                      <AlertTriangle size={16} />
                      Important Day
                    </button>
                  </div>
                </div>

                {/* Date Input */}
                <div className="mb-6">
                  <label className="block font-medium text-slate-700 mb-2">
                    <Clock size={16} className="inline mr-2" />
                    Date
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

                {/* Message Input */}
                <div className="mb-6">
                  <label className="block font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter message..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    rows={4}
                    required
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
                    {editingAlert ? 'Update Alert Day' : 'Add Alert Day'}
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

export default AlertDaysManagement;
