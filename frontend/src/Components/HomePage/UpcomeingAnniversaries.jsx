import React from 'react';
import { Heart } from 'lucide-react';

const UpcomingAnniversaries = ({ upcomingAnniversaries }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center shadow-md">
            <Heart className="text-rose-600" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Anniversary Celebrations</h3>
            <p className="text-slate-500 text-sm">Coming up soon</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {upcomingAnniversaries && upcomingAnniversaries.length > 0 ? (
          <div className="space-y-4">
            {upcomingAnniversaries.map((couple, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-rose-50/30 rounded-xl hover:from-slate-100 hover:to-rose-100/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg relative group-hover:scale-105 transition-transform duration-200">
                    {couple.avatar}
                    <div className="absolute -top-1 -right-1 text-xs">💕</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{couple.couple}</h4>
                    <p className="text-rose-600 text-sm font-medium">{couple.years} Anniversary</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-800 font-semibold">{couple.date}</div>
                  <div className="text-slate-500 text-sm">
                    {couple.daysLeft} day{couple.daysLeft !== 1 ? 's' : ''} left
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No upcoming anniversaries</p>
            <p className="text-slate-400 text-sm mt-1">Love is always in the air!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAnniversaries;
