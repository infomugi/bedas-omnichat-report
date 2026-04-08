'use server'

import { createClient } from '@/utils/supabase/server'
import { Campaign } from '@/types/campaign'
import { deductBalance } from './billing'

export async function getCampaigns(type?: 'WhatsApp' | 'SMS') {
  const supabase = await createClient()

  let query = supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching campaigns:', error)
    return []
  }

  // Map snake_case to camelCase if necessary (matching the Campaign type)
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    sender: item.sender,
    category: item.category,
    message: item.message,
    status: item.status,
    targetCount: item.target_count,
    successCount: item.success_count,
    failCount: item.fail_count,
    createdAt: item.created_at,
    scheduledAt: item.scheduled_at,
  })) as Campaign[]
}

export async function createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt'>) {
  const supabase = await createClient()

  // Calculate cost
  let rate = 450 // Default SMS
  if (campaign.type === 'WhatsApp') rate = 275
  else if (campaign.type === 'SMS' && campaign.category === 'LBA') rate = 800

  const totalCost = campaign.targetCount * rate

  // Deduct balance first
  const debit = await deductBalance(
    totalCost, 
    `Campaign: ${campaign.name} (${campaign.targetCount} messages)`,
    campaign.type
  )

  if (debit.error) {
    return { error: debit.error }
  }

  // Map camelCase to snake_case for Supabase
  const { data, error } = await supabase
    .from('campaigns')
    .insert([{
      name: campaign.name,
      type: campaign.type,
      sender: campaign.sender,
      category: campaign.category,
      message: campaign.message,
      status: campaign.status,
      target_count: campaign.targetCount,
      success_count: campaign.successCount,
      fail_count: campaign.failCount,
      scheduled_at: campaign.scheduledAt,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()

  if (error) {
    console.error('Error creating campaign:', error)
    return { error: error.message }
  }

  return { success: true, data }
}

export async function deleteCampaign(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('campaigns').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting campaign:', error)
    return { error: error.message }
  }
  
  return { success: true }
}
