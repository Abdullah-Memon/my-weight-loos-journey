import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { formatDate, isToday, downloadJSON, showNotification, requestNotificationPermission, calculateBMI, getBMICategory } from './utils/helpers';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ProgressChart from './components/ProgressChart';
import MotivationPanel from './components/MotivationPanel';
import DailyTracker from './components/DailyTracker';
import MealPlan from './components/MealPlan';
import ExercisePlan from './components/ExercisePlan';
import RewardsSystem from './components/RewardsSystem';
import PhotoGallery from './components/PhotoGallery';
import Footer from './components/Footer';

function App() {
  const START_DATE = new Date(2025, 11, 3); // Dec 3, 2025
  const DAYS = 120;
  const START_WEIGHT = 100;
  const TARGET_MIN = 75;
  const TARGET_MAX = 80;

  const WEEKLY_QUOTES = [
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

  const generateDatesUpToToday = () => {
    const today = new Date();
    const dates = [];
    const startDate = new Date(START_DATE);
    
    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    
    return dates;
  };

  const getDefaultData = () => {
    const dates = generateDatesUpToToday();
    return {
      records: dates.map((date, i) => ({
        date: date.toISOString().slice(0, 10),
        morningWeight: i === 0 ? START_WEIGHT : "",
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
  };

  const [data, setData] = useLocalStorage('weight-tracker-backup', getDefaultData());

  const ensureCurrentDateExists = () => {
    const today = new Date().toISOString().slice(0, 10);
    const dates = generateDatesUpToToday();
    const existingDates = new Set(data.records.map(r => r.date));
    
    let hasNewDates = false;
    const newRecords = [...data.records];
    
    dates.forEach((date) => {
      const dateStr = date.toISOString().slice(0, 10);
      if (!existingDates.has(dateStr)) {
        newRecords.push({
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
        hasNewDates = true;
      }
    });
    
    if (hasNewDates) {
      newRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(prev => ({ ...prev, records: newRecords }));
    }
  };

  useEffect(() => {
    ensureCurrentDateExists();
    requestNotificationPermission();
    
    const interval = setInterval(() => {
      ensureCurrentDateExists();
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, []);

  const updateCell = (index, key, value) => {
    if (!data.records[index]) return;
    
    const newRecords = [...data.records];
    newRecords[index] = { ...newRecords[index], [key]: value };
    
    setData(prev => ({
      ...prev,
      records: newRecords,
      lastUpdated: new Date().toISOString()
    }));
  };

  const getCurrentWeight = () => {
    for (let i = data.records.length - 1; i >= 0; i--) {
      const weight = Number(data.records[i].morningWeight);
      if (!isNaN(weight) && weight > 0) {
        return weight;
      }
    }
    return START_WEIGHT;
  };

  const getTotalLost = () => {
    return Math.max(0, START_WEIGHT - getCurrentWeight());
  };

  const getWeeklyQuote = () => {
    const now = new Date();
    const weeksSince = Math.max(0, Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24 * 7)));
    const index = Math.min(WEEKLY_QUOTES.length - 1, weeksSince);
    return WEEKLY_QUOTES[index];
  };

  const getMonthlySummary = () => {
    const months = [
      { label: "Dec 2025", start: "2025-12-03", end: "2025-12-31" },
      { label: "Jan 2026", start: "2026-01-01", end: "2026-01-31" },
      { label: "Feb 2026", start: "2026-02-01", end: "2026-02-28" },
      { label: "Mar 2026", start: "2026-03-01", end: "2026-03-31" }
    ];

    return months.map(month => {
      const records = data.records.filter(r => r.date >= month.start && r.date <= month.end);
      const weights = records.map(r => Number(r.morningWeight)).filter(w => !isNaN(w) && w > 0);
      const startWeight = weights.length ? weights[0] : null;
      const endWeight = weights.length ? weights[weights.length - 1] : null;
      const lost = startWeight && endWeight ? (startWeight - endWeight) : null;
      
      return { ...month, startWeight, endWeight, lost };
    });
  };

  const getWeeklyStats = () => {
    const weeks = [];
    for (let w = 0; w < Math.ceil(DAYS / 7); w++) {
      const start = w * 7;
      const end = Math.min(start + 6, DAYS - 1);
      const records = data.records.slice(start, end + 1);
      
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
  };

  const getChartData = () => {
    return data.records.map(record => ({
      date: record.date,
      weight: Number(record.morningWeight) || null
    })).filter(item => item.weight !== null);
  };

  const generateRewards = () => {
    const rewards = [];
    for (let kg = 2; kg <= 25; kg += 2) {
      const type = kg % 5 === 0 ? "Big" : "Small";
      const suggestion = type === "Small" ? "Gol gappa / Ice cream" : "New shirt / Movie / Zinger";
      const achieved = getTotalLost() >= kg;
      
      rewards.push({
        kg,
        type,
        suggestion,
        achieved
      });
    }
    return rewards;
  };

  const handlePhotoUpload = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [index]: e.target.result
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const updateMeasurement = (key, value) => {
    setData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: value
      }
    }));
  };

  // Removed data management functions (reset, export, import) for cleaner UI

  return (
    <div className="min-h-screen" style={{ scrollBehavior: 'smooth' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <Header />

        <StatsCards 
          startWeight={START_WEIGHT}
          currentWeight={getCurrentWeight()}
          totalLost={getTotalLost()}
          targetMin={TARGET_MIN}
          targetMax={TARGET_MAX}
        />

        <section className="mb-8">
          <div className="grid-responsive main-grid">
            <ProgressChart 
              chartData={getChartData()}
              startWeight={START_WEIGHT}
            />
            <MotivationPanel 
              weeklyQuote={getWeeklyQuote()}
              monthlySummary={getMonthlySummary()}
              weeklyStats={getWeeklyStats()}
            />
          </div>
        </section>

        <div id="daily-tracker">
          <DailyTracker 
            records={data.records}
            onUpdateCell={updateCell}
          />
        </div>

        <section className="mb-8">
          <div className="grid-responsive plan-grid">
            <MealPlan />
            <ExercisePlan />
          </div>
        </section>

        <div id="rewards-system">
          <RewardsSystem rewards={generateRewards()} />
        </div>

        <div id="progress-gallery">
          <PhotoGallery 
            photos={data.photos}
            measurements={data.measurements}
            onPhotoUpload={handlePhotoUpload}
            onUpdateMeasurement={updateMeasurement}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;