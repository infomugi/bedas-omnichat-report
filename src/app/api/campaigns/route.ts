import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  let query = supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('campaigns')
    .insert([{
      name: body.name,
      type: body.type,
      sender: body.sender,
      category: body.category,
      message: body.message,
      status: body.status || 'Draft',
      target_count: body.targetCount || 0,
      success_count: body.successCount || 0,
      fail_count: body.failCount || 0,
      scheduled_at: body.scheduledAt,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}
