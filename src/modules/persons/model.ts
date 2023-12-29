import { getDb } from '../../database';
import { InvalidOrderByPropertyError, InvalidOrderDirectionError } from '../../database/errors';
import { OrderDirection, isOrderDirection } from '../../database/types';
import { Person, PersonId, PersonOrderByField, isPersonOrderByField } from './types';

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

export type PersonWithArtistsOrderedFrom = Person & { artists_order_from: string[] };
export async function getPersonWithArtistsOrderedFrom(id: PersonId): Promise<PersonWithArtistsOrderedFrom> {
  const db = await getDb();

  const query = `
    SELECT ->order->product<-create<-artist.name as artists_ordered_from, * FROM person
    WHERE id = $id;
  `;

  const [person] = await db.query<PersonWithArtistsOrderedFrom[]>(query, { id });
  return person;
}
