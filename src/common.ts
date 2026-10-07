/** An amount in the minor unit of the store's currency (centavos). Never a float. */
export type Money = number;

/** A MongoDB ObjectId as 24 hexadecimal characters. */
export type Id = string;

/** ISO 8601 date-time, as JSON carries dates. */
export type IsoDate = string;

export const ID_PATTERN = /^[0-9a-f]{24}$/;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
export const HOSTNAME_PATTERN =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export const PAGINATION = {
  defaultLimit: 24,
  maxLimit: 100,
} as const;

export interface PageQuery {
  /** Opaque cursor from a previous page. */
  cursor?: string;
  limit?: number;
}

export interface Pagination {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface Page<T> {
  data: T[];
  pagination: Pagination;
}

/** A collection that is never paginated. */
export interface List<T> {
  data: T[];
}

/**
 * Why a field was rejected. `required` when it was missing or empty; otherwise
 * the name of the rule it broke (`isEmail`, `maxLength`, `matches`, `isInt`,
 * `min`, `max`, `isEnum`, `whitelistValidation` for an unknown field…).
 * Clients show their own text per rule; `message` is for developers.
 */
export type FieldRule = 'required' | (string & {});

export interface FieldError {
  /** Dotted path, e.g. `contact.email` or `variants.0.price`. */
  field: string;
  rule: FieldRule;
  message: string;
}

/** Error body: RFC 9457 `application/problem+json`, plus a stable `code`. */
export interface Problem {
  type: string;
  title: string;
  status: number;
  /** Stable identifier for clients to act on; the texts may change. */
  code: string;
  detail: string;
  requestId?: string;
  errors?: FieldError[];
  [extra: string]: unknown;
}

/** Headers of the contract between the storefront server and the API. */
export const HEADERS = {
  /** Proves a request comes from the storefront server. */
  internalToken: 'x-internal-token',
  /** The store a request is for. */
  tenantHost: 'x-tenant-host',
  /** Correlates logs of one request across both services. */
  requestId: 'x-request-id',
  /** The shopper's cart. */
  cartToken: 'x-cart-token',
  /** Lets a buyer without an account read one order. */
  orderToken: 'x-order-token',
  /** Makes a checkout safe to retry. */
  idempotencyKey: 'idempotency-key',
} as const;
