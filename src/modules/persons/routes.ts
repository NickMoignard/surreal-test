import PromiseRouter from 'express-promise-router';
import { RouteGroup } from '../../server';
import { findPersons, getPersonWithArtistsOrderedFrom } from './controller';
import { Person, PersonId } from './types';
import { FindParams, parseFindParams } from '../../routes/find-params';
import { PersonWithArtistsOrderedFrom } from './model';

const router = PromiseRouter();

type FindPersonsResponseBody = {
  persons: Person[];
};

router.get<'/', undefined, FindPersonsResponseBody, undefined, FindParams<Person>>('/', async (req, res) => {
  const { sortField, sortDirection, pageSize, pageNum } = req.query;

  req.log.info(req.query);

  const persons = await findPersons({
    sortField,
    sortDirection,
    pageSize,
    pageNum,
  });

  res.status(200).json({ persons }).send();
});

export type GetPersonWithArtistsOrderedFromResponseBody = { person: PersonWithArtistsOrderedFrom };
router.get<'/:id', { id: string }, GetPersonWithArtistsOrderedFromResponseBody>('/:id', async (req, res) => {
  const { id } = req.params;

  const person = await getPersonWithArtistsOrderedFrom(id);

  res.status(200).json({ person }).send();
});

export const routeGroup: RouteGroup = {
  basePath: '/persons',
  router,
};
