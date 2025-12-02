import React from 'react';

const Header = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navigationItems = [
    { id: 'daily-tracker', label: 'Daily Track', icon: '📅' },
    { id: 'rewards-system', label: 'Rewards', icon: '🏆' },
    { id: 'progress-gallery', label: 'Progress Gallery', icon: '📷' }
  ];

  return (
    <header className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">
            Weight Loss Tracker
          </h1>
          <p className="text-slate-400 text-sm lg:text-base">December 3, 2025 — March 31, 2026</p>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex flex-wrap gap-3">
          {navigationItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="glass-card px-4 py-2 rounded-lg text-slate-200 hover:text-emerald-400 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;