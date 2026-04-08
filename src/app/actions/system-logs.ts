'use server'

import { createClient } from '@/utils/supabase/server'

export async function getSystemLogs() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('system_logs')
    .select('*')
    .order('time', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching system logs:', error)
    return []
  }

  return data
}

export async function addSystemLog(log: { level: string; msg: string; source: string }) {
  const supabase = await createClient()

  const { error } = await supabase.from('system_logs').insert([log])

  if (error) {
    console.error('Error adding system log:', error)
    return { error: error.message }
  }

  return { success: true }
}
