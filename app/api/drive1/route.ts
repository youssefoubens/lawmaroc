import { mcpGDriveClient } from "../../lib/config";
import { NextResponse } from "next/server";

// app/api/drive/route.ts
export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    // Connect to existing service instead of starting new
    await mcpGDriveClient.connectToService();
    const results = await mcpGDriveClient.searchFiles(query);
    
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
  // Remove finally block since we're not managing container lifecycle
}