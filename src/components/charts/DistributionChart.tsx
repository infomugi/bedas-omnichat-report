"use client";

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function DistributionChart() {
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const data = {
    labels: ['WA Blast', 'SMS Blast', 'SMS LBA'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#10b981', '#3b82f6', '#6366f1'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
}
