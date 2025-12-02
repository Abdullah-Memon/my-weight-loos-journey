import React from 'react';
import { isToday } from '../utils/helpers';

const DailyTracker = ({ records, onUpdateCell }) => {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="mb-8">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-100">Daily Tracker</h2>
          <div className="text-2xl">📅</div>
        </div>
        
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">📅</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-400 mb-2">Smart Daily Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  New rows appear automatically each day
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Previous days saved as history
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Auto-save on every change
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  Track progress until goal achieved
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="table-container rounded-lg border border-slate-600/30">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-sm">
                <tr className="text-left border-b border-slate-600/30">
                  <th className="p-4 font-medium text-slate-300 min-w-[120px]">Date</th>
                  <th className="p-4 font-medium text-slate-300 min-w-[140px]">Weight (kg)</th>
                  <th className="p-4 font-medium text-slate-300 min-w-[100px]">Steps</th>
                  <th className="p-4 font-medium text-slate-300 text-center min-w-[100px]">Water ≥ 3.5L</th>
                  <th className="p-4 font-medium text-slate-300 text-center min-w-[100px]">Meals 100%</th>
                  <th className="p-4 font-medium text-slate-300 text-center min-w-[100px]">Exercise</th>
                  <th className="p-4 font-medium text-slate-300 text-center min-w-[100px]">Sleep ≥ 7h</th>
                  <th className="p-4 font-medium text-slate-300 text-center min-w-[100px]">Reward</th>
                  <th className="p-4 font-medium text-slate-300 min-w-[200px]">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {records.map((record, index) => {
                  const isTodayRow = isToday(record.date);
                  const rowClass = isTodayRow ? 'today-row' : 
                                  index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-700/30';
                  
                  return (
                    <tr key={record.date} className={`${rowClass} hover:bg-slate-600/30 transition-all duration-200`}>
                      <td className="p-4 font-medium text-slate-200">
                        <div className="flex items-center">
                          {isTodayRow ? 
                            <span className="px-3 py-1 text-sm bg-emerald-500 text-white rounded-full animate-pulse flex items-center">
                              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                              TODAY
                            </span> : 
                            record.date
                          }
                        </div>
                      </td>
                      <td className="p-4">
                        <input 
                          type="number" 
                          step="0.1" 
                          value={record.morningWeight} 
                          onChange={(e) => onUpdateCell(index, 'morningWeight', e.target.value)}
                          placeholder="kg"
                          className="glass-input w-full max-w-24 p-2 rounded-lg text-center text-slate-100"
                        />
                      </td>
                      <td className="p-4">
                        <input 
                          type="number" 
                          value={record.steps} 
                          onChange={(e) => onUpdateCell(index, 'steps', e.target.value)}
                          placeholder="steps"
                          className="glass-input w-full max-w-24 p-2 rounded-lg text-center text-slate-100"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={record.water} 
                            onChange={(e) => onUpdateCell(index, 'water', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </td>
                      <td className="p-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={record.meals} 
                            onChange={(e) => onUpdateCell(index, 'meals', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </td>
                      <td className="p-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={record.exercise} 
                            onChange={(e) => onUpdateCell(index, 'exercise', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                      </td>
                      <td className="p-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={record.sleep} 
                            onChange={(e) => onUpdateCell(index, 'sleep', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </td>
                      <td className="p-4">
                        <select 
                          value={record.reward}
                          onChange={(e) => onUpdateCell(index, 'reward', e.target.value)}
                          className="glass-input p-2 rounded-lg text-slate-100"
                        >
                          <option value="Y">✅ Yes</option>
                          <option value="N">❌ No</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <input 
                          type="text" 
                          value={record.notes} 
                          onChange={(e) => onUpdateCell(index, 'notes', e.target.value)}
                          placeholder="Add notes..."
                          className="glass-input w-full min-w-48 p-2 rounded-lg text-slate-100"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyTracker;