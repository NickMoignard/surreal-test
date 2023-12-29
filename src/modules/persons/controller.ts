import { PersonWithArtistsOrderedFrom, find, getPersonWithArtistsOrderedFrom as get } from './model';
import { Person, PersonId } from './types';
import { parseFindParams, FindParams } from '../../routes/find-params';

export async function findPersons(input: FindParams<Person>) {
  const findParams = parseFindParams<Person>(input);

  return await find(findParams);
}

export async function getPersonWithArtistsOrderedFrom(id: string): Promise<PersonWithArtistsOrderedFrom> {
  const personId = `person:${id}` as const;
  return await get(personId);
}
