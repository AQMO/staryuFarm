import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  const client = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) return NextResponse.json({ error: 'user_id is required' }, { status: 400 });

  const { data, error } = await client.from('cart').select('*').eq('user_id', Number(user_id)).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const client = getSupabaseClient();
  const body = await request.json();

  // Check if item already in cart
  const { data: existing } = await client
    .from('cart')
    .select('*')
    .eq('user_id', body.user_id)
    .eq('item_type', body.item_type)
    .eq('item_id', body.item_id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await client
      .from('cart')
      .update({ quantity: existing.quantity + (body.quantity || 1), updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data[0] });
  }

  const { data, error } = await client.from('cart').insert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}

export async function PUT(request: NextRequest) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { id, quantity } = body;

  const { data, error } = await client
    .from('cart')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}

export async function DELETE(request: NextRequest) {
  const client = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const user_id = searchParams.get('user_id');

  if (id) {
    const { error } = await client.from('cart').delete().eq('id', Number(id));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (user_id) {
    const { error } = await client.from('cart').delete().eq('user_id', Number(user_id));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ error: 'id or user_id is required' }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
