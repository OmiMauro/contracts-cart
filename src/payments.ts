import type { IsoDate, Money } from './common.js';
import type { PaymentProvider } from './orders.js';

export enum PaymentAccountStatus {
  Connected = 'connected',
  /** The refresh token stopped working; the store must reconnect. */
  Expired = 'expired',
  Revoked = 'revoked',
}

export interface PaymentProviderInfo {
  provider: PaymentProvider;
  /** Whether the store can charge with this provider right now. */
  connected: boolean;
  status?: PaymentAccountStatus;
  /** False while connected with sandbox credentials. */
  liveMode?: boolean;
  connectedAt?: IsoDate;
}

export interface AuthorizationUrl {
  /** Send the store owner here to authorise the platform. */
  authorizationUrl: string;
}

/** What a shopper may know about a store's payments. */
export interface StorefrontPayments {
  enabled: boolean;
}

export type FakePaymentOutcome = 'approved' | 'rejected';

export interface FakePayment {
  storeName: string;
  orderNumber: number;
  total: Money;
  currency: string;
}

export interface ResolveFakePaymentInput {
  outcome: FakePaymentOutcome;
}

export interface FakePaymentResult {
  /** Where to send the buyer back to. */
  returnUrl: string;
}
