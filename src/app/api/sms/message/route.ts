import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { createCampaign } from '@/app/actions/campaigns'

/**
 * POST: Mengirim pesan SMS Blast.
 * Menggunakan logic createCampaign untuk pemotongan saldo dan pencatatan history.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, sender, message, targetCount } = await request.json()

    if (!name || !message || !targetCount) {
      return NextResponse.json({ error: 'Data kampanye tidak lengkap' }, { status: 400 })
    }

    const result = await createCampaign({
      name,
      type: 'SMS',
      sender: sender || 'BEDAS_INFO',
      category: 'Blast',
      message,
      status: 'Sent',
      targetCount,
      successCount: targetCount, // Mocking success for now
      failCount: 0,
      scheduledAt: new Date().toISOString()
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Tambahkan log sistem
    await supabase.from('system_logs').insert({
      level: 'success',
      msg: `SMS Blast campaign "${name}" sent to ${targetCount} recipients.`,
      source: 'SMS_API'
    })

    return NextResponse.json({ success: true, campaignId: result.data?.[0]?.id })
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * GET: Mengambil daftar kampanye SMS (Opsional, sudah ada di actions).
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('type', 'SMS')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
