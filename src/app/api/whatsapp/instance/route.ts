import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET: Mengambil status instance WhatsApp user yang sedang login.
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('whatsapp_status, whatsapp_phone, whatsapp_session')
    .eq('id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    status: data.whatsapp_status || 'DISCONNECTED',
    phone: data.whatsapp_phone,
    session: data.whatsapp_session
  })
}

/**
 * POST: Mengupdate status/session instance WhatsApp.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status, phone, session } = body

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status !== undefined) updateData.whatsapp_status = status
    if (phone !== undefined) updateData.whatsapp_phone = phone
    if (session !== undefined) updateData.whatsapp_session = session

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Buat log sistem
    await supabase.from('system_logs').insert({
      level: 'info',
      msg: `WhatsApp Instance ${status} for user ${user.email}`,
      source: 'WHATSAPP_API'
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
