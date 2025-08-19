import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Heart, Calendar, Phone, Mail, MapPin, X, CheckCircle, UserPlus, GitBranch, Search, Filter, Grid3X3, List } from 'lucide-react';

const FamilyTreeComponent = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelation, setFilterRelation] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tree'

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    dob: '',
    anniversary: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    parentId: null
  });

  // Sample family data
  useEffect(() => {
    setFamilyMembers([
      {
        id: 1,
        name: 'John Smith',
        relationship: 'Father',
        dob: '1965-03-15',
        anniversary: '1990-06-20',
        phone: '+1 555-123-4567',
        email: 'john@example.com',
        address: '123 Main St, City',
        notes: 'Family patriarch, loves gardening',
        avatar: 'JS',
        parentId: null,
        children: [4, 5]
      },
      {
        id: 2,
        name: 'Sarah Smith',
        relationship: 'Mother',
        dob: '1968-08-22',
        anniversary: '1990-06-20',
        phone: '+1 555-987-6543',
        email: 'sarah@example.com',
        address: '123 Main St, City',
        notes: 'Great cook, book club member',
        avatar: 'SS',
        parentId: null,
        children: [4, 5]
      },
      {
        id: 4,
        name: 'Michael Smith',
        relationship: 'Son',
        dob: '1992-12-10',
        phone: '+1 555-456-7890',
        email: 'michael@example.com',
        address: '456 Oak Ave, City',
        notes: 'Software engineer, married to Lisa',
        avatar: 'MS',
        parentId: 1,
        children: [6]
      },
      {
        id: 5,
        name: 'Emily Johnson',
        relationship: 'Daughter',
        dob: '1995-04-18',
        anniversary: '2020-09-12',
        phone: '+1 555-321-0987',
        email: 'emily@example.com',
        address: '789 Pine St, City',
        notes: 'Teacher, loves traveling',
        avatar: 'EJ',
        parentId: 1,
        children: []
      },
      {
        id: 6,
        name: 'Alex Smith',
        relationship: 'Grandchild',
        dob: '2020-01-05',
        notes: 'Loves cartoons and toys',
        avatar: 'AS',
        parentId: 4,
        children: []
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

  // Generate avatar initials
  const generateAvatar = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Calculate age
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Filter and search members
  const filteredMembers = familyMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.relationship.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterRelation || member.relationship === filterRelation;
    return matchesSearch && matchesFilter;
  });

  // Get unique relationships for filter
  const relationships = [...new Set(familyMembers.map(m => m.relationship))];

  // Open add modal
  const handleAddMember = (parentId = null) => {
    setEditingMember(null);
    setFormData({
      name: '',
      relationship: '',
      dob: '',
      anniversary: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      parentId: parentId
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditMember = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      dob: member.dob || '',
      anniversary: member.anniversary || '',
      phone: member.phone || '',
      email: member.email || '',
      address: member.address || '',
      notes: member.notes || '',
      parentId: member.parentId
    });
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    const memberData = {
      id: editingMember ? editingMember.id : Date.now(),
      name: formData.name,
      relationship: formData.relationship,
      dob: formData.dob,
      anniversary: formData.anniversary,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      notes: formData.notes,
      avatar: generateAvatar(formData.name),
      parentId: formData.parentId,
      children: editingMember ? editingMember.children || [] : []
    };

    if (editingMember) {
      setFamilyMembers(prev => prev.map(member => 
        member.id === editingMember.id ? memberData : member
      ));
      setSuccessAlert({ message: `${memberData.name} updated successfully!` });
    } else {
      setFamilyMembers(prev => [...prev, memberData]);
      setSuccessAlert({ message: `${memberData.name} added to family tree!` });
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  // Delete member
  const handleDeleteMember = (memberId) => {
    const memberToDelete = familyMembers.find(m => m.id === memberId);
    setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
    setSuccessAlert({ message: `${memberToDelete?.name} removed from family tree!` });
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // Member Card Component
  const MemberCard = ({ member }) => (
    <div className="group bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4 text-white relative">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {member.avatar}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
              {member.relationship}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={() => handleEditMember(member)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => handleDeleteMember(member.id)}
              className="p-2 bg-white/20 hover:bg-red-500/80 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Age & Birthday */}
        {member.dob && (
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={14} className="text-indigo-500" />
            <span className="text-sm">
              Age {calculateAge(member.dob)} • {new Date(member.dob).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {/* Anniversary */}
        {member.anniversary && (
          <div className="flex items-center gap-2 text-slate-600">
            <Heart size={14} className="text-red-500" />
            <span className="text-sm">
              Anniversary {new Date(member.anniversary).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {/* Contact Info */}
        <div className="space-y-2">
          {member.phone && (
            <div className="flex items-center gap-2 text-slate-600">
              <Phone size={14} className="text-green-500" />
              <span className="text-sm">{member.phone}</span>
            </div>
          )}
          
          {member.email && (
            <div className="flex items-center gap-2 text-slate-600">
              <Mail size={14} className="text-blue-500" />
              <span className="text-sm truncate">{member.email}</span>
            </div>
          )}
          
          {member.address && (
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={14} className="text-purple-500" />
              <span className="text-xs">{member.address}</span>
            </div>
          )}
        </div>
        
        {/* Notes */}
        {member.notes && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-300">
            <p className="text-xs text-slate-600 italic">{member.notes}</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4">
        <button
          onClick={() => handleAddMember(member.id)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors text-sm font-medium"
        >
          <UserPlus size={14} />
          Add Family Member
        </button>
      </div>
    </div>
  );

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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl shadow-lg">
              <GitBranch className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Family Tree</h1>
              <p className="text-slate-600 text-lg">
                Stay connected with family members and never miss important dates
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search family members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={filterRelation}
                  onChange={(e) => setFilterRelation(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">All Relations</option>
                  {relationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Toggle & Add Button */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'tree' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                  title="Tree View"
                >
                  <GitBranch size={16} />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleAddMember()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg font-medium"
              >
                <Plus size={16} />
                Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Family Members Display */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg p-6">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-16">
              <GitBranch className="mx-auto mb-4 text-slate-400" size={64} />
              <h3 className="text-2xl font-semibold text-slate-600 mb-2">
                {familyMembers.length === 0 ? 'No Family Members Yet' : 'No Members Found'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {familyMembers.length === 0 
                  ? 'Start building your family tree by adding the first member'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {familyMembers.length === 0 && (
                <button
                  onClick={() => handleAddMember()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg font-medium mx-auto"
                >
                  <Plus size={18} />
                  Add First Member
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-700">
                  {filteredMembers.length} {filteredMembers.length === 1 ? 'Member' : 'Members'}
                  {searchTerm && ` matching "${searchTerm}"`}
                  {filterRelation && ` in "${filterRelation}"`}
                </h3>
              </div>

              {/* Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Member Modal - Same as before */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg">
                    <Users className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {editingMember ? 'Edit Family Member' : 'Add Family Member'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block font-medium text-slate-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block font-medium text-slate-700 mb-2">Relationship</label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Grandson">Grandson</option>
                      <option value="Granddaughter">Granddaughter</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Cousin">Cousin</option>
                      <option value="Spouse">Spouse</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block font-medium text-slate-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Anniversary */}
                  <div>
                    <label className="block font-medium text-slate-700 mb-2">Anniversary</label>
                    <input
                      type="date"
                      name="anniversary"
                      value={formData.anniversary}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="+1 555-123-4567"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block font-medium text-slate-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="123 Main St, City, State"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block font-medium text-slate-700 mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      placeholder="Additional notes about this family member"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-slate-200">
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
                    <Users size={16} />
                    {editingMember ? 'Update Member' : 'Add Member'}
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

export default FamilyTreeComponent;
