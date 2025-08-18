import { 
  User, 
  Briefcase, 
  Building2, 
  Layers, 
  Sparkles, 
  Calendar,
  Heart,
  Star,
  TrendingUp,
  Gift,
  Cake 
} from "lucide-react";

// Status Cards Configuration Array
export const statusCardsConfig = [
  {
    id: "total-users",
    title: "Total Users",
    count: 1250,
    icon: User,
    trend: "+12%",
    subtitle: "Active members",
    color: {
      text: "text-indigo-700",
      border: "border-indigo-200/50",
      bg: "bg-indigo-50/80",
      hover: "bg-indigo-100/80",
      iconBg: "bg-gradient-to-br from-indigo-500 to-blue-500",
      iconText: "text-white",
    }
  },
//   {
//     id: "active-events",
//     title: "Active Events",
//     count: 24,
//     icon: Calendar,
//     trend: "+8%",
//     subtitle: "This month",
//     color: {
//       text: "text-cyan-700",
//       border: "border-cyan-200/50",
//       bg: "bg-cyan-50/80",
//       hover: "bg-cyan-100/80",
//       iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500",
//       iconText: "text-white",
//     }
//   },
//   {
//     id: "celebrations",
//     title: "Celebrations",
//     count: 156,
//     icon: Heart,
//     trend: "+25%",
//     subtitle: "This year",
//     color: {
//       text: "text-rose-700",
//       border: "border-rose-200/50",
//       bg: "bg-rose-50/80",
//       hover: "bg-rose-100/80",
//       iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
//       iconText: "text-white",
//     }
//   },
//   {
//     id: "engagement",
//     title: "Engagement",
//     count: 89,
//     icon: TrendingUp,
//     trend: "+15%",
//     subtitle: "Average %",
//     color: {
//       text: "text-emerald-700",
//       border: "border-emerald-200/50",
//       bg: "bg-emerald-50/80",
//       hover: "bg-emerald-100/80",
//       iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
//       iconText: "text-white",
//     }
//   }
];

// Birthday Cards Configuration Array
export const birthdayCardsConfig = [
  {
    title: "Today's Celebrations",
    icon: Gift, // 🎉 replaced with Lucide Gift
    data: [
      { name: "Ankita", date: "17 Aug" },
      { name: "Rahul", date: "17 Aug" },
    ],
    emptyMessage: "No celebrations today",
    color: {
      text: "text-rose-700",
      border: "border-rose-200/50",
      bg: "bg-gradient-to-br from-white to-rose-50/50",
      hover: "bg-rose-100/50",
      badgeBg: "bg-gradient-to-br from-rose-400 to-pink-400",
      badgeText: "text-white",
    }
  },
  {
    title: "Upcoming Birthdays",
    icon: Cake, // 📅 replaced with Lucide Cake
    data: [
      { name: "Sneha", date: "18 Aug" },
      { name: "Amit", date: "20 Aug" },
      { name: "Priya", date: "22 Aug" },
    ],
    emptyMessage: "No upcoming birthdays",
    color: {
      text: "text-emerald-700",
      border: "border-emerald-200/50",
      bg: "bg-gradient-to-br from-white to-emerald-50/50",
      hover: "bg-emerald-100/50",
      badgeBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      badgeText: "text-white",
    }
  }
];
