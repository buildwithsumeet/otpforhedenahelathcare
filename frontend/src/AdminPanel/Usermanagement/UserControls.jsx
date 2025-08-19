import React from 'react';
import { Search, UserPlus } from 'lucide-react';

const UserControls = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  filterStatus,
  setFilterStatus,
  onAddUser
}) => {
  return (
    <div className="mb-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-indigo-200/50 shadow-lg">
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
          
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-auto min-w-[140px]"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-auto min-w-[120px]"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <button 
            onClick={onAddUser}
            className="flex justify-center items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 shadow-lg w-full sm:w-auto"
          >
            <UserPlus size={16} />
            <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserControls;
