import type { SessionTokens } from './auth.js';
import type { Id, IsoDate } from './common.js';

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
