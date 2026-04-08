import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { createCampaign } from '@/app/actions/campaigns'

/**
 * POST: Membuat kampanye SMS LBA (Location Based Advertising).
 * Menghandle data campaign dasar + data penargetan geografis (lat, lng, radius).
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { message, targetCount, lbaData } = await request.json()

    if (!message || !lbaData) {
      return NextResponse.json({ error: 'Data LBA tidak lengkap' }, { status: 400 })
    }

    const campaignName = `LBA - ${new Date().toLocaleDateString('id-ID')} (${lbaData.lat}, ${lbaData.lng})`

    // 1. Buat Campaign Dasar (Deduct Balance via Server Action)
    const result = await createCampaign({
      name: campaignName,
      type: 'SMS',
      sender: 'OMNICHAT',
      category: 'LBA',
      message: message,
      status: 'Sent',
      targetCount: targetCount,
      successCount: targetCount,
      failCount: 0,
      scheduledAt: new Date().toISOString()
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const campaignId = result.data?.[0]?.id

    // 2. Simpan Data Penargetan Geografis ke lba_targets
    if (campaignId) {
      const { error: lbaError } = await supabase.from('lba_targets').insert({
        campaign_id: campaignId,
        latitude: lbaData.lat,
        longitude: lbaData.lng,
        radius: lbaData.radius,
        target_provider: lbaData.provider || 'ALL'
      })

      if (lbaError) {
        console.error('Error saving LBA targets:', lbaError)
        // Kita tidak menggagalkan campaign jika hanya data target gagal (opsional, tapi biasanya dicatat)
      }
    }

    // 3. Tambahkan log sistem
    await supabase.from('system_logs').insert({
      level: 'success',
      msg: `LBA Campaign initiated targeting area (${lbaData.lat}, ${lbaData.lng}) radius ${lbaData.radius}m.`,
      source: 'LBA_API'
    })

    return NextResponse.json({ success: true, campaignId })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
