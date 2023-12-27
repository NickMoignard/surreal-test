import { getServerLogger } from './logger';
import { run } from './server';

import { routeGroup as personsRouteGroup } from './modules/persons/routes';

const SERVER_CONFIGURATION = {
  name: 'bun-surreal-test',
  routes: [personsRouteGroup],
};

export async function main() {
  const logger = getServerLogger();

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
