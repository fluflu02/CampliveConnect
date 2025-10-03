import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Custom WebSocket with SSL configuration for development environment only
if (process.env.NODE_ENV === "development") {
  class CustomWebSocket extends ws {
    constructor(address: any, protocols: any) {
      super(address, protocols, {
        rejectUnauthorized: false
      });
    }
  }
  neonConfig.webSocketConstructor = CustomWebSocket as any;
} else {
  neonConfig.webSocketConstructor = ws;
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => console.error('Database pool error:', err));

export const db = drizzle({ client: pool });
