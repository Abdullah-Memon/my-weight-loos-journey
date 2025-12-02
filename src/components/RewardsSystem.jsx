import React from 'react';

const RewardsSystem = ({ rewards }) => {
  return (
    <section className="mb-8">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-slate-100">Rewards System</h3>
          <div className="text-2xl">🏆</div>
        </div>
        
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-lg border border-amber-500/20">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🏆</span>
            <div className="text-sm text-amber-200">
              <span className="font-semibold">Milestone Rewards:</span>
              Every 2kg → Small treat | Every 5kg → Big celebration
            </div>
          </div>
        </div>
        
        <div className="grid-responsive photo-grid">
          {rewards.map((reward, index) => (
            <div key={index} className={`glass-card p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              reward.achieved 
                ? 'border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
                : 'border border-slate-600/30'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xl font-bold text-slate-100">{reward.kg}kg Target</div>
                  <div className="text-sm text-slate-400 flex items-center mt-1">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      reward.type === 'Big' ? 'bg-amber-400' : 'bg-blue-400'
                    }`}></span>
                    {reward.type} Reward
                  </div>
                </div>
                <div className="text-3xl">
                  {reward.achieved ? '🏆' : '🎯'}
                </div>
              </div>
              
              <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-slate-300 text-sm">{reward.suggestion}</p>
              </div>
              
              <button 
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  reward.achieved
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105'
                    : 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                }`}
                disabled={!reward.achieved}
              >
                {reward.achieved ? '🎉 Claim Reward!' : '🔒 Keep Going!'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RewardsSystem;