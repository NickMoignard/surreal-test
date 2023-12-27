export class DatabaseError extends Error {}
export class InvalidOrderDirectionError extends DatabaseError {
  constructor(readonly detail?: unknown) {
    super('Order direction must be either ASC or DESC');
  }
}

export class InvalidOrderByPropertyError extends DatabaseError {
  constructor(readonly detail?: unknown) {
    super('Order by must be a valid property of the model');
  }
}
