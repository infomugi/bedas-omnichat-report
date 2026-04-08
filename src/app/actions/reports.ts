'use server'

import { createClient } from '@/utils/supabase/server'

export async function exportCampaignsToCSV() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching campaigns for export:', error)
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    return { error: 'Tidak ada data kampanye untuk diekspor.' }
  }

  // Define headers
  const headers = ['ID', 'Name', 'Type', 'Category', 'Sender', 'Message', 'Status', 'Target', 'Success', 'Fail', 'Created At']
  
  // Convert rows to CSV format
  const rows = data.map(c => [
    c.id,
    c.name,
    c.type,
    c.category,
    c.sender,
    `"${c.message.replace(/"/g, '""')}"`, // Escape quotes in message
    c.status,
    c.target_count,
    c.success_count,
    c.fail_count,
    c.created_at
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n')

  return { success: true, csv: csvContent }
}
