import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import Papa from 'papaparse'

/**
 * POST: Mengunggah file CSV, memproses data, dan memasukkannya ke tabel 'contacts' secara massal.
 * Body: FormData (file, name, channel)
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const listName = formData.get('name') as string
    const channel = formData.get('channel') as string || 'WhatsApp'

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    // Baca konten file
    const text = await file.text()
    
    // Parse CSV menggunakan Papaparse
    const parseResult = Papa.parse(text, { 
      header: true, 
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase() 
    })

    const rows = parseResult.data as any[]

    if (rows.length === 0) {
      return NextResponse.json({ error: 'File CSV kosong atau format tidak valid' }, { status: 400 })
    }

    // 1. Buat Grup Kontak (contact_lists)
    const { data: list, error: listError } = await supabase
      .from('contact_lists')
      .insert({ 
        name: listName || `Import ${new Date().toLocaleDateString()}`, 
        user_id: user.id, 
        channel 
      })
      .select()
      .single()

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 })
    }

    // 2. Pemetaan baris CSV ke struktur tabel 'contacts'
    // Mendukung variasi header: phone, mobile, whatsapp, nomor, hp
    const contactsToInsert = rows.map(row => {
      const phone = row.phone || row.mobile || row.whatsapp || row.nomor || row.hp || row.phone_number;
      const name = row.name || row.nama || row.full_name || '';
      const email = row.email || '';
      const tags = row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [];

      return {
        list_id: list.id,
        user_id: user.id,
        phone: String(phone).replace(/\D/g, ''), // Bersihkan nomor dari karakter non-digit
        name,
        email,
        tags
      }
    }).filter(c => c.phone && c.phone.length >= 8) // Validasi minimal panjang nomor

    if (contactsToInsert.length === 0) {
      // Cleanup list if no valid contacts found
      await supabase.from('contact_lists').delete().eq('id', list.id)
      return NextResponse.json({ error: 'Tidak ditemukan nomor telepon valid dalam file CSV' }, { status: 400 })
    }

    // 3. Masukkan secara massal (Bulk Insert)
    const { error: insertError } = await supabase
      .from('contacts')
      .insert(contactsToInsert)

    if (insertError) {
      // Cleanup list on failure
      await supabase.from('contact_lists').delete().eq('id', list.id)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // 4. Log aktivitas
    await supabase.from('system_logs').insert({
      level: 'success',
      msg: `Imported ${contactsToInsert.length} contacts to list '${list.name}'`,
      source: 'CONTACTS_IMPORT'
    })

    return NextResponse.json({ 
      success: true, 
      listId: list.id, 
      count: contactsToInsert.length 
    })

  } catch (err: any) {
    console.error('CSV Import Error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan saat memproses file' }, { status: 500 })
  }
}
