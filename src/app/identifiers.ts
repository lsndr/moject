export type Identifiers = {
  readonly LOGGER: symbol;
  readonly MODULE_REF: symbol;
};

export const IDENTIFIERS: Identifiers = {
  LOGGER: Symbol.for('LOGGER'),
  MODULE_REF: Symbol.for('MODULE_REF'),
};
