import pino from 'pino';

type LogLevel = 'info' | 'warn' | 'debug' | 'trace' | 'fatal' | 'error';

export function getDbLogger() {
  const logger = pino<LogLevel>();
  return logger.child({ component: 'database' });
}
