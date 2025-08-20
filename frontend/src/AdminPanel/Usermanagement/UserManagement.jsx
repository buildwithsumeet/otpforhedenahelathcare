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
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real application, this would be an actual API call
        // For demonstration, we'll simulate the API response
        const apiResponse = {
          statusCode: 200,
          message: [
            {
              _id: "68a0c08810a895958ec3e192",
              name: "admin",
              email: "admin@gmail.com",
              avatar: "http://res.cloudinary.com/dfqcptgtp/image/upload/v1755365512/gnrzke6jjxhgujbqwasd.png",
              role: "superadmin",
              anniversary: "19/08/2024",
              dob: "21/08/1999",
              createdAt: "2025-08-16T17:31:52.980Z",
              updatedAt: "2025-08-20T07:19:01.828Z",
              __v: 0,
              isActive: true,
              isDeleted: false
            },
            {
              _id: "68a182c077e62689c766bc6f",
              name: "user2001",
              email: "user2001@gmail.com",
              avatar: "http://res.cloudinary.com/dfqcptgtp/image/upload/v1755415231/vnxhpj7gzizjaly5n6h4.png",
              phonenumber: "9090384201",
              role: "user",
              anniversary: "20/08/2024",
              dob: "19/08/1999",
              isActive: true,
              isDeleted: false,
              createdAt: "2025-08-17T07:20:32.398Z",
              updatedAt: "2025-08-17T07:20:32.398Z",
              __v: 0
            },
            {
              _id: "68a1862ddcfa61efe5c0f6ee",
              name: "admin1",
              email: "admin1@gmail.com",
              avatar: "http://res.cloudinary.com/dfqcptgtp/image/upload/v1755416108/nxf5jghcklrtxcnxofyd.png",
              phonenumber: "1234567890",
              role: "user",
              anniversary: "19/08/2024",
              dob: "20/08/1999",
              isActive: true,
              isDeleted: false,
              createdAt: "2025-08-17T07:35:09.209Z",
              updatedAt: "2025-08-17T07:35:09.209Z",
              __v: 0
            }
          ],
          data: "Users fetched successfully",
          success: true
        };

        // Transform API data to match our component's expected format
        const transformedUsers = apiResponse.message.map(user => ({
          id: user._id,
          username: user.name,
          email: user.email,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ').length > 1 ? user.name.split(' ')[1] : '',
          phone: user.phonenumber || 'N/A',
          department: user.role === 'superadmin' ? 'Administration' : 'General',
          role: user.role,
          status: user.isActive ? 'Active' : 'Inactive',
          avatar: user.avatar,
          lastLogin: new Date(user.updatedAt).toLocaleString()
        }));

        setUsers(transformedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-700">Loading users...</p>
        </div>
      </div>
    );
  }

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