export type PersonOrderByField = keyof Person | `address.${keyof Address}`;
export function isPersonOrderByField(orderBy: string): orderBy is PersonOrderByField {
  if (
    orderBy === 'address' ||
    orderBy === 'company_name' ||
    orderBy === 'email' ||
    orderBy === 'first_name' ||
    orderBy === 'id' ||
    orderBy === 'last_name' ||
    orderBy === 'name' ||
    orderBy === 'phone'
  ) {
    return true;
  }

  if (
    orderBy === 'address.address_line_1' ||
    orderBy === 'address.address_line_2' ||
    orderBy === 'address.city' ||
    orderBy === 'address.coordinates' ||
    orderBy === 'address.country' ||
    orderBy === 'address.country' ||
    orderBy === 'address.post_code'
  ) {
    return true;
  }

  return false;
}

export type Person = {
  address: Address;
  company_name: null | string;
  email: string;
  first_name: string;
  id: PersonId;
  last_name: string;
  name: string;
  phone: string;
};

export type Address = {
  address_line_1: string;
  address_line_2: null | string;
  city: string;
  coordinates: Coordinates;
  country: string;
  post_code: string;
};

export type PersonId = `person:${string}`;
export type Coordinates = [number, number];
