// userFields.js
export const userFields = [
  { name: "userType", label: "User Type", type: "select", required: true, options: ["Admin", "Manager", "Employee"] },
  { name: "employeeId", label: "Employee ID", type: "text", disabled: true, placeholder: "Will be auto-generated" },
  { name: "designation", label: "Designation", type: "text", placeholder: "e.g., Software Engineer, Marketing Manager" },
  { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "role", label: "Role", type: "select", options: ["Admin", "Manager", "Employee"] },
  { name: "phoneNumber", label: "Phone Number", type: "text" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "dateOfJoining", label: "Date of Joining", type: "date" },
  { name: "dateOfAnniversary", label: "Date of Anniversary", type: "date" },
  { name: "profilePicture", label: "Profile Picture", type: "file" },
];
