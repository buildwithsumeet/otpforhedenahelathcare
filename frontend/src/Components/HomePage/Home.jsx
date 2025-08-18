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
import { useUser } from "../../ContextApi/UserContext";

// Import the updated component
import TodayCelebrations from "./TodayCelebrations";
import UpcomingAnniversaries from "./UpcomeingAnniversaries";
import UpcomingBirthdays from "./UpcomeingBirthdays";

const Home = () => {
  const { user } = useUser(); // get user from context

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
      {/* Background Elements */}
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

        {/* Premium floating elements - Made responsive */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-20 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full animate-float shadow-xl opacity-70"></div>
        <div className="absolute top-20 sm:top-40 right-8 sm:right-32 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full animate-float-delay-1 shadow-xl opacity-60"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-8 sm:left-32 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full animate-float-delay-2 shadow-xl opacity-80"></div>
        <div className="absolute top-32 sm:top-60 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full animate-float-delay-3 shadow-xl opacity-70"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full animate-float shadow-xl opacity-75"></div>
        <div className="absolute top-1/3 left-3 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-float-delay-1 shadow-xl opacity-65"></div>
        
        {/* Connection lines - Made responsive */}
        <div className="absolute top-16 sm:top-32 right-10 sm:right-40 w-8 sm:w-16 h-0.5 bg-gradient-to-r from-indigo-300/30 to-cyan-300/30 rounded-full animate-float-delay-2 shadow-sm"></div>
        <div className="absolute bottom-20 sm:bottom-40 left-1/4 w-10 sm:w-20 h-0.5 bg-gradient-to-r from-blue-300/30 to-teal-300/30 rounded-full animate-float-delay-3 shadow-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-6 sm:w-12 h-0.5 bg-gradient-to-r from-cyan-300/30 to-indigo-300/30 rounded-full animate-float shadow-sm"></div>

        {/* Geometric shapes - Made responsive */}
        <div className="absolute top-12 sm:top-24 left-1/2 w-4 h-4 sm:w-8 sm:h-8 border border-indigo-300/20 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-12 sm:bottom-24 right-1/3 w-6 h-6 sm:w-12 sm:h-12 border border-cyan-300/20 rounded-full animate-pulse delay-1000 opacity-30"></div>
        <div className="absolute top-1/2 left-5 sm:left-20 w-3 h-3 sm:w-6 sm:h-6 border border-blue-300/20 rounded-full animate-pulse delay-2000 opacity-50"></div>
      </div>

      {/* Hero Section - Made fully responsive */}
      <div className={`relative z-10 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-16 lg:py-20  lg:px-8">
          <div className="text-center">
            {/* Welcome Badge - Made responsive */}
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-xl px-4 sm:px-6 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-full mb-4 sm:mb-6 lg:mb-8 border border-indigo-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full animate-pulse shadow-lg"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full animate-pulse delay-200 shadow-sm"></div>
              </div>
              <span className="text-slate-700 font-semibold tracking-wide text-sm sm:text-base lg:text-lg">Welcome to</span>
              <div className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-full">
                <span className="text-white font-bold text-sm sm:text-base lg:text-lg tracking-wide">LetsConnect</span>
              </div>
              <Sparkles className="text-amber-500 animate-pulse" size={16} />
            </div>
            
            {/* Typography - Made responsive */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight">
                <span className="text-slate-700 block">{greeting},</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 font-medium">
                  {user?.name || "Guest"}
                </span>

              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl lg:max-w-2xl mx-auto font-light leading-relaxed px-4 sm:px-0">
                Your personal connection hub where every relationship matters and no celebration goes unnoticed.
              </p>
            </div>

            {/* Stats - Made responsive */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-0">
              {[
                { icon: Users, label: "Connections", value: "124", color: "indigo" },
                { icon: Calendar, label: "Events", value: "18", color: "cyan" },
                { icon: Star, label: "Celebrations", value: "32", color: "blue" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`group transition-all duration-500 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-50 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md`}>
                        <stat.icon className={`text-${stat.color}-600`} size={16} />
                      </div>
                      <div className="text-left">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">{stat.value}</div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Made responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-16 lg:pb-20  lg:px-8 relative z-10">
        
        {/* Today's Celebrations Component */}
        <TodayCelebrations 
          birthdays={todayBirthdays}
          anniversaries={todayAnniversaries}
          importantDays={todayImportantDays}
          isVisible={isVisible}
        />

        {/* Upcoming Events Grid - Made responsive */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 transition-all duration-1000 delay-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <UpcomingBirthdays upcomingBirthdays={upcomingBirthdays} />
          <UpcomingAnniversaries upcomingAnniversaries={upcomingAnniversaries} />
        </div>
      </div>

      {/* Custom CSS - Enhanced for responsiveness */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-15px) rotate(180deg);
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
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-float { 
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-delay-1 { 
            animation: float 8s ease-in-out infinite 2s;
          }
          .animate-float-delay-2 { 
            animation: float 8s ease-in-out infinite 4s;
          }
          .animate-float-delay-3 { 
            animation: float 8s ease-in-out infinite 6s;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
