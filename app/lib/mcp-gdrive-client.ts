// lib/mcp-gdrive-client.ts
export class MCPGDriveClient {
  private baseUrl = 'http://localhost:3001'; // Connect to existing port 3001

  async connectToService(): Promise<void> {
    try {
      // Verify container is running
      const { stdout } = await execAsync('docker ps -qf "name=mcp-gdrive"');
      if (!(stdout as string).trim()) {
        throw new Error('MCP container is not running');
      }
      
      await this.waitForService();
    } catch (error) {
      console.error('Connection Error:', error);
      throw new Error('Failed to connect to MCP service');
    }
  }

  // Remove startService() since we're using existing container
  // Keep all other methods the same

  private async waitForService(): Promise<void> {
    // Poll the service until it's available
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.baseUrl}/health`);
        if (response.ok) {
          console.log('MCP service is ready');
          return;
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Service not ready yet
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between attempts
    }
    
    throw new Error('MCP service failed to become available');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function execAsync(_arg0: string): { stdout: string; } | PromiseLike<{ stdout: string; }> {
  throw new Error("Function not implemented.");
}
