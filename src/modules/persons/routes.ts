import PromiseRouter from 'express-promise-router';
import { RouteGroup } from '../../server';
import { findPersons } from './controller';
import { Person } from './types';
import { FindParams, parseFindParams } from '../../routes/find-params';

const router = PromiseRouter();

type ResponseBody = {
  persons: Person[];
};

router.get<'/', undefined, ResponseBody, undefined, FindParams<Person>>('/', async (req, res) => {
  const { sortField, sortDirection, pageSize, pageNum } = req.query;

  const persons = await findPersons({
    sortField,
    sortDirection,
    pageSize,
    pageNum,
  });

  res.status(200).json({ persons }).send();
});

export const routeGroup: RouteGroup = {
  basePath: '/persons',
  router,
};
