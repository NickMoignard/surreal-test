import { getDb } from '../../database';
import { InvalidOrderByPropertyError, InvalidOrderDirectionError } from '../../database/errors';
import { OrderDirection, isOrderDirection } from '../../database/types';
import { Person, PersonOrderByField, isPersonOrderByField } from './types';

export async function find({
  limit,
  start,
  orderBy,
  orderDirection,
}: {
  limit: number;
  start: number;
  orderBy: PersonOrderByField;
  orderDirection: OrderDirection;
}): Promise<Person[]> {
  const db = await getDb();

  if (!isOrderDirection(orderDirection)) {
    throw new InvalidOrderDirectionError();
  }

  if (!isPersonOrderByField(orderBy)) {
    throw new InvalidOrderByPropertyError();
  }

  const query = `
    SELECT * FROM person
    ORDER BY ${orderBy} ${orderDirection}
    LIMIT $limit
    START $start;
  `;

  const persons = await db.query<Person[]>(query, { limit, start });
  return persons;
}
