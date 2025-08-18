import React from 'react';
import { Gift, Sparkles, ArrowRight, Heart, Star, Calendar } from 'lucide-react';

const TodayCelebrations = ({ 
  birthdays = [], 
  anniversaries = [], 
  importantDays = [], 
  isVisible 
}) => {
  const totalCelebrations = birthdays.length + anniversaries.length + importantDays.length;
  
  if (totalCelebrations === 0) {
    return null;
  }

  const getDescriptionText = () => {
    const parts = [];
    if (birthdays.length > 0) {
      parts.push(`${birthdays.length} birthday${birthdays.length > 1 ? 's' : ''}`);
    }
    if (anniversaries.length > 0) {
      parts.push(`${anniversaries.length} anniversar${anniversaries.length > 1 ? 'ies' : 'y'}`);
    }
    if (importantDays.length > 0) {
      parts.push(`${importantDays.length} important day${importantDays.length > 1 ? 's' : ''}`);
    }
    
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts.join(' and ');
    return parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
  };

  return (
    <div className={`mb-12 -mt-6 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between text-white">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <Gift size={24} className="animate-pulse" />
                </div>
                <h2 className="text-3xl font-light tracking-wide">Today's Celebrations</h2>
              </div>
              <p className="text-rose-100 text-base font-light">
                {getDescriptionText()} happening today
              </p>
            </div>
            <div className="text-4xl opacity-20 animate-bounce-slow">✨</div>
          </div>
        </div>
        
        {/* Celebration Cards */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Birthday Cards */}
            {birthdays.map((person, index) => (
              <div 
                key={`birthday-${index}`}
                className={`group transition-all duration-500 delay-${index * 100} hover:-translate-y-2`}
              >
                <div className="bg-gradient-to-br from-white to-rose-50/50 rounded-2xl p-5 border border-rose-100/50 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                  {/* Birthday Decorative Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-rose-200/30 to-transparent rounded-bl-full"></div>
                  
                  {/* Birthday Profile */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {person.avatar}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
                        <span className="text-xs">🎂</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">{person.name}</h3>
                      <p className="text-slate-600 text-sm mb-2">{person.relation}</p>
                      <div className="inline-flex items-center gap-1 bg-rose-100 px-2 py-1 rounded-full">
                        <Sparkles className="text-rose-500" size={12} />
                        <span className="text-rose-600 font-medium text-xs">Turning {person.age}</span>
                      </div>
                    </div>
                  </div>

                  {/* Birthday Action */}
                  <button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:from-rose-600 group-hover:to-pink-600 flex items-center justify-center gap-2 text-sm">
                    <Gift size={16} />
                    Send Birthday Wishes
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}

            {/* Anniversary Cards */}
            {anniversaries.map((anniversary, index) => (
              <div 
                key={`anniversary-${index}`}
                className={`group transition-all duration-500 delay-${(birthdays.length + index) * 100} hover:-translate-y-2`}
              >
                <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                  {/* Anniversary Decorative Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-bl-full"></div>
                  
                  {/* Anniversary Profile */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {anniversary.avatar}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
                        <span className="text-xs">💕</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">{anniversary.couple}</h3>
                      <p className="text-slate-600 text-sm mb-2">Married Couple</p>
                      <div className="inline-flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-full">
                        <Heart className="text-emerald-500" size={12} />
                        <span className="text-emerald-600 font-medium text-xs">{anniversary.years} Anniversary</span>
                      </div>
                    </div>
                  </div>

                  {/* Anniversary Action */}
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:from-emerald-600 group-hover:to-teal-600 flex items-center justify-center gap-2 text-sm">
                    <Heart size={16} />
                    Send Anniversary Wishes
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}

            {/* Important Days Cards */}
            {importantDays.map((day, index) => (
              <div 
                key={`important-${index}`}
                className={`group transition-all duration-500 delay-${(birthdays.length + anniversaries.length + index) * 100} hover:-translate-y-2`}
              >
                <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-5 border border-amber-100/50 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                  {/* Important Day Decorative Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-200/30 to-transparent rounded-bl-full"></div>
                  
                  {/* Important Day Profile */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <Star size={24} />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
                        <span className="text-xs">⭐</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">{day.title}</h3>
                      <p className="text-slate-600 text-sm mb-2">{day.category || 'Special Day'}</p>
                      <div className="inline-flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                        <Star className="text-amber-500" size={12} />
                        <span className="text-amber-600 font-medium text-xs">{day.type || 'Important'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Important Day Action */}
                  <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:from-amber-600 group-hover:to-orange-600 flex items-center justify-center gap-2 text-sm">
                    <Calendar size={16} />
                    View Details
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayCelebrations;
