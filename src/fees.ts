import type { Id, IsoDate, Money, Page, PageQuery } from './common.js';
import type { PaymentProvider } from './orders.js';

/** `YYYY-MM`: the month a fee belongs to, in the store's time zone. */
export const FEE_PERIOD_PATTERN = /^\d{4}-(?:0[1-9]|1[0-2])$/;

/** Highest percentage the platform can charge a store. */
export const MAX_PLATFORM_FEE_PERCENT = 30;

export enum FeeEntryKind {
  /** The fee of an order that was paid. */
  Sale = 'sale',
  /** Gives back the fee of an order that was refunded. */
  Reversal = 'reversal',
}

/** How the platform gets the money of a fee. */
export enum FeeSettlement {
  /** Kept by the payment provider when the buyer paid; nothing to chase. */
  Retained = 'retained',
  /** The money went straight to the store: it is invoiced on the monthly statement. */
  Billable = 'billable',
}

export enum FeeStatementStatus {
  Open = 'open',
  Invoiced = 'invoiced',
  Paid = 'paid',
}

/** What the platform charges a store. Set by the platform, never by the store. */
export interface BillingPlan {
  /** Percent of each sale paid with a payment provider. */
  feePercent: number;
  /** Percent of each sale paid by bank transfer. */
  transferFeePercent: number;
  /** Fixed amount per month. */
  monthlyFee: Money;
  /** While set and in the future, the store is on its free trial. */
  trialEndsAt?: IsoDate;
}

export interface FeeEntry {
  id: Id;
  orderId: Id;
  orderNumber: number;
  kind: FeeEntryKind;
  provider: PaymentProvider;
  settlement: FeeSettlement;
  /** The order total the fee was computed on. */
  base: Money;
  /** Negative for a reversal. */
  amount: Money;
  /** What was computed at checkout; differs from `amount` if the provider reported another. */
  expected: Money;
  currency: string;
  period: string;
  occurredAt: IsoDate;
}

/** The fees of one month, from the entries so far. */
export interface FeeSummary {
  period: string;
  /** Already kept by the payment provider. */
  retained: Money;
  /** To be invoiced to the store. */
  billable: Money;
  monthlyFee: Money;
  /** `billable` plus `monthlyFee`: what the store owes for the month. */
  due: Money;
  entries: number;
}

export interface Billing {
  plan: BillingPlan;
  currency: string;
  /** The month in progress. */
  current: FeeSummary;
}

export interface FeeStatement extends Omit<FeeSummary, 'entries'> {
  id: Id;
  currency: string;
  status: FeeStatementStatus;
  generatedAt: IsoDate;
  invoicedAt?: IsoDate;
  paidAt?: IsoDate;
  /** The invoice number or payment reference the operator noted. */
  reference?: string;
}

export interface FeeEntriesQuery extends PageQuery {
  period?: string;
}

export type FeeEntryPage = Page<FeeEntry>;
export type FeeStatementPage = Page<FeeStatement>;
