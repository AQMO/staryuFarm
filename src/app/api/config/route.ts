import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  const client = getSupabaseClient();
  const { data, error } = await client.from('module_config').select('*').order('sort', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { id, is_enabled, module_name, sort, icon, description } = body;

  const { data, error } = await client
    .from('module_config')
    .update({ is_enabled, module_name, sort, icon, description, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}

export async function POST(request: NextRequest) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { module_key, module_name, is_enabled, sort, icon, description } = body;

  const { data, error } = await client
    .from('module_config')
    .insert({ module_key, module_name, is_enabled: is_enabled ?? true, sort: sort ?? 0, icon, description })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data[0] });
}
