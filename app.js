// Weight Loss Tracker Application
// Production-ready vanilla JavaScript implementation

class WeightLossTracker {
    constructor() {
        this.START_DATE = new Date(2025, 11, 3); // Dec 3, 2025
        this.DAYS = 120;
        this.START_WEIGHT = 100;
        this.TARGET_MIN = 75;
        this.TARGET_MAX = 80;
        
        this.WEEKLY_QUOTES = [
            "کام جاری رکھو — چھوٹے قدم بڑی کامیابی بناتے ہیں۔",
            "روزانہ ایک بہتر انتخاب، لمبی کامیابی کی کنجی۔",
            "صبر اور مستقل مزاجی کے ساتھ وزن کم کرنا ممکن ہے۔",
            "آج کا عزم کل کی طاقت ہے۔",
            "ایک دن میں تبدیلی نظر نہیں آتی، مگر ہر دن فرق بناتا ہے۔",
            "اپنے آپ کو پہچانو، اور اپنی طاقت کو جگاؤ۔",
            "مستقل مزاجی سے ہر حد پار ہو جاتی ہے۔",
            "صحت دولت سے بڑھ کر ہے — اپنے آپ میں سرمایہ کاری کرو۔",
            "آہستہ مگر پائیدار — یہی کامیابی ہے۔",
            "آج ہی بہتر انتخاب کرو، کل شکریہ کہو گے۔",
            "چھوٹے اہداف بڑے نتائج لاتے ہیں۔",
            "اپنے سفر میں خود کا بہترین دوست بنو۔",
            "ہر پسینہ محنت کا ثبوت ہے — جاری رکھو۔",
            "خود پر یقین رکھو — تم یہ کر سکتے ہو۔",
            "عادتیں بناؤ، نتائج پیچھے آئیں گے۔",
            "آج کی قربانی کل کی کامیابی ہے۔",
            "پانی پیو، چلو، اور صحت مند کھاؤ — سادہ مگر مؤثر۔",
            "ہر دن نیا موقع ہے بہتر بننے کا۔"
        ];

        this.data = this.loadData();
        this.chart = null;
        this.init();
    }

    generateDatesUpToToday() {
        const today = new Date();
        const dates = [];
        const startDate = new Date(this.START_DATE);
        
        // Generate dates from start date up to today (inclusive)
        for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
        }
        
