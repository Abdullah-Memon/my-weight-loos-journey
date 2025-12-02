import React from 'react';

const MotivationPanel = ({ weeklyQuote, monthlySummary, weeklyStats }) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-100">Motivation</h3>
        <div className="text-2xl">✨</div>
      </div>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
        <div className="urdu-text text-lg text-center text-slate-100" style={{
          fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
          textAlign: 'right',
          lineHeight: '1.8',
          color: '#e2e8f0'
        }}>
          {weeklyQuote}
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-slate-200 mb-3 flex items-center">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
            Monthly Summary
          </h4>
          <div className="space-y-2">
            {monthlySummary.map((month, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-lg border border-slate-600/20 hover:border-slate-500/30 transition-all duration-200">
                <span className="font-medium text-slate-200">{month.label}</span>
                <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                  month.lost > 0 ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-400 bg-slate-600/20'
                }`}>
                  {month.lost ? month.lost.toFixed(1) + ' kg' : '--'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-slate-200 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Weekly Stats
          </h4>
          <div className="space-y-2">
            {weeklyStats.slice(0, 8).map((week, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-lg border border-slate-600/20 hover:border-slate-500/30 transition-all duration-200">
                <span className="text-slate-200">Week {week.week}</span>
                <div className="flex gap-3">
                  <span className={`font-bold px-2 py-1 rounded text-xs ${
                    week.loss > 0 ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-400'
                  }`}>
                    {week.loss ? week.loss.toFixed(1) + 'kg' : '--'}
                  </span>
                  <span className="text-blue-300 bg-blue-500/20 px-2 py-1 rounded text-xs font-medium">
                    {week.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationPanel;