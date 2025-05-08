// lib/mcpService.ts
// Remove unused import until config file is properly set up
// import config from '../mcp.config.json';

export class MCPService {
  private gdriveEndpoint: string;

  constructor() {
    this.gdriveEndpoint = 'http://localhost:3001'; // Match your Docker port
  }

  async queryGDrive(action: string, params: Record<string, unknown>) {
    const response = await fetch(`${this.gdriveEndpoint}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`MCP Error: ${response.statusText}`);
    }

    return await response.json();
  }

  // Example methods
  async searchFiles(query: string) {
    return this.queryGDrive('search', { query });
  }

  async getFile(fileId: string) {
    return this.queryGDrive('files/get', { fileId });
  }
}