        return dates;
    }

    getDefaultData() {
        const dates = this.generateDatesUpToToday();
        return {
            records: dates.map((date, i) => ({
                date: date.toISOString().slice(0, 10),
                morningWeight: i === 0 ? this.START_WEIGHT : "",
                steps: "",
                water: false,
                meals: false,
                exercise: false,
                sleep: false,
                reward: "N",
                notes: ""
            })),
            photos: {},
            measurements: {},
            lastUpdated: new Date().toISOString()
        };
    }

    async loadData() {
        let data;
        
        try {
            // First try to load from IndexedDB
            if ('indexedDB' in window) {
                const indexedData = await this.loadFromIndexedDB();
                if (indexedData) {
                    console.log('Data loaded from IndexedDB');
                    data = indexedData;
                }
            }
            
            // Fallback to localStorage
            if (!data) {
                const localData = localStorage.getItem('weight-tracker-backup');
                if (localData) {
                    console.log('Data loaded from localStorage backup');
                    data = JSON.parse(localData);
                }
            }
            
            // Try to load from track.json file
            if (!data) {
                const response = await fetch('./track.json');
                if (response.ok) {
                    data = await response.json();
                    console.log('Data loaded from track.json');
                }
            }
        } catch (error) {
            console.log('No existing data found, creating new data structure');
        }
        
        // If no data exists anywhere, create default data
        if (!data) {
            data = this.getDefaultData();
        }
        
        // Ensure data structure is correct and current date exists
        if (!data.records) data.records = [];
        if (!data.photos) data.photos = {};
        if (!data.measurements) data.measurements = {};
        
        return data;
    }

    async loadFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('WeightTrackerDB', 1);
            
            request.onerror = () => resolve(null);
            
            request.onsuccess = () => {
                const db = request.result;
                
                if (!db.objectStoreNames.contains('data')) {
                    resolve(null);
                    return;
                }
                
                const transaction = db.transaction(['data'], 'readonly');
                const store = transaction.objectStore('data');
                const getRequest = store.get('main-data');
                
                getRequest.onsuccess = () => {
                    resolve(getRequest.result);
                };
                
                getRequest.onerror = () => resolve(null);
            };
            
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data');
                }
            };
        });
    }

    async saveData() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            
            // Update data to include any new dates up to today
            this.ensureCurrentDateExists();
            
            // Store in localStorage as primary storage
            localStorage.setItem('weight-tracker-backup', JSON.stringify(this.data));
            
            // In a PWA, we can also use IndexedDB for larger storage
            if ('indexedDB' in window) {
                await this.saveToIndexedDB();
            }
            
            // Update the track.json content display
            this.updateTrackJsonPreview();
            
            console.log('Data saved locally');
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error saving data', 'error');
        }
    }

    async saveToIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('WeightTrackerDB', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['data'], 'readwrite');
                const store = transaction.objectStore('data');
                
                store.put(this.data, 'main-data');
                
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            };
            
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data');
                }
            };
        });
    }

    ensureCurrentDateExists() {
        const today = new Date().toISOString().slice(0, 10);
        const startDate = new Date(this.START_DATE).toISOString().slice(0, 10);
        
        // Get all dates from start to today
        const dates = this.generateDatesUpToToday();
        const existingDates = new Set(this.data.records.map(r => r.date));
        
        // Add any missing dates
        dates.forEach((date, i) => {
            const dateStr = date.toISOString().slice(0, 10);
            if (!existingDates.has(dateStr)) {
                this.data.records.push({
                    date: dateStr,
                    morningWeight: "",
                    steps: "",
                    water: false,
                    meals: false,
                    exercise: false,
                    sleep: false,
                    reward: "N",
                    notes: ""
                });
            }
        });
        
        // Sort records by date
        this.data.records.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    updateCell(index, key, value) {
        if (!this.data.records[index]) return;
        this.data.records[index][key] = value;
        this.saveData(); // Auto-save on every change
        this.updateDisplay();
    }

    getCurrentWeight() {
        for (let i = this.data.records.length - 1; i >= 0; i--) {
            const weight = Number(this.data.records[i].morningWeight);
            if (!isNaN(weight) && weight > 0) {
                return weight;
            }
        }
        return this.START_WEIGHT;
    }

    getTotalLost() {
        return Math.max(0, this.START_WEIGHT - this.getCurrentWeight());
    }

    getWeeklyQuote() {
        const now = new Date();
        const weeksSince = Math.max(0, Math.floor((now - this.START_DATE) / (1000 * 60 * 60 * 24 * 7)));
        const index = Math.min(this.WEEKLY_QUOTES.length - 1, weeksSince);
        return this.WEEKLY_QUOTES[index];
    }

    getMonthlySummary() {
        const months = [
            { label: "Dec 2025", start: "2025-12-03", end: "2025-12-31" },
            { label: "Jan 2026", start: "2026-01-01", end: "2026-01-31" },
            { label: "Feb 2026", start: "2026-02-01", end: "2026-02-28" },
            { label: "Mar 2026", start: "2026-03-01", end: "2026-03-31" }
        ];

        return months.map(month => {
            const records = this.data.records.filter(r => r.date >= month.start && r.date <= month.end);
            const weights = records.map(r => Number(r.morningWeight)).filter(w => !isNaN(w) && w > 0);
            const startWeight = weights.length ? weights[0] : null;
            const endWeight = weights.length ? weights[weights.length - 1] : null;
            const lost = startWeight && endWeight ? (startWeight - endWeight) : null;
            
            return { ...month, startWeight, endWeight, lost };
        });
    }

    getWeeklyStats() {
        const weeks = [];
        for (let w = 0; w < Math.ceil(this.DAYS / 7); w++) {
            const start = w * 7;
            const end = Math.min(start + 6, this.DAYS - 1);
            const records = this.data.records.slice(start, end + 1);
            
            const weights = records.map(r => Number(r.morningWeight)).filter(w => !isNaN(w) && w > 0);
            const startWeight = weights.length ? weights[0] : null;
            const endWeight = weights.length ? weights[weights.length - 1] : null;
            const loss = startWeight && endWeight ? startWeight - endWeight : null;
            
            const completedTasks = records.reduce((acc, record) => {
                return acc + (record.water ? 1 : 0) + (record.meals ? 1 : 0) + 
                       (record.exercise ? 1 : 0) + (record.sleep ? 1 : 0);
            }, 0);
            
            const percentage = records.length > 0 ? (completedTasks / (records.length * 4)) * 100 : 0;
            
            weeks.push({
                week: w + 1,
                startWeight,
                endWeight,
                loss,
                percentage: Math.round(percentage * 10) / 10
            });
        }
        return weeks;
    }

    getChartData() {
        return this.data.records.map(record => ({
            date: record.date,
            weight: Number(record.morningWeight) || null
        })).filter(item => item.weight !== null);
    }

    generateRewards() {
        const rewards = [];
        for (let kg = 2; kg <= 25; kg += 2) {
            const type = kg % 5 === 0 ? "Big" : "Small";
            const suggestion = type === "Small" ? "Gol gappa / Ice cream" : "New shirt / Movie / Zinger";
            const achieved = this.getTotalLost() >= kg;
            
            rewards.push({
                kg,
                type,
                suggestion,
                achieved
            });
        }
        return rewards;
    }

    updateDisplay() {
        this.updateStats();
        this.updateChart();
        this.updateMonthlySummary();
        this.updateWeeklyStats();
        this.updateDailyTracker();
        this.updateRewards();
        this.updateWeeklyQuote();
    }

    updateStats() {
        const currentWeight = this.getCurrentWeight();
        const totalLost = this.getTotalLost();
        
        document.getElementById('currentWeight').textContent = `${currentWeight} kg`;
        document.getElementById('totalLost').textContent = `${totalLost.toFixed(1)} kg`;
    }

    updateChart() {
        const ctx = document.getElementById('weightChart').getContext('2d');
        const chartData = this.getChartData();
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(item => {
                    const date = new Date(item.date);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [{
                    label: 'Weight (kg)',
                    data: chartData.map(item => item.weight),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#059669',
                    pointHoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        titleColor: '#f1f5f9',
                        bodyColor: '#e2e8f0',
                        borderColor: '#10b981',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: Math.max(60, this.START_WEIGHT - 30),
                        max: this.START_WEIGHT + 2,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    updateMonthlySummary() {
        const summary = this.getMonthlySummary();
        const container = document.getElementById('monthlySummary');
        
        container.innerHTML = summary.map(month => `
            <div class="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-lg border border-slate-600/20 hover:border-slate-500/30 transition-all duration-200">
                <span class="font-medium text-slate-200">${month.label}</span>
                <span class="font-bold px-3 py-1 rounded-full text-sm ${
                    month.lost > 0 ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-400 bg-slate-600/20'
                }">
                    ${month.lost ? month.lost.toFixed(1) + ' kg' : '--'}
                </span>
            </div>
        `).join('');
    }

    updateWeeklyStats() {
        const stats = this.getWeeklyStats();
        const container = document.getElementById('weeklyStats');
        
        container.innerHTML = stats.slice(0, 8).map(week => `
            <div class="flex justify-between items-center p-3 bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-lg border border-slate-600/20 hover:border-slate-500/30 transition-all duration-200">
                <span class="text-slate-200">Week ${week.week}</span>
                <div class="flex gap-3">
                    <span class="font-bold px-2 py-1 rounded text-xs ${
                        week.loss > 0 ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-400'
                    }">
                        ${week.loss ? week.loss.toFixed(1) + 'kg' : '--'}
                    </span>
                    <span class="text-blue-300 bg-blue-500/20 px-2 py-1 rounded text-xs font-medium">
                        ${week.percentage}%
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateDailyTracker() {
        const tbody = document.getElementById('dailyTrackerTable');
        const today = new Date().toISOString().slice(0, 10);
        
        tbody.innerHTML = this.data.records.map((record, index) => {
            const isToday = record.date === today;
            const rowClass = isToday ? 'today-row' : 
                            index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-700/30';
            
            return `
            <tr class="${rowClass} hover:bg-slate-600/30 transition-all duration-200">
                <td class="p-4 font-medium text-slate-200">
                    <div class="flex items-center">
                        ${isToday ? 
                            '<span class="px-3 py-1 text-sm bg-emerald-500 text-white rounded-full animate-pulse flex items-center"><span class="w-2 h-2 bg-white rounded-full mr-2"></span>TODAY</span>' : 
                            record.date
                        }
                    </div>
                </td>
                <td class="p-4">
                    <input type="number" 
                           step="0.1" 
                           value="${record.morningWeight}" 
                           onchange="tracker.updateCell(${index}, 'morningWeight', this.value)"
                           placeholder="kg"
                           class="input-field w-full max-w-24 p-2 rounded-lg text-center">
                </td>
                <td class="p-4">
                    <input type="number" 
                           value="${record.steps}" 
                           onchange="tracker.updateCell(${index}, 'steps', this.value)"
                           placeholder="steps"
                           class="input-field w-full max-w-24 p-2 rounded-lg text-center">
                </td>
                <td class="p-4 text-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" 
                               ${record.water ? 'checked' : ''} 
                               onchange="tracker.updateCell(${index}, 'water', this.checked)"
                               class="sr-only peer">
                        <div class="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </td>
                <td class="p-4 text-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" 
                               ${record.meals ? 'checked' : ''} 
                               onchange="tracker.updateCell(${index}, 'meals', this.checked)"
                               class="sr-only peer">
                        <div class="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                </td>
                <td class="p-4 text-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" 
                               ${record.exercise ? 'checked' : ''} 
                               onchange="tracker.updateCell(${index}, 'exercise', this.checked)"
                               class="sr-only peer">
                        <div class="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                </td>
                <td class="p-4 text-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" 
                               ${record.sleep ? 'checked' : ''} 
                               onchange="tracker.updateCell(${index}, 'sleep', this.checked)"
                               class="sr-only peer">
                        <div class="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                </td>
                <td class="p-4">
                    <select onchange="tracker.updateCell(${index}, 'reward', this.value)"
                            class="input-field p-2 rounded-lg">
                        <option value="Y" ${record.reward === 'Y' ? 'selected' : ''}>✅ Yes</option>
                        <option value="N" ${record.reward === 'N' ? 'selected' : ''}>❌ No</option>
                    </select>
                </td>
                <td class="p-4">
                    <input type="text" 
                           value="${record.notes}" 
                           onchange="tracker.updateCell(${index}, 'notes', this.value)"
                           placeholder="Add notes..."
                           class="input-field w-full min-w-48 p-2 rounded-lg">
                </td>
            </tr>
        `;
        }).join('');
    }

    updateRewards() {
        const rewards = this.generateRewards();
        const container = document.getElementById('rewardsGrid');
        
        container.innerHTML = rewards.map(reward => `
            <div class="glass-card p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                reward.achieved 
                    ? 'border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
                    : 'border border-slate-600/30'
            }">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <div class="text-xl font-bold text-slate-100">${reward.kg}kg Target</div>
                        <div class="text-sm text-slate-400 flex items-center mt-1">
                            <span class="w-2 h-2 rounded-full mr-2 ${
                                reward.type === 'Big' ? 'bg-amber-400' : 'bg-blue-400'
                            }"></span>
                            ${reward.type} Reward
                        </div>
                    </div>
                    <div class="text-3xl">
                        ${reward.achieved ? '🏆' : '🎯'}
                    </div>
                </div>
                
                <div class="mb-4 p-3 bg-slate-700/50 rounded-lg">
                    <p class="text-slate-300 text-sm">${reward.suggestion}</p>
                </div>
                
                <button class="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    reward.achieved
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105'
                        : 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                }" ${
                    reward.achieved ? '' : 'disabled'
                }>
                    ${reward.achieved ? '🎉 Claim Reward!' : '🔒 Keep Going!'}
                </button>
            </div>
        `).join('');
    }

    updateWeeklyQuote() {
        document.getElementById('weeklyQuote').textContent = this.getWeeklyQuote();
    }

    updatePhotos() {
        const photoStages = [
            { label: 'Start', subtitle: 'Dec 3, 2025', icon: '🚀' },
            { label: '1 Month', subtitle: 'Progress Check', icon: '📈' },
            { label: '2 Month', subtitle: 'Halfway There', icon: '💪' },
            { label: '3 Month', subtitle: 'Almost Done', icon: '🔥' },
            { label: '4 Month', subtitle: 'Final Push', icon: '⭐' },
            { label: 'Final', subtitle: 'Success!', icon: '🏆' }
        ];

        const container = document.getElementById('photoGrid');
        
        container.innerHTML = photoStages.map((stage, index) => `
            <div class="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="text-lg font-semibold text-slate-100">${stage.label}</div>
                        <div class="text-xs text-slate-400">${stage.subtitle}</div>
                    </div>
                    <div class="text-2xl">${stage.icon}</div>
                </div>
                
                <div class="relative mb-4 group">
                    <div class="h-48 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-slate-500">
                        ${this.data.photos[index] ? 
                            `<img src="${this.data.photos[index]}" alt="${stage.label}" class="max-h-full max-w-full object-contain rounded-lg">` :
                            `<div class="text-center text-slate-400">
                                <div class="text-3xl mb-2">📷</div>
                                <div class="text-sm">Upload Photo</div>
                            </div>`
                        }
                    </div>
                    <input type="file" 
                           accept="image/*" 
                           onchange="tracker.handlePhotoUpload(${index}, this)"
                           class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                </div>
                
                <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-2">
                        <div class="text-center">
                            <label class="text-xs text-slate-400 block mb-1">Waist</label>
                            <input type="number" 
                                   placeholder="cm" 
                                   value="${this.data.measurements[`waist_${index}`] || ''}"
                                   onchange="tracker.updateMeasurement('waist_${index}', this.value)"
                                   class="input-field w-full p-2 rounded text-center text-sm">
                        </div>
                        <div class="text-center">
                            <label class="text-xs text-slate-400 block mb-1">Chest</label>
                            <input type="number" 
                                   placeholder="cm"
                                   value="${this.data.measurements[`chest_${index}`] || ''}"
                                   onchange="tracker.updateMeasurement('chest_${index}', this.value)"
                                   class="input-field w-full p-2 rounded text-center text-sm">
                        </div>
                        <div class="text-center">
                            <label class="text-xs text-slate-400 block mb-1">Arm</label>
                            <input type="number" 
                                   placeholder="cm"
                                   value="${this.data.measurements[`arm_${index}`] || ''}"
                                   onchange="tracker.updateMeasurement('arm_${index}', this.value)"
                                   class="input-field w-full p-2 rounded text-center text-sm">
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handlePhotoUpload(index, input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.data.photos[index] = e.target.result;
            this.updatePhotos();
        };
        reader.readAsDataURL(file);
    }

    updateMeasurement(key, value) {
        this.data.measurements[key] = value;
    }

    reset() {
        if (confirm('⚠️ This will reset ALL your progress data. Are you sure?')) {
            this.data = this.getDefaultData();
            this.updateDisplay();
            this.updatePhotos();
            alert('✅ Data has been reset to default values.');
        }
    }

    exportData() {
        // Ensure current date exists before exporting
        this.ensureCurrentDateExists();
        
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'track.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('📥 track.json downloaded! Replace the existing file to sync changes.', 'info');
    }

    importData() {
        document.getElementById('importFile').click();
    }

    handleImport(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData.records && Array.isArray(importedData.records)) {
                    this.data = importedData;
                    this.updateDisplay();
                    this.updatePhotos();
                    alert('✅ Data imported successfully!');
                } else {
                    alert('❌ Invalid file format. Please select a valid track.json file.');
                }
            } catch (error) {
                alert('❌ Error reading file. Please check the file format.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }

    async init() {
        // Wait for data to load
        this.data = await this.loadData();
        
        // Ensure current date exists in records
        this.ensureCurrentDateExists();
        
        // Set up event listeners
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => this.importData());
        document.getElementById('importFile').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.handleImport(e.target.files[0]);
            }
        });

        // PWA-specific features
        this.initializePWA();

        // Check for new date every hour
        setInterval(() => {
            this.ensureCurrentDateExists();
            this.updateDisplay();
        }, 60 * 60 * 1000);

        // Auto-save less frequently (only every 5 minutes)
        setInterval(() => {
            this.saveData();
        }, 5 * 60 * 1000);

        // Initial display update
        this.updateDisplay();
        this.updatePhotos();
        this.updateTrackJsonPreview();

        console.log('Weight Loss Tracker PWA initialized successfully!');
    }

    initializePWA() {
        // Check if app is offline
        this.updateOnlineStatus();
        window.addEventListener('online', () => this.updateOnlineStatus());
        window.addEventListener('offline', () => this.updateOnlineStatus());
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveData();
                        this.showNotification('Data saved!', 'success');
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportData();
                        break;
                }
            }
        });
        
        // Enable background sync for data
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then((registration) => {
                return registration.sync.register('background-sync-data');
            }).catch((error) => {
                console.log('Background sync registration failed:', error);
            });
        }
    }

    updateOnlineStatus() {
        const isOnline = navigator.onLine;
        const statusIndicator = document.getElementById('onlineStatus');
        
        if (!statusIndicator) {
            const indicator = document.createElement('div');
            indicator.id = 'onlineStatus';
            indicator.className = 'fixed top-4 left-4 px-3 py-1 rounded text-sm font-medium z-50';
            document.body.appendChild(indicator);
        }
        
        const indicator = document.getElementById('onlineStatus');
        if (isOnline) {
            indicator.className = 'fixed top-4 left-4 px-3 py-1 rounded text-sm font-medium z-50 bg-green-100 text-green-800';
            indicator.textContent = '🟢 Online';
            setTimeout(() => indicator.style.display = 'none', 3000);
        } else {
            indicator.className = 'fixed top-4 left-4 px-3 py-1 rounded text-sm font-medium z-50 bg-orange-100 text-orange-800';
            indicator.textContent = '🟡 Offline Mode';
            indicator.style.display = 'block';
        }
    }

    updateTrackJsonPreview() {
        const previewElement = document.getElementById('trackJsonPreview');
        if (previewElement) {
            const jsonStr = JSON.stringify(this.data, null, 2);
            previewElement.textContent = jsonStr;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = {
            success: 'bg-emerald-500/90',
            error: 'bg-red-500/90',
            info: 'bg-blue-500/90',
            warning: 'bg-amber-500/90'
        }[type] || 'bg-slate-600/90';
        
        const icon = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        }[type] || 'ℹ️';
        
        notification.className = `notification fixed top-20 right-4 px-6 py-4 rounded-xl text-white font-medium z-50 ${bgColor} backdrop-blur-md border border-white/10 shadow-xl max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-xl">${icon}</span>
                <span class="flex-1">${message}</span>
            </div>
        `;
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the application when the page loads
let tracker;
window.addEventListener('DOMContentLoaded', async () => {
    tracker = new WeightLossTracker();
});