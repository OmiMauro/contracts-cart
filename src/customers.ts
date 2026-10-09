import type { SessionTokens } from './auth.js';
import type { Id, IsoDate, PageQuery } from './common.js';

export enum CustomerStatus {
  Active = 'active',
  Disabled = 'disabled',
}

export const MAX_ADDRESSES = 10;

export interface AddressInput {
  recipientName: string;
  street: string;
  streetNumber: string;
  /** Floor / apartment. */
  unit?: string;
  city: string;
  province: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2. Defaults to AR. */
  country?: string;
  phone?: string;
  notes?: string;
}

export interface Address extends Required<Pick<AddressInput, 'country'>>, Omit<AddressInput, 'country'> {
  id: Id;
}

export interface Customer {
  id: Id;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  marketingOptIn: boolean;
  addresses: Address[];
  createdAt: IsoDate;
}

/** A shopper as the store's staff sees them. */
export interface StaffCustomer extends Customer {
  status: CustomerStatus;
  lastLoginAt?: IsoDate;
}

export const CUSTOMER_SEARCH = { minLength: 2, maxLength: 80 } as const;

/** Staff only. */
export interface CustomersQuery extends PageQuery {
  /** Email (from the start) or name. */
  q?: string;
  status?: CustomerStatus;
}

/** Staff only: blocks or restores a shopper's account. Disabling ends their sessions. */
export interface UpdateCustomerStatusInput {
  status: CustomerStatus;
}

export interface RegisterCustomerInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  marketingOptIn?: boolean;
}

export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  marketingOptIn?: boolean;
}

export interface CustomerSignIn extends SessionTokens {
  customer: Customer;
}
