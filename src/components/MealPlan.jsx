import React from 'react';

const MealPlan = () => {
  const meals = [
    {
      time: "8 AM",
      food: "2 boiled eggs + 1 roti + dahi + 1 fruit",
      colorClasses: {
        bg: "bg-gradient-to-r from-emerald-500/10 to-emerald-500/10",
        border: "border-emerald-500/20",
        circlebg: "bg-emerald-500/20",
        text: "text-emerald-400"
      }
    },
    {
      time: "11 AM", 
      food: "Chai (little/no sugar) + 5 almonds",
      colorClasses: {
        bg: "bg-gradient-to-r from-blue-500/10 to-blue-500/10",
        border: "border-blue-500/20",
        circlebg: "bg-blue-500/20",
        text: "text-blue-400"
      }
    },
    {
      time: "2 PM",
      food: "1.5 roti + kam-tail chicken + salad", 
      colorClasses: {
        bg: "bg-gradient-to-r from-purple-500/10 to-purple-500/10",
        border: "border-purple-500/20",
        circlebg: "bg-purple-500/20",
        text: "text-purple-400"
      }
    },
    {
      time: "6 PM",
      food: "Banana + roasted chana",
      colorClasses: {
        bg: "bg-gradient-to-r from-orange-500/10 to-orange-500/10",
        border: "border-orange-500/20",
        circlebg: "bg-orange-500/20",
        text: "text-orange-400"
      }
    },
    {
      time: "9 PM",
      food: "1 roti + grilled/tandoori + big salad",
      colorClasses: {
        bg: "bg-gradient-to-r from-teal-500/10 to-teal-500/10",
        border: "border-teal-500/20",
        circlebg: "bg-teal-500/20",
        text: "text-teal-400"
      }
    }
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-100">Daily Meal Plan</h3>
        <div className="text-2xl">🍽️</div>
      </div>
      <div className="space-y-4">
        {meals.map((meal, index) => (
          <div key={index} className={`flex items-center p-4 rounded-lg border ${meal.colorClasses.bg} ${meal.colorClasses.border}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${meal.colorClasses.circlebg}`}>
              <span className={`font-bold text-sm ${meal.colorClasses.text}`}>{meal.time}</span>
            </div>
            <div className="flex-1">
              <p className="text-slate-200 text-sm">{meal.food}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <p className="text-sm text-blue-300 flex items-center">
          <span className="text-lg mr-2">📝</span>
          Toggle "Meals 100%" when you follow this plan completely
        </p>
      </div>
    </div>
  );
};

export default MealPlan;