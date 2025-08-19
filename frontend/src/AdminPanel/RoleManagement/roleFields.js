export const permissionCategories = [
  {
    category: "alert_days",
    permissions: [
      "show event",
      "show import",
      "add days", 
      "view days",
      "delete days",
      "edit days",
      "add holiday",
      "organization tree"
    ]
  },
  {
    category: "Company Management", 
    permissions: ["View", "Create", "Edit", "Delete", "Status"]
  },
  {
    category: "Department",
    permissions: ["View", "Create", "Edit", "Delete", "Status"] 
  },
  {
    category: "eod",
    permissions: ["eod_report", "eod_submit", "eod_history"]
  },
  {
    category: "User Management",
    permissions: ["View", "Create", "Edit", "Delete", "Status"]
  },
  {
    category: "Projects", 
    permissions: ["View", "Create", "Edit", "Delete", "Assign"]
  }
];

export const defaultRoles = [
  {
    id: 1,
    roleName: "Higher Admin",
    description: "all access",
    permissions: {
      "alert_days": ["show event", "show import", "add days", "view days", "delete days", "edit days", "add holiday", "organization tree"],
      "Company Management": ["View", "Create", "Edit", "Delete", "Status"],
      "Department": ["View", "Create", "Edit", "Delete", "Status"],
      "eod": ["eod_report", "eod_submit", "eod_history"],
      "User Management": ["View", "Create", "Edit", "Delete", "Status"],
      "Projects": ["View", "Create", "Edit", "Delete", "Assign"]
    }
  },
  {
    id: 2,
    roleName: "Brand Manager", 
    description: "Brand Manager",
    permissions: {
      "alert_days": ["show event", "view days"],
      "Company Management": ["View"],
      "Department": ["View"],
      "eod": ["eod_report", "eod_submit"],
      "User Management": ["View"],
      "Projects": ["View", "Edit"]
    }
  }
];
