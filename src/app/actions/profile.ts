'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return {
    ...data,
    email: user.email
  }
}

export async function updateProfile(formData: { full_name: string; username?: string; avatar_url?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('profiles')
    .update(formData)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function updateInstanceStatus(status: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING', phone?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      whatsapp_status: status,
      whatsapp_phone: phone || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating instance status:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function getInstanceStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { status: 'DISCONNECTED' }

  const { data, error } = await supabase
    .from('profiles')
    .select('whatsapp_status, whatsapp_phone')
    .eq('id', user.id)
    .single()

  if (error || !data) {
    return { status: 'DISCONNECTED' }
  }

  return { 
    status: data.whatsapp_status || 'DISCONNECTED',
    phone: data.whatsapp_phone
  }
}
