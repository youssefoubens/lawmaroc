// lib/config.ts
import { MCPGDriveClient } from './mcp-gdrive-client';

const gdriveConfig = {
  args: [
    'run', '-i', '--rm',
    '-v', 'mcp-gdrive:/gdrive-server',
    '-e', 'GDRIVE_CREDENTIALS_PATH=/gdrive-server/credentials.json',
    '-p', '3002:3000',
    'mcp/gdrive'
  ]
};

export const mcpGDriveClient = new MCPGDriveClient(gdriveConfig);