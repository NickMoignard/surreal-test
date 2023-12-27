import { OrderDirection } from '../database/types';

export type FindParams<T extends Record<string, unknown>> = {
  sortField: keyof T;
  sortDirection: OrderDirection;
  pageSize: number;
  pageNum: number;
};

export function parseFindParams<T extends Record<string, unknown>>({
  sortField,
  sortDirection,
  pageNum,
  pageSize,
}: FindParams<T>): {
  limit: number;
  start: number;
  orderBy: keyof T;
  orderDirection: OrderDirection;
} {
  const limit = pageSize;
  const start = (pageNum - 1) * pageSize;

  return {
    limit,
    start,
    orderBy: sortField,
    orderDirection: sortDirection,
  };
}
