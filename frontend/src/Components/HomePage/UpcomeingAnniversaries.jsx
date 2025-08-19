import React, { useState, useEffect } from 'react';
import { Heart, Gift } from 'lucide-react';
import { getUpcomingEvents } from '../../Api/celebrationsApi';

const UpcomingAnniversaries = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getUpcomingEvents();
        if (data.success) {
          setBirthdays(data.upcomingEvents.filter((e) => e.type === "birthday"));
          setAnniversaries(data.upcomingEvents.filter((e) => e.type === "anniversary"));
        }
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 p-6 text-center">
        <p className="text-slate-500">Loading celebrations...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2  ">
      {/* Birthdays */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center shadow-md">
              <Gift className="text-indigo-600" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Upcoming Birthdays</h3>
              <p className="text-slate-500 text-sm">Don't forget to celebrate 🎉</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {birthdays.length > 0 ? (
            <div className="space-y-4">
              {birthdays.map((person, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-xl hover:from-slate-100 hover:to-indigo-100/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={person.avatar} 
                      alt={person.name} 
                      className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-200" 
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800">{person.name}</h4>
                      <p className="text-indigo-600 text-sm font-medium">Birthday</p>
                    </div>
                  </div>
                  <div className="text-right text-slate-800 font-semibold">{person.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No upcoming birthdays</p>
            </div>
          )}
        </div>
      </div>

      {/* Anniversaries */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="text-rose-600" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Upcoming Anniversaries</h3>
              <p className="text-slate-500 text-sm">Love is in the air 💕</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {anniversaries.length > 0 ? (
            <div className="space-y-4">
              {anniversaries.map((couple, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-rose-50/30 rounded-xl hover:from-slate-100 hover:to-rose-100/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={couple.avatar} 
                      alt={couple.name} 
                      className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-200" 
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800">{couple.name}</h4>
                      <p className="text-rose-600 text-sm font-medium">Anniversary</p>
                    </div>
                  </div>
                  <div className="text-right text-slate-800 font-semibold">{couple.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No upcoming anniversaries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingAnniversaries;
