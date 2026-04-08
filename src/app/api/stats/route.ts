import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Fetch summary stats
  const { data: summaryData, error: summaryError } = await supabase
    .from('campaigns')
    .select('type, status, success_count, fail_count, target_count')

  if (summaryError) {
    return NextResponse.json({ error: summaryError.message }, { status: 500 })
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

  summaryData.forEach(c => {
    stats.totalSent += c.success_count || 0
    stats.totalFailed += c.fail_count || 0
    if (c.type === 'WhatsApp') {
      stats.waSuccess += c.success_count || 0
      stats.countsByChannel.WhatsApp += c.target_count || 0
    } else if (c.type === 'SMS') {
      stats.smsSuccess += c.success_count || 0
      stats.countsByChannel.SMS += c.target_count || 0
    }
  })

  // Fetch recent activity (last 5 logs/campaigns)
  const { data: recentActivity, error: activityError } = await supabase
    .from('campaigns')
    .select('name, type, status, success_count, target_count, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    summary: stats,
    activity: recentActivity || []
  })
}
