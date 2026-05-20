import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  const client = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) return NextResponse.json({ error: 'user_id is required' }, { status: 400 });

  const { data, error } = await client.from('address').select('*').eq('user_id', Number(user_id)).order('is_default', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const client = getSupabaseClient();
  const body = await request.json();

  // If setting as default, unset other defaults
  if (body.is_default && body.user_id) {
    await client.from('address').update({ is_default: false }).eq('user_id', body.user_id).eq('is_default', true);
  }

  const { data, error } = await client.from('address').insert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}

export async function PUT(request: NextRequest) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { id, ...updates } = body;
  updates.updated_at = new Date().toISOString();

  // If setting as default, unset other defaults
  if (updates.is_default && body.user_id) {
    await client.from('address').update({ is_default: false }).eq('user_id', body.user_id).eq('is_default', true);
  }

  const { data, error } = await client.from('address').update(updates).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}

export async function DELETE(request: NextRequest) {
  const client = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const { error } = await client.from('address').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
