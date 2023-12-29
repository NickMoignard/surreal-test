import { OrderDirection } from '../database/types';

export type FindParams<T extends Record<string, unknown>> = {
  sortField: keyof T;
  sortDirection: OrderDirection;
  pageSize: string;
  pageNum: string;
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
  const pageNumInt = parseInt(pageNum);
  const pageSizeInt = parseInt(pageSize);

  if (typeof pageNumInt !== 'number' && typeof pageSizeInt !== 'number') {
    throw new Error('Invalid pageNum or pageSize: BAD_REQUEST');
  }

  const limit = pageSizeInt;
  const start = (pageNumInt - 1) * pageSizeInt;

  return {
    limit,
    start,
    orderBy: sortField,
    orderDirection: sortDirection,
  };
}
