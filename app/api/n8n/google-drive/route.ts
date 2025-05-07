import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const n8nResponse = await fetch(process.env.N8N_GOOGLE_DRIVE_WEBHOOK!, {
      headers: {
        'Authorization': `Bearer ${process.env.N8N_API_KEY}`
      }
    });
    
    const data = await n8nResponse.json();
    return NextResponse.json({ files: data.files || [] });
    
  } catch (error) {
    console.error('Error fetching from n8n:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}