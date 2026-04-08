"use client";

import React from 'react';
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
  ChartOptions
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

export function TrendChart({ 
  labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
  waData = [0, 0, 0, 0, 0, 0, 0],
  smsData = [0, 0, 0, 0, 0, 0, 0]
}: { 
  labels?: string[], 
  waData?: number[], 
  smsData?: number[] 
}) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(241, 245, 249, 0.5)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11
          },
          callback: (value) => value.toLocaleString('id-ID')
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'WhatsApp',
        data: waData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'SMS',
        data: smsData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  return <Line options={options} data={chartData} />;
}
