import React, { useState, useEffect } from "react";
import BirthdayCard from "./BirthdayCard";
import StatusCard from "./StatusCard";
import { Users, Briefcase, Building2, Layers } from "lucide-react";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning 🌅");
    else if (hour < 18) setGreeting("Good Afternoon ☀️");
    else setGreeting("Good Evening 🌙");
  }, []);

  // Sample data
  const todayBirthdays = [
    { name: "Ankita", date: "17 Aug" },
    { name: "Rahul", date: "17 Aug" },
  ];

  const upcomingBirthdays = [
    { name: "Sneha", date: "18 Aug" },
    { name: "Amit", date: "20 Aug" },
    { name: "Priya", date: "22 Aug" },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-pink-50">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          {greeting}, <span className="text-yellow-600">Ankita</span> 👋
        </h1>
        <p className="text-gray-600 mt-1 text-lg">
          Here’s what’s happening today ✨
        </p>
      </div>

      {/* 🔹 Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatusCard
          title="Total Users"
          count={120}
          icon={Users}
          color={{
            text: "text-blue-700",
            border: "border-blue-100",
            bg: "bg-blue-50",
            hover: "bg-blue-100",
            iconBg: "bg-blue-200",
            iconText: "text-blue-800",
          }}
        />
       
        
      </div>

      {/* 🔹 Birthday Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BirthdayCard
          title="Today’s Birthdays"
          emoji="🎂"
          data={todayBirthdays}
          emptyMessage="No birthdays today 🎉"
          color={{
            text: "text-indigo-700",
            border: "border-indigo-100",
            bg: "bg-indigo-50",
            hover: "bg-indigo-100",
            badgeBg: "bg-indigo-200",
            badgeText: "text-indigo-800",
          }}
        />

        <BirthdayCard
          title="Upcoming Birthdays"
          emoji="📅"
          data={upcomingBirthdays}
          emptyMessage="No upcoming birthdays 🎈"
          color={{
            text: "text-green-700",
            border: "border-green-100",
            bg: "bg-green-50",
            hover: "bg-green-100",
            badgeBg: "bg-green-200",
            badgeText: "text-green-800",
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
