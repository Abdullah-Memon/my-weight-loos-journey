import React from 'react';

const StatsCards = ({ startWeight, currentWeight, totalLost, targetMin, targetMax }) => {
  return (
    <section className="mb-8">
      <div className="grid-responsive stats-grid">
        <div className="glass-card stat-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Starting Weight</p>
              <p className="text-3xl font-bold text-emerald-400">{startWeight} kg</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        <div className="glass-card current-weight-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Current Weight</p>
              <p className="text-3xl font-bold text-orange-400">{currentWeight} kg</p>
              <p className="text-xs text-slate-500 mt-1">
                Lost: <span className="font-semibold text-orange-300">{totalLost.toFixed(1)} kg</span>
              </p>
            </div>
            <div className="text-4xl">⚖️</div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
        
        <div className="glass-card goal-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Target Range</p>
              <p className="text-3xl font-bold text-blue-400">{targetMin}–{targetMax} kg</p>
              <p className="text-xs text-slate-500 mt-2">Meal plan optimized for minimal cooking</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCards;