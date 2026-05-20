import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  const client = getSupabaseClient();

  const [roomsRes, foodRes, productsRes, treesRes, plotsRes, ordersRes, usersRes] = await Promise.all([
    client.from('rooms').select('*', { count: 'exact', head: true }),
    client.from('food').select('*', { count: 'exact', head: true }),
    client.from('products').select('*', { count: 'exact', head: true }),
    client.from('fruit_trees').select('*', { count: 'exact', head: true }),
    client.from('plots').select('*', { count: 'exact', head: true }),
    client.from('orders').select('*', { count: 'exact', head: true }),
    client.from('users').select('*', { count: 'exact', head: true }),
  ]);

  const [pendingOrders, todayOrders] = await Promise.all([
    client.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    client.from('orders').select('total_amount').gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ]);

  let todayRevenue = 0;
  if (todayOrders.data) {
    todayRevenue = todayOrders.data.reduce((sum: number, o: { total_amount: string }) => sum + Number(o.total_amount), 0);
  }

  return NextResponse.json({
    counts: {
      rooms: roomsRes.count || 0,
      food: foodRes.count || 0,
      products: productsRes.count || 0,
      fruit_trees: treesRes.count || 0,
      plots: plotsRes.count || 0,
      orders: ordersRes.count || 0,
      users: usersRes.count || 0,
    },
    pendingOrders: pendingOrders.count || 0,
    todayRevenue,
  });
}
