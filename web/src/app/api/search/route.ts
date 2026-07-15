import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const limit = searchParams.get('limit') || '10';

  if (!q || q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/articles/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      return NextResponse.json({ items: [] });
    }

    const data = await res.json();
    return NextResponse.json({ items: data.results || [] });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
