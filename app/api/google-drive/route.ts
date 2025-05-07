import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accessToken = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
    const res = await fetch('https://www.googleapis.com/drive/v3/files', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    return NextResponse.json({ files: data.files || [] });
  } catch (error) {
    console.error('Error fetching from drive:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
