// userFields.js
export const userFields = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phonenumber", label: "Phone Number", type: "text" },
  { name: "role", label: "Role", type: "select", required: true, options: ["superadmin", "admin", "user"] },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "anniversary", label: "Date of Anniversary", type: "date" },
  { name: "avatar", label: "Profile Picture", type: "file" },
  { name: "password", label: "Password", type: "password", required: true },
];