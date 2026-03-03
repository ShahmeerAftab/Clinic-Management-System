type TipCategory = "Nutrition" | "Fitness" | "Mental Health" | "Sleep" | "Preventive";

interface HealthTip {
  id: number;
  title: string;
  body: string;
  category: TipCategory;
  icon: string;
  readTime: string;
}

const tips: HealthTip[] = [
  {
    id: 1,
    title: "Stay Hydrated Throughout the Day",
    body: "Aim for 8–10 glasses of water daily. Carry a reusable bottle and set hourly reminders. Proper hydration boosts energy, aids digestion, and improves skin health.",
    category: "Nutrition",
    icon: "💧",
    readTime: "2 min",
  },
  {
    id: 2,
    title: "30-Minute Daily Walk",
    body: "A brisk 30-minute walk reduces the risk of heart disease by up to 35%. Start with 10 minutes after each meal if a continuous 30-minute block feels difficult.",
    category: "Fitness",
    icon: "🚶",
    readTime: "2 min",
  },
  {
    id: 3,
    title: "Prioritise Quality Sleep",
    body: "Adults need 7–9 hours of uninterrupted sleep. Keep a consistent sleep schedule, avoid screens 1 hour before bed, and keep your bedroom cool and dark.",
    category: "Sleep",
    icon: "😴",
    readTime: "3 min",
  },
  {
    id: 4,
    title: "Eat a Rainbow of Vegetables",
    body: "Different coloured vegetables contain different phytonutrients. Fill half your plate with vegetables at each meal to cover a wide spectrum of vitamins and antioxidants.",
    category: "Nutrition",
    icon: "🥦",
    readTime: "2 min",
  },
  {
    id: 5,
    title: "Practise the 4-7-8 Breathing Technique",
    body: "Inhale for 4 seconds, hold for 7, exhale for 8. This activates your parasympathetic nervous system and reduces anxiety within minutes. Do it twice daily.",
    category: "Mental Health",
    icon: "🧘",
    readTime: "3 min",
  },
  {
    id: 6,
    title: "Schedule Annual Health Screenings",
    body: "Regular check-ups catch problems early. Adults should have yearly blood pressure, cholesterol, and blood sugar checks. Book your next appointment before you need one.",
    category: "Preventive",
    icon: "🩺",
    readTime: "2 min",
  },
  {
    id: 7,
    title: "Strength Train Twice a Week",
    body: "Resistance training preserves muscle mass, improves bone density, and boosts metabolism. Even two 20-minute sessions per week produce significant long-term benefits.",
    category: "Fitness",
    icon: "💪",
    readTime: "3 min",
  },
  {
    id: 8,
    title: "Limit Added Sugar Intake",
    body: "The WHO recommends less than 25 g (6 teaspoons) of added sugar per day. Check food labels carefully — added sugars hide in sauces, bread, yoghurt, and juices.",
    category: "Nutrition",
    icon: "🍬",
    readTime: "2 min",
  },
  {
    id: 9,
    title: "Connect Socially Every Day",
    body: "Social connection is as important for longevity as diet and exercise. Even a brief daily call or message to a friend or family member meaningfully reduces stress hormones.",
    category: "Mental Health",
    icon: "🤝",
    readTime: "2 min",
  },
];

const categoryStyles: Record<TipCategory, { badge: string; bg: string; border: string }> = {
  "Nutrition":     { badge: "bg-green-100 text-green-700",   bg: "bg-green-50",   border: "border-green-100" },
  "Fitness":       { badge: "bg-blue-100 text-blue-700",     bg: "bg-blue-50",    border: "border-blue-100" },
  "Mental Health": { badge: "bg-purple-100 text-purple-700", bg: "bg-purple-50",  border: "border-purple-100" },
  "Sleep":         { badge: "bg-indigo-100 text-indigo-700", bg: "bg-indigo-50",  border: "border-indigo-100" },
  "Preventive":    { badge: "bg-orange-100 text-orange-700", bg: "bg-orange-50",  border: "border-orange-100" },
};

const categories: TipCategory[] = ["Nutrition", "Fitness", "Mental Health", "Sleep", "Preventive"];

export default function PatientHealthTips() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Health Tips</h1>
        <p className="text-gray-500 mt-1 text-sm">Evidence-based tips to help you stay at your healthiest.</p>
      </div>

      {/* Category filter — visual only; wire to state when backend is ready */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white transition-colors">
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:opacity-80 ${categoryStyles[cat].badge} ${categoryStyles[cat].border}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tip cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tips.map((tip) => {
          const style = categoryStyles[tip.category];
          return (
            <div
              key={tip.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`w-11 h-11 rounded-xl ${style.bg} flex items-center justify-center text-xl shrink-0`}>
                  {tip.icon}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                    {tip.category}
                  </span>
                  <span className="text-xs text-gray-400">{tip.readTime} read</span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-900 leading-snug">{tip.title}</p>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{tip.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-violet-50 border border-violet-100 rounded-2xl p-4">
        <p className="text-sm text-violet-700 font-medium">
          AI-personalised health tips based on your records will be available once backend integration is complete.
        </p>
      </div>
    </>
  );
}
