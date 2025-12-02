import React from 'react';

const ExercisePlan = () => {
  const exercises = [
    {
      weeks: "1-2",
      plan: "12,000 steps + 10 min bodyweight exercises",
      colorClasses: {
        bg: "bg-gradient-to-r from-purple-500/10 to-purple-500/10",
        border: "border-purple-500/20",
        circlebg: "bg-purple-500/20",
        text: "text-purple-400"
      }
    },
    {
      weeks: "3-4",
      plan: "14,000 steps + 15 min bodyweight exercises",
      colorClasses: {
        bg: "bg-gradient-to-r from-blue-500/10 to-blue-500/10",
        border: "border-blue-500/20",
        circlebg: "bg-blue-500/20",
        text: "text-blue-400"
      }
    },
    {
      weeks: "5+",
      plan: "15,000+ steps + 20-25 min home workout",
      colorClasses: {
        bg: "bg-gradient-to-r from-emerald-500/10 to-emerald-500/10",
        border: "border-emerald-500/20",
        circlebg: "bg-emerald-500/20",
        text: "text-emerald-400"
      }
    }
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-100">Exercise Plan</h3>
        <div className="text-2xl">💪</div>
      </div>
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div key={index} className={`p-4 rounded-lg border ${exercise.colorClasses.bg} ${exercise.colorClasses.border}`}>
            <div className="flex items-center mb-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${exercise.colorClasses.circlebg}`}>
                <span className={`text-sm font-bold ${exercise.colorClasses.text}`}>{exercise.weeks}</span>
              </span>
              <span className={`font-semibold ${exercise.colorClasses.text}`}>Week {exercise.weeks}:</span>
            </div>
            <p className="text-slate-200 text-sm ml-11">{exercise.plan}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <p className="text-sm text-purple-300 flex items-center">
          <span className="text-lg mr-2">🏠</span>
          Home workouts: push-ups, squats, planks, jumping jacks
        </p>
      </div>
    </div>
  );
};

export default ExercisePlan;