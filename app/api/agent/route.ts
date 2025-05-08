// app/api/agent/route.ts
import { NextResponse } from 'next/server';
import { MCPService } from '../../lib/mcpService';

export async function POST(req: Request) {
  const mcpService = new MCPService();
  const { message } = await req.json();

  try {
    // Example: Search Drive when user asks for documents
    if (message.includes("find") || message.includes("document")) {
      const results = await mcpService.searchFiles(message);
      return NextResponse.json({
        response: `I found these files: ${JSON.stringify(results)}`
      });
    }

    // ... rest of your AI logic

  } catch (error) {
    console.error('MCP Integration Error:', error);
    return NextResponse.json(
      { error: 'Failed to access documents' },
      { status: 500 }
    );
  }
}