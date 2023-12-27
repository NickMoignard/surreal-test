import { Surreal } from 'surrealdb.js';
import { getDbLogger } from './logger';
import { DB_NAME, DB_NAMESPACE, DB_PASS, DB_URI, DB_USER } from '../environment';

let db: Surreal | undefined;

const logger = getDbLogger();

export async function getDb(): Promise<Surreal> {
  const surreal = new Surreal();

  if (db) {
    return db;
  }

  logger.info('establishing connection to database');
  try {
    await surreal.connect(DB_URI, {
      database: 'test',
      namespace: 'test',
      // auth: {
      //   database: DB_NAME,
      //   namespace: DB_NAMESPACE,
      //   scope: 'service-user',
      //   username: DB_USER,
      //   password: DB_PASS,
      // },
    });
    await surreal.wait();
    logger.info('connected to database');
    db = surreal;
    return surreal;
  } catch (err) {
    logger.error('unable to connect to database');
    throw err;
  }
}

export async function closeDb() {
  if (!db) {
    logger.warn('Error: tried to close db connection when not connected');
    return;
  }

  await db.close();
  db = undefined;
}
