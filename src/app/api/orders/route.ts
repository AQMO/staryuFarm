import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

function generateOrderNo(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `ORD${y}${m}${d}${h}${mi}${s}${rand}`;
}

export async function GET(request: NextRequest) {
  const client = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const user_id = searchParams.get('user_id');
  const order_type = searchParams.get('order_type');
  const status = searchParams.get('status');
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '20');

  if (id) {
    const { data, error } = await client.from('orders').select('*').eq('id', id).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  let query = client.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (user_id) query = query.eq('user_id', Number(user_id));
  if (order_type) query = query.eq('order_type', order_type);
  if (status) query = query.eq('status', status);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, total: count, page, pageSize });
}

export async function POST(request: NextRequest) {
  const client = getSupabaseClient();
  const body = await request.json();
  const order_no = generateOrderNo();

  const { data, error } = await client.from('orders').insert({ ...body, order_no }).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}

export async function PUT(request: NextRequest) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { id, ...updates } = body;
  updates.updated_at = new Date().toISOString();

  if (updates.status === 'paid') updates.paid_at = new Date().toISOString();
  if (updates.status === 'completed') updates.completed_at = new Date().toISOString();
  if (updates.status === 'cancelled') updates.cancelled_at = new Date().toISOString();

  const { data, error } = await client.from('orders').update(updates).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}
