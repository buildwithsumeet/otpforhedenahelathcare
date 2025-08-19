import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import UserControls from "./UserControls";
import UserTable from "./UserTable";
import AddUserModal from "./AddUserModal";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Add this for edit mode

  // Handle add user button click from UserControls
  const handleAddUser = () => {
    setEditingUser(null); // Clear editing user for add mode
    setIsModalOpen(true);
  };

  // Handle edit user button click from table
  const handleEditUser = (user) => {
    console.log('Edit user:', user);
    setEditingUser(user); // Set user for edit mode
    setIsModalOpen(true);
  };

  // Handle form submission from modal (both add and edit)
  const handleUserAdd = (userData) => {
    console.log('Received form data:', userData);
    
    if (editingUser) {
      // Edit existing user
      const updatedUser = {
        ...editingUser,
        ...userData,
        // Keep original ID and creation data
        id: editingUser.id,
        avatar: userData.fullName ? 
          userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 
          editingUser.avatar,
        lastLogin: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ''),
        // Map fields for compatibility
        username: userData.fullName?.toLowerCase().replace(/\s+/g, '_') || editingUser.username,
        firstName: userData.fullName?.split(' ')[0] || editingUser.firstName,
        lastName: userData.fullName?.split(' ').slice(1).join(' ') || editingUser.lastName,
        phone: userData.phoneNumber || userData.phone || editingUser.phone,
        department: userData.designation?.split(' ')[0] || userData.department || editingUser.department,
        role: userData.role || userData.designation || editingUser.role,
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
      };

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id ? updatedUser : user
        )
      );
      
      console.log('User updated:', updatedUser);
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        username: userData.fullName?.toLowerCase().replace(/\s+/g, '_') || `user_${Date.now()}`,
        email: userData.email || '',
        firstName: userData.fullName?.split(' ')[0] || '',
        lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
        phone: userData.phoneNumber || '',
        department: userData.designation?.split(' ')[0] || 'General',
        role: userData.role || userData.designation || '',
        status: userData.status || 'Active',
        avatar: userData.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
        lastLogin: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ''),
        ...userData,
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
      };

      setUsers(prevUsers => [...prevUsers, newUser]);
      console.log('New user added:', newUser);
    }

    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null); // Clear editing user when modal closes
  };

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
        fullName: 'John Doe',
        phoneNumber: '+1 (555) 123-4567',
        designation: 'Senior Developer',
        userType: 'Employee',
        employeeId: 'EMP001',
        gender: 'Male'
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
        fullName: 'Jane Smith',
        phoneNumber: '+1 (555) 234-5678',
        designation: 'Marketing Manager',
        userType: 'Employee',
        employeeId: 'EMP002',
        gender: 'Female'
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
        fullName: 'Mike Wilson',
        phoneNumber: '+1 (555) 345-6789',
        designation: 'Sales Representative',
        userType: 'Employee',
        employeeId: 'EMP003',
        gender: 'Male'
      }
    ]);
  }, []);

  // UPDATED: Filtering logic to work with both field types
  const filteredUsers = users.filter(user => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      (user.firstName && user.firstName.toLowerCase().includes(searchText)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchText)) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchText)) ||
      (user.username && user.username.toLowerCase().includes(searchText)) ||
      (user.email && user.email.toLowerCase().includes(searchText));
    
    const matchesDepartment = !filterDepartment || 
      user.department === filterDepartment ||
      (user.designation && user.designation.includes(filterDepartment));
    
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Event handlers
  const handleViewUser = (user) => {
    console.log('View user:', user);
    // Add your view logic here
  };

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user);
    setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
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
          onEditUser={handleEditUser} // Pass edit handler
          onDeleteUser={handleDeleteUser}
        />
        
        {/* Add/Edit User Modal */}
        <AddUserModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleUserAdd}
          editingUser={editingUser} // Pass editing user data
        />
      </div>
    </div>
  );
};

export default UserManagement;
