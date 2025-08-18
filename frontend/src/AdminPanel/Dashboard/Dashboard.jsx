import React, { useState, useEffect } from "react";
import BirthdayCard from "./BirthdayCard";
import StatusCard from "./StatusCard";
import { 
  User, 
  Briefcase, 
  Building2, 
  Layers, 
  Sparkles, 
  Calendar,
  Heart,
  Star,
  TrendingUp 
} from "lucide-react";
import { statusCardsConfig,birthdayCardsConfig } from "../Api/Api";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Connection network pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="dashboard-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" className="text-indigo-400"/>
                <circle cx="18" cy="18" r="1" fill="currentColor" className="text-blue-400"/>
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="0.5" className="text-indigo-300"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dashboard-pattern)"/>
          </svg>
        </div>


      </div>

      {/* Greeting */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg">
            <User className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-light text-slate-700 flex items-center gap-2">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 font-medium">Sumeet</span>
          </h1>
          <Sparkles className="text-amber-500 animate-pulse" size={24} />
        </div>
        <p className="text-slate-600 text-lg font-light ml-14">
          Here's what's happening in your connection hub today ✨
        </p>
      </div>

      {/* Status Cards from Array */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10 relative z-10">
        {statusCardsConfig.map((card, index) => (
          <StatusCard
            key={card.id}
            title={card.title}
            count={card.count}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            subtitle={card.subtitle}
          />
        ))}
      </div>

      {/* Birthday Section from Array */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {birthdayCardsConfig.map((card, index) => (
          <BirthdayCard
            key={index}
            title={card.title}
            emoji={card.emoji}
            data={card.data}
            emptyMessage={card.emptyMessage}
            color={card.color}
          />
        ))}
      </div>

      
    </div>
  );
};

export default Dashboard;
