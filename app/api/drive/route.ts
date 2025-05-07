import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || '{}');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const folderId = '12f8MhuJePME2EmXBt-5_OuBjs0q-HDBR';
    console.log("Folder ID:", folderId);

    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name, mimeType, webViewLink)',
      q: `'${folderId}' in parents`,
    });

    console.log("Response:", response.data.files);

    return NextResponse.json({ files: response.data.files || [] });
  } catch (error) {
    console.error('Google Drive API error:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
