const BirthdayCard = ({ title, color, data, emptyMessage, emoji }) => (
  <div
    className={`bg-white shadow-lg hover:shadow-xl transition-all rounded-2xl p-6 border ${color.border}`}
  >
    <h2
      className={`text-xl font-semibold ${color.text} mb-4 flex items-center gap-2`}
    >
      {emoji} {title}
    </h2>
    {data.length > 0 ? (
      <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {data.map((person, index) => (
          <li
            key={index}
            className={`flex justify-between items-center ${color.bg} p-4 rounded-lg hover:${color.hover} transition`}
          >
            <span className="font-medium text-gray-800">{person.name}</span>
            <span
              className={`text-sm ${color.badgeBg} ${color.badgeText} px-3 py-1 rounded-full shadow`}
            >
              {person.date}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic">{emptyMessage}</p>
    )}
  </div>
);
export default BirthdayCard