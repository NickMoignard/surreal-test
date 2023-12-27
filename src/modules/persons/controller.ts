import { find } from './model';
import { Person } from './types';
import { parseFindParams, FindParams } from '../../routes/find-params';

export async function findPersons(input: FindParams<Person>) {
  const findParams = parseFindParams<Person>(input);

  return await find(findParams);
}
