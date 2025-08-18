const BirthdayCard = ({ title, color, data, emptyMessage, emoji }) => (
  <div
    className={`${color.bg} shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl p-6 border ${color.border} backdrop-blur-sm group`}
  >
    <h2 className={`text-xl font-semibold ${color.text} mb-4 flex items-center gap-2`}>
      <span className="text-xl">{emoji}</span> 
      {title}
    </h2>

    {data.length > 0 ? (
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {data.map((person, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-white/70 p-3 rounded-lg hover:bg-white/90 transition-colors duration-200"
          >
            <span className="font-medium text-slate-800">{person.name}</span>
            <span
              className={`text-sm ${color.badgeBg} ${color.badgeText} px-3 py-1 rounded-full font-medium`}
            >
              {person.date}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-center py-6">
        <p className="text-slate-500 italic">{emptyMessage}</p>
      </div>
    )}
  </div>
);

export default BirthdayCard;
