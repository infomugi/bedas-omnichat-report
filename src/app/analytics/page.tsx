import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getDashboardStats } from '@/app/actions/stats';
import { AnalyticsClient } from '@/components/analytics/AnalyticsClient';

export default async function AnalyticsPage() {
  const statsData = await getDashboardStats();
  const stats = statsData?.summary || {
    totalSent: 0,
    waSuccess: 0,
    smsSuccess: 0,
    totalFailed: 0,
    countsByChannel: { WhatsApp: 0, SMS: 0 }
  };

  const channelData = {
    labels: ['WhatsApp Blast', 'SMS Blast', 'SMS LBA'],
    datasets: [
      {
        label: 'Terkirim',
        data: [stats.waSuccess, stats.smsSuccess, 0], 
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
      {
        label: 'Gagal',
        data: [
          stats.countsByChannel.WhatsApp - stats.waSuccess, 
          stats.countsByChannel.SMS - stats.smsSuccess, 
          0
        ], 
        backgroundColor: '#e2e8f0',
        borderRadius: 8,
      }
    ]
  };

  const deliveryRate = stats.totalSent > 0 
    ? ((stats.totalSent / (stats.totalSent + stats.totalFailed)) * 100).toFixed(1) 
    : "0";

  // Calculation for spending
  const totalSpending = (stats.waSuccess * 275) + (stats.smsSuccess * 450);

  return (
    <AppLayout title="Analytics Overview">
      <AnalyticsClient 
        stats={stats} 
        statsData={statsData} 
        deliveryRate={deliveryRate} 
        totalSpending={totalSpending} 
        channelData={channelData} 
      />
    </AppLayout>
  );
}
