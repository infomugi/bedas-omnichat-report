'use server'

import { createClient } from '@/utils/supabase/server'

export async function getTransactions() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data
}

export async function getBalance() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')

  if (error) {
    console.error('Error fetching balance:', error)
    return 0
  }

  const balance = data.reduce((acc, curr) => {
    return curr.type === 'in' ? acc + curr.amount : acc - curr.amount
  }, 0)

  return balance
}

export async function createTopup(amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: user.id,
        amount,
        type: 'in',
        channel: 'System',
        description: 'Top-up Saldo via QRIS (Simulation)',
        status: 'COMPLETED'
      }
    ])

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function deductBalance(amount: number, description: string, channel: string = 'Campaign') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Check current balance first
  const currentBalance = await getBalance()
  if (currentBalance < amount) {
    return { error: 'Saldo tidak mencukupi untuk melakukan kampanye ini.' }
  }

  const { error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: user.id,
        amount,
        type: 'out',
        channel,
        description,
        status: 'COMPLETED'
      }
    ])

  if (error) {
    console.error('Error deducting balance:', error)
    return { error: error.message }
  }

  return { success: true }
}
