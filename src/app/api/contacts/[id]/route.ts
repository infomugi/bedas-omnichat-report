import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET: Mengambil daftar kontak dalam satu grup (contact_list_id).
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('list_id', params.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

/**
 * POST: Menambahkan kontak baru ke grup tertentu.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, phone, email, tags } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: 'Nomor telepon wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        list_id: params.id,
        name,
        phone,
        email,
        tags,
        user_id: user.id
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Log sistem
    await supabase.from('system_logs').insert({
      level: 'info',
      msg: `Added contact ${phone} to list ${params.id}`,
      source: 'CONTACTS_API'
    })

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

/**
 * DELETE: Menghapus kontak.
 * Catatan: Biasanya kita hapus berdasarkan ID kontak, bukan list ID. 
 * Tapi kita bisa handle penghapusan masal di sini di masa depan.
 */
