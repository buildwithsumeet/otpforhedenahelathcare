import React from 'react';
import { Calendar } from 'lucide-react';

const UpcomingBirthdays = ({ upcomingBirthdays }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-md">
            <Calendar className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Upcoming Birthdays</h3>
            <p className="text-slate-500 text-sm">Next 7 days</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {upcomingBirthdays && upcomingBirthdays.length > 0 ? (
          <div className="space-y-4">
            {upcomingBirthdays.map((person, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl hover:from-slate-100 hover:to-blue-100/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg group-hover:scale-105 transition-transform duration-200">
                    {person.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{person.name}</h4>
                    <p className="text-slate-600 text-sm">{person.relation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-800 font-semibold">{person.date}</div>
                  <div className="text-slate-500 text-sm">
                    {person.daysLeft} day{person.daysLeft !== 1 ? 's' : ''} left
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No upcoming birthdays</p>
            <p className="text-slate-400 text-sm mt-1">All caught up for now!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingBirthdays;
