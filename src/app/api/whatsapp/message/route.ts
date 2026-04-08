import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { createCampaign } from '@/app/actions/campaigns'

/**
 * POST: Mengirim pesan WhatsApp tunggal (Test/API).
 * Menggunakan logic createCampaign untuk pemotongan saldo dan pencatatan history.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { number, message } = await request.json()

    if (!number || !message) {
      return NextResponse.json({ error: 'Nomor dan pesan wajib diisi' }, { status: 400 })
    }

    // Gunakan server action createCampaign
    // Ini memastikan saldo terpotong dan kampanye tercatat di DB.
    const result = await createCampaign({
      name: `Test WhatsApp - ${number}`,
      type: 'WhatsApp',
      sender: 'OMNICHAT_API',
      category: 'Test',
      message: message,
      status: 'Sent',
      targetCount: 1,
      successCount: 1,
      failCount: 0,
      scheduledAt: new Date().toISOString()
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Tambahkan log sistem
    await supabase.from('system_logs').insert({
      level: 'success',
      msg: `Test WhatsApp message sent to ${number}`,
      source: 'WHATSAPP_API'
    })

    return NextResponse.json({ success: true, campaignId: result.data?.[0]?.id })
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
