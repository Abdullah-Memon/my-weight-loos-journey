import React, { useRef } from 'react';

const PhotoGallery = ({ photos, measurements, onPhotoUpload, onUpdateMeasurement }) => {
  const photoStages = [
    { label: 'Start', subtitle: 'Dec 3, 2025', icon: '🚀' },
    { label: '1 Month', subtitle: 'Progress Check', icon: '📈' },
    { label: '2 Month', subtitle: 'Halfway There', icon: '💪' },
    { label: '3 Month', subtitle: 'Almost Done', icon: '🔥' },
    { label: '4 Month', subtitle: 'Final Push', icon: '⭐' },
    { label: 'Final', subtitle: 'Success!', icon: '🏆' }
  ];

  const fileInputRefs = useRef({});

  const handlePhotoClick = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      onPhotoUpload(index, file);
    }
  };

  return (
    <section className="mb-8">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-slate-100">Progress Gallery</h3>
          <div className="text-2xl">📷</div>
        </div>
        
        <div className="grid-responsive photo-grid">
          {photoStages.map((stage, index) => (
            <div key={index} className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold text-slate-100">{stage.label}</div>
                  <div className="text-xs text-slate-400">{stage.subtitle}</div>
                </div>
                <div className="text-2xl">{stage.icon}</div>
              </div>
              
              <div className="relative mb-4 group">
                <div 
                  className="h-48 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-slate-500 cursor-pointer"
                  onClick={() => handlePhotoClick(index)}
                >
                  {photos[index] ? 
                    <img 
                      src={photos[index]} 
                      alt={stage.label} 
                      className="max-h-full max-w-full object-contain rounded-lg"
                    /> :
                    <div className="text-center text-slate-400">
                      <div className="text-3xl mb-2">📷</div>
                      <div className="text-sm">Upload Photo</div>
                    </div>
                  }
                </div>
                <input 
                  ref={el => fileInputRefs.current[index] = el}
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(index, e)}
                  className="hidden"
                />
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <label className="text-xs text-slate-400 block mb-1">Waist</label>
                    <input 
                      type="number" 
                      placeholder="cm" 
                      value={measurements[`waist_${index}`] || ''}
                      onChange={(e) => onUpdateMeasurement(`waist_${index}`, e.target.value)}
                      className="glass-input w-full p-2 rounded text-center text-sm text-slate-100"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-xs text-slate-400 block mb-1">Chest</label>
                    <input 
                      type="number" 
                      placeholder="cm"
                      value={measurements[`chest_${index}`] || ''}
                      onChange={(e) => onUpdateMeasurement(`chest_${index}`, e.target.value)}
                      className="glass-input w-full p-2 rounded text-center text-sm text-slate-100"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-xs text-slate-400 block mb-1">Arm</label>
                    <input 
                      type="number" 
                      placeholder="cm"
                      value={measurements[`arm_${index}`] || ''}
                      onChange={(e) => onUpdateMeasurement(`arm_${index}`, e.target.value)}
                      className="glass-input w-full p-2 rounded text-center text-sm text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;