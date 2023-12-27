import pinoHttp from 'pino-http';
import type { Options, HttpLogger } from 'pino-http';
import type { Request, Response } from 'express';
import { LOG_LEVEL } from '../environment';

export function getHttpLogger(): AppLogger {
  const options = {};
  return createAppLogger(options);
}

// https://www.npmjs.com/package/pino-http
export function createAppLogger(options?: Partial<Options>): AppLogger {
  return pinoHttp<Request, Response, LogLevel>(composeLoggingOptions(options));
}

export function composeLoggingOptions(overrides?: Partial<Options>): Options<Request, Response> {
  return {
    level: LOG_LEVEL,
    ...overrides,
  };
}

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug';
export type AppLogger = HttpLogger<Request, Response, LogLevel>;
