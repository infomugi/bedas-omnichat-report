'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardStats(range: string = '7d', type?: string) {
  const supabase = await createClient()
  
  const now = new Date()
  let startDate = new Date()
  let days = 7

  if (range === '30d') {
    startDate.setDate(now.getDate() - 30)
    days = 30
  } else if (range === '90d') {
    startDate.setDate(now.getDate() - 90)
    days = 90
  } else if (range === 'all') {
    startDate = new Date(2000, 0, 1) // Way back
    days = 365 // limit trend to 1 year
  } else {
    startDate.setDate(now.getDate() - 7)
    days = 7
  }

  // Fetch summary stats & trend data
  let query = supabase
    .from('campaigns')
    .select('type, status, success_count, fail_count, target_count, created_at')
    .order('created_at', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }

  const { data: allCampaigns, error: summaryError } = await query

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
  
  // Trend
  const trendLabels: string[] = []
  const trendWA: number[] = []
  const trendSMS: number[] = []

  // Generate labels based on range
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(now.getDate() - i)
    
    let label = ''
    if (days <= 7) {
      label = d.toLocaleDateString('id-ID', { weekday: 'short' })
    } else if (days <= 30) {
      label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    } else {
      label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
    }
    
    // For large ranges like 90d or all, we might want to aggregate by week/month
    // but for now let's keep it daily for simplicity if <= 90
    trendLabels.push(label)
    trendWA.push(0)
    trendSMS.push(0)
  }

  allCampaigns.forEach(c => {
    // Only count stats within the selected range if not 'all'
    const cDate = new Date(c.created_at)
    if (range !== 'all' && cDate < startDate) return

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
    const diffTime = Math.abs(now.getTime() - cDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < days) {
      const index = (days - 1) - diffDays
      if (index >= 0 && index < trendLabels.length) {
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
