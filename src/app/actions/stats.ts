'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Fetch summary stats & trend data
  const { data: allCampaigns, error: summaryError } = await supabase
    .from('campaigns')
    .select('type, status, success_count, fail_count, target_count, created_at')
    .order('created_at', { ascending: true })

  if (summaryError) {
    console.error('Error fetching dashboard stats:', summaryError)
    return null
  }

  const stats = {
    totalSent: 0,
    waSuccess: 0,
    smsSuccess: 0,
    totalFailed: 0,
    countsByChannel: {
      WhatsApp: 0,
      SMS: 0
    }
  }

  // Distribution
  const distribution = { WhatsApp: 0, SMS: 0, LBA: 0 }
  
  // Trend (last 7 days)
  const today = new Date()
  const trendLabels: string[] = []
  const trendWA: number[] = []
  const trendSMS: number[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    trendLabels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }))
    trendWA.push(0)
    trendSMS.push(0)
  }

  allCampaigns.forEach(c => {
    stats.totalSent += c.success_count || 0
    stats.totalFailed += c.fail_count || 0
    
    if (c.type === 'WhatsApp') {
      stats.waSuccess += c.success_count || 0
      stats.countsByChannel.WhatsApp += c.target_count || 0
      distribution.WhatsApp += c.target_count || 0
    } else if (c.type === 'SMS') {
      stats.smsSuccess += c.success_count || 0
      stats.countsByChannel.SMS += c.target_count || 0
      distribution.SMS += c.target_count || 0
    }

    // Trend logic
    const cDate = new Date(c.created_at)
    const diffTime = Math.abs(today.getTime() - cDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 7) {
      const index = 6 - diffDays
      if (index >= 0) {
        if (c.type === 'WhatsApp') trendWA[index] += c.success_count || 0
        else if (c.type === 'SMS') trendSMS[index] += c.success_count || 0
      }
    }
  })

  // Normalize distribution to percentages (mocking LBA as 10% for now if zero)
  const total = (distribution.WhatsApp + distribution.SMS) || 1
  const distData = [
    Math.round((distribution.WhatsApp / total) * 100),
    Math.round((distribution.SMS / total) * 100),
    10 // Mock LBA
  ]

  // Fetch recent activity
  const { data: recentActivity, error: activityError } = await supabase
    .from('campaigns')
    .select('name, type, status, success_count, target_count, created_at')
    .order('created_at', { ascending: false })
    .limit(4)

  return {
    summary: stats,
    distribution: distData,
    trend: {
      labels: trendLabels,
      wa: trendWA,
      sms: trendSMS
    },
    activity: recentActivity || []
  }
}
