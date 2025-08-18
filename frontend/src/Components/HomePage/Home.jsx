import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Heart, 
  Gift, 
  Users, 
  Bell,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Plus
} from "lucide-react";

// Import the updated component
import TodayCelebrations from "./TodayCelebrations";
import UpcomingAnniversaries from "./UpcomeingAnniversaries";
import UpcomingBirthdays from "./UpcomeingBirthdays";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    
    // Trigger entrance animations
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Today's celebrations data
  const todayBirthdays = [
    { name: "Ankita Sharma", relation: "Family", avatar: "A", age: 28 },
    { name: "Rahul Patel", relation: "Colleague", avatar: "R", age: 32 },
    { name: "Priya Singh", relation: "Friend", avatar: "P", age: 25 },
  ];

  const todayAnniversaries = [
    { couple: "Rajesh & Meera", years: "25th", avatar: "R" },
    { couple: "Vikram & Sita", years: "5th", avatar: "V" },
  ];

  const todayImportantDays = [
    { 
      title: "Independence Day", 
      category: "National Holiday", 
      type: "Holiday",
      description: "India's Independence Day celebration"
    },
    // { 
    //   title: "Company Anniversary", 
    //   category: "Work Event", 
    //   type: "Corporate",
    //   description: "Our company's founding day"
    // },
  ];

  const upcomingBirthdays = [
    { name: "Sneha Kumar", date: "18 Aug", relation: "Friend", avatar: "S", daysLeft: 1 },
    { name: "Amit Singh", date: "20 Aug", relation: "Family", avatar: "A", daysLeft: 3 },
    { name: "Priya Jain", date: "22 Aug", relation: "Colleague", avatar: "P", daysLeft: 5 },
  ];

  const upcomingAnniversaries = [
    { couple: "Rajesh & Meera", date: "19 Aug", years: "25th", avatar: "R", daysLeft: 2 },
    { couple: "Vikram & Sita", date: "24 Aug", years: "5th", avatar: "V", daysLeft: 7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Elements - (keeping same as before) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Connection network pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="connection-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" className="text-indigo-400"/>
                <circle cx="18" cy="18" r="1" fill="currentColor" className="text-blue-400"/>
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="0.5" className="text-indigo-300"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#connection-pattern)"/>
          </svg>
        </div>

        {/* Premium floating elements */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full animate-float shadow-xl opacity-70"></div>
        <div className="absolute top-40 right-32 w-4 h-4 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full animate-float-delay-1 shadow-xl opacity-60"></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full animate-float-delay-2 shadow-xl opacity-80"></div>
        <div className="absolute top-60 left-1/2 w-3 h-3 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full animate-float-delay-3 shadow-xl opacity-70"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full animate-float shadow-xl opacity-75"></div>
        <div className="absolute top-1/3 left-10 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-float-delay-1 shadow-xl opacity-65"></div>
        
        {/* Connection lines */}
        <div className="absolute top-32 right-40 w-16 h-0.5 bg-gradient-to-r from-indigo-300/30 to-cyan-300/30 rounded-full animate-float-delay-2 shadow-sm"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-0.5 bg-gradient-to-r from-blue-300/30 to-teal-300/30 rounded-full animate-float-delay-3 shadow-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-0.5 bg-gradient-to-r from-cyan-300/30 to-indigo-300/30 rounded-full animate-float shadow-sm"></div>

        {/* Geometric shapes */}
        <div className="absolute top-24 left-1/2 w-8 h-8 border border-indigo-300/20 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-24 right-1/3 w-12 h-12 border border-cyan-300/20 rounded-full animate-pulse delay-1000 opacity-30"></div>
        <div className="absolute top-1/2 left-20 w-6 h-6 border border-blue-300/20 rounded-full animate-pulse delay-2000 opacity-50"></div>
      </div>

      {/* Hero Section - (keeping same as before) */}
      <div className={`relative z-10 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-xl px-10 py-4 rounded-full mb-8 border border-indigo-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full animate-pulse shadow-lg"></div>
                <div className="w-2 h-2 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full animate-pulse delay-200 shadow-sm"></div>
              </div>
              <span className="text-slate-700 font-semibold tracking-wide text-lg">Welcome to</span>
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-full">
                <span className="text-white font-bold text-lg tracking-wide">LetsConnect</span>
              </div>
              <Sparkles className="text-amber-500 animate-pulse" size={20} />
            </div>
            
            {/* Typography */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-light tracking-tight">
                <span className="text-slate-700 block">{greeting},</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 font-medium">
                  Sumeet
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                Your personal connection hub where every relationship matters and no celebration goes unnoticed.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { icon: Users, label: "Connections", value: "124", color: "indigo" },
                { icon: Calendar, label: "Events", value: "18", color: "cyan" },
                { icon: Star, label: "Celebrations", value: "32", color: "blue" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`group transition-all duration-500 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-50 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md`}>
                        <stat.icon className={`text-${stat.color}-600`} size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                        <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8 relative z-10">
        
        {/* Today's Celebrations Component - Updated */}
        <TodayCelebrations 
          birthdays={todayBirthdays}
          anniversaries={todayAnniversaries}
          importantDays={todayImportantDays}
          isVisible={isVisible}
        />

        {/* Upcoming Events Grid */}
        <div className={`grid lg:grid-cols-2 gap-8 transition-all duration-1000 delay-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <UpcomingBirthdays upcomingBirthdays={upcomingBirthdays} />
          <UpcomingAnniversaries upcomingAnniversaries={upcomingAnniversaries} />
        </div>

        {/* Quick Actions - (keeping same as before) */}
        {/* <div className={`mt-16 transition-all duration-1000 delay-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-10">
            <h3 className="text-3xl font-light text-slate-800 mb-10 text-center tracking-wide">Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: Users, label: "Add Contact", color: "indigo", gradient: "from-indigo-500 to-blue-500" },
                { icon: Calendar, label: "Add Event", color: "cyan", gradient: "from-cyan-500 to-teal-500" },
                { icon: Bell, label: "Set Reminder", color: "blue", gradient: "from-blue-500 to-indigo-500" },
                { icon: Gift, label: "Send Wish", color: "rose", gradient: "from-rose-500 to-pink-500" },
              ].map((action, index) => (
                <button 
                  key={index}
                  className={`group bg-gradient-to-br from-${action.color}-50 to-${action.color}-100/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border-${action.color}-100/50 hover:-translate-y-2`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                    <action.icon size={28} />
                  </div>
                  <p className={`text-${action.color}-700 font-semibold text-center text-lg`}>{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div> */}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-25px) rotate(180deg);
            opacity: 1;
          }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { 
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-delay-1 { 
          animation: float 10s ease-in-out infinite 2.5s;
        }
        .animate-float-delay-2 { 
          animation: float 10s ease-in-out infinite 5s;
        }
        .animate-float-delay-3 { 
          animation: float 10s ease-in-out infinite 7.5s;
        }
        .animate-bounce-slow { 
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Home;
