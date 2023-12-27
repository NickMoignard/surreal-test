import { getServerLogger } from './logger';
import { run } from './server';

const logger = getServerLogger();

const SERVER_CONFIGURATION = {
  name: 'bun-surreal-test',
  routes: [],
};

async function main() {
  try {
    await run(SERVER_CONFIGURATION);
  } catch (err) {
    logger.error({ err }, 'unable to start server');
  } finally {
    logger.info('server shutdown');
  }
}

(async () => {
  await main();
})();
