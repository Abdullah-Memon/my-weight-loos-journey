import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressChart = ({ chartData, startWeight }) => {
  const options = {
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
        min: Math.max(60, startWeight - 30),
        max: startWeight + 2,
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
  };

  const data = {
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
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-100">Progress Chart</h2>
        <div className="text-2xl">📈</div>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ProgressChart;