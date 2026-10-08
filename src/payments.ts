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

/** Highest discount a store can give for a payment method, in percent. */
export const MAX_PAYMENT_DISCOUNT_PERCENT = 50;

export const BANK_TRANSFER_DEADLINE_HOURS = { min: 1, max: 168, default: 48 } as const;

/** A CBU is 22 digits. */
export const CBU_PATTERN = /^\d{22}$/;
/** A CBU alias: 6 to 20 letters, digits, dots and dashes. */
export const ALIAS_PATTERN = /^[A-Za-z0-9.-]{6,20}$/;

/** The bank account a store receives transfers in. */
export interface BankTransferAccount {
  holderName?: string;
  bankName?: string;
  cbu?: string;
  alias?: string;
  /** CUIT or CUIL of the holder. */
  taxId?: string;
  /** Anything the buyer must know, e.g. "Send the receipt by WhatsApp". */
  instructions?: string;
}

/** Where to transfer, as shown to a buyer: a holder and a CBU or an alias at least. */
export interface BankTransferDetails extends BankTransferAccount {
  holderName: string;
}

export interface BankTransferSettings extends BankTransferAccount {
  enabled: boolean;
  /** Percent off the subtotal for paying this way. */
  discountPercent: number;
  /** Time the buyer has to transfer before the order is cancelled. */
  deadlineHours: number;
}

export interface MercadoPagoSettings {
  /** Percent off the subtotal for paying this way. */
  discountPercent: number;
}

/** How a store takes payments, besides which accounts it has connected. */
export interface PaymentSettings {
  mercadopago: MercadoPagoSettings;
  bankTransfer: BankTransferSettings;
}

/** A way of paying the store offers right now. */
export interface PaymentMethodInfo {
  provider: PaymentProvider;
  /** Percent off the subtotal; 0 when there is none. */
  discountPercent: number;
  /** Only for bank transfers: hours the buyer has to transfer. */
  deadlineHours?: number;
}

/** What a shopper may know about a store's payments. */
export interface StorefrontPayments {
  /** Whether the store can take payments at all. */
  enabled: boolean;
  methods: PaymentMethodInfo[];
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
