import { getDashboardStats } from '@/app/actions/stats'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '7d'
  const type = searchParams.get('type') || undefined

  const stats = await getDashboardStats(range, type)

  if (!stats) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }

  return NextResponse.json(stats)
}
