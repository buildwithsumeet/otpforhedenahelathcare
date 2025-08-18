import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Download,
  Upload
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample users data
  useEffect(() => {
    setUsers([
      {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@company.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        department: 'Engineering',
        role: 'Senior Developer',
        status: 'Active',
        avatar: 'JD',
        lastLogin: '2025-01-17 14:30',
      },
      {
        id: 2,
        username: 'jane_smith',
        email: 'jane.smith@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1 (555) 234-5678',
        department: 'Marketing',
        role: 'Marketing Manager',
        status: 'Active',
        avatar: 'JS',
        lastLogin: '2025-01-17 09:15',
      },
      {
        id: 3,
        username: 'mike_wilson',
        email: 'mike.wilson@company.com',
        firstName: 'Mike',
        lastName: 'Wilson',
        phone: '+1 (555) 345-6789',
        department: 'Sales',
        role: 'Sales Representative',
        status: 'Inactive',
        avatar: 'MW',
        lastLogin: '2025-01-15 16:45',
      },
      {
        id: 4,
        username: 'sarah_johnson',
        email: 'sarah.johnson@company.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+1 (555) 456-7890',
        department: 'HR',
        role: 'HR Specialist',
        status: 'Active',
        avatar: 'SJ',
        lastLogin: '2025-01-17 11:20',
      },
      {
        id: 5,
        username: 'david_brown',
        email: 'david.brown@company.com',
        firstName: 'David',
        lastName: 'Brown',
        phone: '+1 (555) 567-8901',
        department: 'Finance',
        role: 'Financial Analyst',
        status: 'Suspended',
        avatar: 'DB',
        lastLogin: '2025-01-10 13:30',
      },
      {
        id: 6,
        username: 'lisa_davis',
        email: 'lisa.davis@company.com',
        firstName: 'Lisa',
        lastName: 'Davis',
        phone: '+1 (555) 678-9012',
        department: 'Engineering',
        role: 'UI/UX Designer',
        status: 'Active',
        avatar: 'LD',
        lastLogin: '2025-01-17 10:45',
      }
    ]);
  }, []);

  // Filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || user.department === filterDepartment;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Content wrapper with proper padding */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg">
              <Users className="text-white" size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-slate-700">User Management</h1>
          </div>
          <p className="text-slate-600 text-base sm:text-lg font-light ml-0 sm:ml-14">
            Manage and organize your team members
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-indigo-200/50 shadow-lg">
          <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full xl:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <select
                  value={filterDepartment}
                  onChange={e => setFilterDepartment(e.target.value)}
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
                  onChange={e => setFilterStatus(e.target.value)}
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
            <div className="flex flex-wrap gap-3 w-full xl:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Upload size={16} />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
                <UserPlus size={16} />
                <span className="hidden sm:inline">Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg overflow-hidden">
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
          
          {/* Table content with horizontal scroll */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">User</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[250px]">Contact</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[120px]">Department</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[150px]">Role</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[100px]">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[120px]">Last Login</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors">
                    {/* User */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {user.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-800">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-slate-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={14} className="flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={14} className="flex-shrink-0" />
                          <span>{user.phone}</span>
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
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: users.length, color: 'indigo' },
            { label: 'Active Users', value: users.filter(u => u.status === 'Active').length, color: 'green' },
            { label: 'Inactive Users', value: users.filter(u => u.status === 'Inactive').length, color: 'gray' },
            { label: 'Suspended Users', value: users.filter(u => u.status === 'Suspended').length, color: 'red' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/95 backdrop-blur-xl rounded-xl p-4 border border-indigo-200/50 shadow-lg">
              <div className="text-xl sm:text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
