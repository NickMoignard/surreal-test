import pino, { LoggerExtras } from 'pino';

export type LogLevel = 'info' | 'warn' | 'debug' | 'trace' | 'fatal' | 'error';

export function getServerLogger() {
  const logger = pino();
  return logger.child<LogLevel>({ component: 'server' });
}

export type ServerLogger = ReturnType<typeof getServerLogger>;

const log = getServerLogger();
