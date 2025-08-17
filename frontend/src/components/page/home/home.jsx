import React from "react";
import users from '../../Api/usersData.js';

// Utility to get today's and next 7 days' events
function getEventRows(users) {
  const today = new Date();
  const format = d => d.toISOString().slice(0,10);

  // today: 'YYYY-MM-DD'
  const todayStr = format(today);

  // Get upcoming 7 days dates:
  const next7Days = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    next7Days.push(format(d));
  }

  let todayRows = [];
  let next7DaysRows = [];

  users.forEach(user => {
    // Collect all event-like data for each user (you can add more types if needed)
    let allEvents = [
      ...(user.importantDates || []),
      ...(user.events || []),
      { title: "Birthday", date: user.dob },
      { title: "Anniversary", date: user.anniversary },
    ];
    allEvents.forEach(ev => {
      if (!ev.date) return;
      if (ev.date === todayStr) {
        todayRows.push({ user: user.name, ...ev });
      } else if (next7Days.includes(ev.date)) {
        next7DaysRows.push({ user: user.name, ...ev });
      }
    });
  });

  return { todayRows, next7DaysRows };
}

export default function EventsTables() {
  const { todayRows, next7DaysRows } = getEventRows(users);

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-10">
      {/* Today's Events Table */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Today's Events</h3>
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Event Name</th>
              <th className="py-2 px-4 text-left">User</th>
            </tr>
          </thead>
          <tbody>
            {todayRows.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 px-4 text-gray-400 text-center">
                  No events or celebrations today
                </td>
              </tr>
            ) : todayRows.map((ev, idx) => (
              <tr key={idx}>
                <td className="py-2 px-4">{ev.title}</td>
                <td className="py-2 px-4">{ev.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Events Table */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Upcoming (Next 7 Days)</h3>
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Event Name</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {next7DaysRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-gray-400 text-center">
                  No upcoming events in the next 7 days
                </td>
              </tr>
            ) : next7DaysRows.map((ev, idx) => (
              <tr key={idx}>
                <td className="py-2 px-4">{ev.title}</td>
                <td className="py-2 px-4">{ev.user}</td>
                <td className="py-2 px-4">{ev.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
