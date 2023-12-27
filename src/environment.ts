// Server
export const HTTP_SERVER_PORT = Number(Bun.env.HTTP_PORT ?? 3000);
export const HTTPS_SERVER_PORT = Number(Bun.env.HTTPS_PORT ?? 8443);
export const LOG_LEVEL = Bun.env.LOG_LEVEL ?? 'info';
export const SHUTDOWN_TIMEOUT = Number(Bun.env.SHUTDOWN_TIMEOUT ?? 30_000);

// Database
export const DB_PASS = Bun.env.DB_PASS ?? 'testpass';
export const DB_USER = Bun.env.DB_USER ?? 'surreal';
export const DB_PORT = Number(Bun.env.DB_PORT ?? 8000);
export const DB_NAME = Bun.env.DB_NAME ?? 'test';
export const DB_NAMESPACE = Bun.env.DB_NAMESPACE ?? 'test';
export const DB_HOST = Bun.env.DB_HOST ?? 'localhost';

// Overridable DB Uri
export const DB_URI = Bun.env.DB_URI ?? `http://${DB_HOST}:${DB_PORT}`;
