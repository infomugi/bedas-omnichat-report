import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET: Mengekspor data (campaigns/transactions) ke format CSV.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'campaigns'
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let query = supabase.from(type).select('*')
  
  // Filter berdasarkan user
  query = query.eq('user_id', user.id)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return new NextResponse('No data available', { status: 200 })
  }

  // Convert JSON to CSV with basic escaping
  const headers = Object.keys(data[0]).join(',')
  const csvRows = data.map(row => {
    return Object.values(row).map(val => {
      const escaped = ('' + val).replace(/"/g, '""')
      return `"${escaped}"`
    }).join(',')
  })

  const csvContent = [headers, ...csvRows].join('\n')

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${type}_export_${new Date().getTime()}.csv"`
    }
  })
}
