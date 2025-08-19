<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import UserControls from "./UserControls";
import UserTable from "./UserTable";

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

  // Event handlers
  const handleAddUser = () => {
    console.log('Add user clicked');
    // Add your logic here
  };

  const handleViewUser = (user) => {
    console.log('View user:', user);
    // Add your logic here
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
    // Add your logic here
  };

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user);
    // Add your logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Content wrapper with proper padding */}
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
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

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
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

        {/* Controls Component */}
        <UserControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterDepartment={filterDepartment}
          setFilterDepartment={setFilterDepartment}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onAddUser={handleAddUser}
        />

        {/* Table Component */}
        <UserTable
          paginatedUsers={paginatedUsers}
          filteredUsers={filteredUsers}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default UserManagement;
=======
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import UserControls from "./UserControls";
import UserTable from "./UserTable";

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
      { id: 1, username: 'john_doe', email: 'john.doe@company.com', firstName: 'John', lastName: 'Doe', phone: '+1 (555) 123-4567', department: 'Engineering', role: 'Senior Developer', status: 'Active', avatar: 'JD', lastLogin: '2025-01-17 14:30' },
      { id: 2, username: 'jane_smith', email: 'jane.smith@company.com', firstName: 'Jane', lastName: 'Smith', phone: '+1 (555) 234-5678', department: 'Marketing', role: 'Marketing Manager', status: 'Active', avatar: 'JS', lastLogin: '2025-01-17 09:15' },
      { id: 3, username: 'mike_wilson', email: 'mike.wilson@company.com', firstName: 'Mike', lastName: 'Wilson', phone: '+1 (555) 345-6789', department: 'Sales', role: 'Sales Representative', status: 'Inactive', avatar: 'MW', lastLogin: '2025-01-15 16:45' },
      { id: 4, username: 'sarah_johnson', email: 'sarah.johnson@company.com', firstName: 'Sarah', lastName: 'Johnson', phone: '+1 (555) 456-7890', department: 'HR', role: 'HR Specialist', status: 'Active', avatar: 'SJ', lastLogin: '2025-01-17 11:20' },
      { id: 5, username: 'david_brown', email: 'david.brown@company.com', firstName: 'David', lastName: 'Brown', phone: '+1 (555) 567-8901', department: 'Finance', role: 'Financial Analyst', status: 'Suspended', avatar: 'DB', lastLogin: '2025-01-10 13:30' },
      { id: 6, username: 'lisa_davis', email: 'lisa.davis@company.com', firstName: 'Lisa', lastName: 'Davis', phone: '+1 (555) 678-9012', department: 'Engineering', role: 'UI/UX Designer', status: 'Active', avatar: 'LD', lastLogin: '2025-01-17 10:45' }
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

  // Event handlers
  const handleAddUser = () => {
    console.log('Add user clicked');
    // Add your logic here
  };
  const handleViewUser = (user) => { console.log('View user:', user); };
  const handleEditUser = (user) => { console.log('Edit user:', user); };
  const handleDeleteUser = (user) => { console.log('Delete user:', user); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Content wrapper with responsive padding */}
      <div className="px-2 sm:px-4 md:px-8 py-4 sm:py-6 max-w-full md:max-w-4xl xl:max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg flex items-center">
              <Users className="text-white" size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-slate-700">User Management</h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg font-light ml-0 sm:ml-14">
            Manage and organize your team members
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {[
            { label: 'Total Users', value: users.length, color: 'indigo' },
            { label: 'Active Users', value: users.filter(u => u.status === 'Active').length, color: 'green' },
            { label: 'Inactive Users', value: users.filter(u => u.status === 'Inactive').length, color: 'gray' },
            { label: 'Suspended Users', value: users.filter(u => u.status === 'Suspended').length, color: 'red' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-xl rounded-xl p-2 sm:p-4 border border-indigo-200/50 shadow-lg flex flex-col justify-center items-center"
            >
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-600 text-center">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Controls Component */}
        <UserControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterDepartment={filterDepartment}
          setFilterDepartment={setFilterDepartment}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onAddUser={handleAddUser}
        />

        {/* Table Component */}
        <div className="w-full overflow-x-auto">
          <UserTable
            paginatedUsers={paginatedUsers}
            filteredUsers={filteredUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
>>>>>>> ankita
