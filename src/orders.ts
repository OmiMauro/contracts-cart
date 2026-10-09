import type { Id, IsoDate, Money, PageQuery } from './common.js';
import type { Address, AddressInput } from './customers.js';
import type { BankTransferDetails } from './payments.js';
import type {
  OrderShipping,
  ShipmentEvent,
  ShipmentStatus,
  StorefrontOrderShipping,
} from './shipping.js';

export enum OrderStatus {
  PendingPayment = 'pending_payment',
  Paid = 'paid',
  Preparing = 'preparing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
  Refunded = 'refunded',
}

export enum PaymentProvider {
  MercadoPago = 'mercadopago',
  /** The buyer transfers to the store's bank account; staff confirm it by hand. */
  BankTransfer = 'bank_transfer',
  /** Simulated provider for local development; never enabled in production. */
  Fake = 'fake',
}

/** Provider-agnostic payment state; each provider maps its own onto this. */
export enum PaymentStatus {
  Pending = 'pending',
  InProcess = 'in_process',
  Approved = 'approved',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
  Refunded = 'refunded',
  ChargedBack = 'charged_back',
}

export enum ShippingMethod {
  /** The buyer collects the order at the store. */
  Pickup = 'pickup',
  Delivery = 'delivery',
  /** The buyer collects the order at a branch of the carrier. */
  BranchPickup = 'branch_pickup',
  /** The seller and the buyer agree how it gets there, after the sale. */
  Arranged = 'arranged',
}

export enum OrderActor {
  System = 'system',
  User = 'user',
  Customer = 'customer',
}

/** The states staff can move an order to by hand. */
export const MANUAL_ORDER_STATUSES = [
  OrderStatus.Preparing,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
] as const;
export type ManualOrderStatus = (typeof MANUAL_ORDER_STATUSES)[number];

/** What staff may do next from each state. Anything else is refused. */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PendingPayment]: [OrderStatus.Cancelled],
  [OrderStatus.Paid]: [OrderStatus.Preparing, OrderStatus.Cancelled],
  [OrderStatus.Preparing]: [OrderStatus.Shipped, OrderStatus.Cancelled],
  [OrderStatus.Shipped]: [OrderStatus.Delivered],
  [OrderStatus.Delivered]: [],
  [OrderStatus.Cancelled]: [],
  [OrderStatus.Refunded]: [],
};

export interface OrderItem {
  productId: Id;
  variantId: Id;
  sku: string;
  name: string;
  variantLabel?: string;
  imageUrl?: string;
  /** The price of one unit, with the price tier of the quantity bought already applied. */
  unitPrice: Money;
  quantity: number;
  /** The price tier `unitPrice` came from, if any. */
  tierMinQuantity?: number;
  total: Money;
}

export interface OrderTotals {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  /** subtotal - discount + shipping: the amount charged. */
  total: Money;
}

export enum OrderDiscountKind {
  /** The percentage the store gives for paying with a given method. */
  PaymentMethod = 'payment_method',
  Coupon = 'coupon',
}

/** A reduction of the subtotal, frozen with the order. */
export interface OrderDiscount {
  kind: OrderDiscountKind;
  /** What the buyer saw, e.g. "Pagando por transferencia (10 %)". */
  label: string;
  amount: Money;
}

export interface OrderContact {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface OrderPayment {
  provider: PaymentProvider;
  status: PaymentStatus;
  method?: string;
  paidAt?: IsoDate;
  /** After this an unpaid order is cancelled and its stock released. */
  expiresAt?: IsoDate;
  /** Where to transfer, for `bank_transfer`: the data shown when the order was placed. */
  transfer?: BankTransferDetails;
  /** When the buyer said they had transferred. */
  reportedAt?: IsoDate;
}

export interface OrderPaymentDetails extends OrderPayment {
  /** Id of the payment at the provider. */
  externalId?: string;
  /** Commission kept by the platform. */
  platformFee: Money;
  /** The operation number the buyer gave when reporting a transfer. */
  reference?: string;
  /** Why staff rejected a reported transfer. */
  reviewNote?: string;
  /** Set until staff dismiss it. */
  alert?: PaymentAlert;
}

/** Where a shipped order is, as the store tells the buyer. */
export interface ShipmentInput {
  carrier?: string;
  trackingCode?: string;
  /** Where the buyer follows the parcel. */
  trackingUrl?: string;
}

export interface Shipment extends ShipmentInput {
  shippedAt?: IsoDate;
  /** Set when the carrier knows the parcel. */
  status?: ShipmentStatus;
  /** Newest last. */
  events?: ShipmentEvent[];
}

export enum PaymentAlertCode {
  /** Money arrived for an order that had already been cancelled. */
  PaidAfterCancel = 'paid_after_cancel',
  /** A payment for this order came with a different amount: it was not applied. */
  AmountMismatch = 'amount_mismatch',
}

/** Something about the payment of an order that a person has to look at. */
export interface PaymentAlert {
  code: PaymentAlertCode;
  at: IsoDate;
  /** The payment involved, and for a mismatch the amount that arrived. */
  detail?: string;
}

export interface OrderStatusChange {
  status: OrderStatus;
  at: IsoDate;
  actorType: OrderActor;
  note?: string;
}

/** An order as its buyer sees it. */
export interface StorefrontOrder {
  id: Id;
  number: number;
  status: OrderStatus;
  currency: string;
  contact: OrderContact;
  items: OrderItem[];
  totals: OrderTotals;
  /** What was taken off the subtotal; the amounts add up to `totals.discount`. */
  discounts: OrderDiscount[];
  payment: OrderPayment;
  shippingMethod: ShippingMethod;
  shippingAddress?: Address;
  /** What the buyer chose and paid. Absent on orders placed before quotes existed. */
  shipping?: StorefrontOrderShipping;
  /** Present once the order has been shipped with tracking information. */
  shipment?: Shipment;
  customerNote?: string;
  /** Whether the buyer can still be sent to pay. */
  awaitingPayment: boolean;
  createdAt: IsoDate;
}

/** An order as staff sees it. */
export interface Order extends StorefrontOrder {
  customerId?: Id;
  shipping?: OrderShipping;
  payment: OrderPaymentDetails;
  statusHistory: OrderStatusChange[];
  /** The states this order can be moved to by hand. */
  nextStatuses: OrderStatus[];
  updatedAt: IsoDate;
}

export interface OrderSummary {
  id: Id;
  number: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethod;
  total: Money;
  currency: string;
  /** Units across all items. */
  itemCount: number;
  contactName: string;
  contactEmail: string;
  /** The payment has an alert nobody has dismissed. */
  needsAttention: boolean;
  createdAt: IsoDate;
}

export interface OrderStats {
  /** Orders paid and waiting to be prepared. */
  toPrepare: number;
  awaitingPayment: number;
  /** Bank transfers the buyer reported and staff have not confirmed yet. */
  transfersToReview: number;
  /** Orders whose payment has an alert nobody has dismissed. */
  needsAttention: number;
}

export const ORDER_SEARCH = { minLength: 2, maxLength: 80 } as const;

export interface OrdersQuery extends PageQuery {
  status?: OrderStatus;
  /** Staff only: an order number, a buyer's email, or the start of their name. */
  q?: string;
  /** Staff only: the orders of one registered shopper. */
  customerId?: Id;
  /** Staff only: just the orders whose payment needs a look. */
  attention?: boolean;
  /** Staff only: by how the order is paid and the state of that payment. */
  paymentProvider?: PaymentProvider;
  paymentStatus?: PaymentStatus;
}

/**
 * Staff move an order to any of the manual states. A buyer (signed in, or
 * holding the order's token) may only cancel it, and only while it waits for payment.
 */
export interface ChangeOrderStatusInput {
  status: ManualOrderStatus;
  note?: string;
  /** Only when shipping. */
  shipment?: ShipmentInput;
}

/** Gives the money back and closes the order as refunded. In full. */
export interface RefundInput {
  /** Put the units back on sale. Leave out for goods that already left. */
  restock?: boolean;
  note?: string;
}

// --- checkout

export interface CheckoutInput {
  contact: OrderContact;
  /**
   * The quote of the cart (`POST /v1/shipping-quotes`) and the option the buyer
   * picked from it. The price and the method come from the option, never from
   * the client. Send both or neither.
   */
  shippingQuoteId?: Id;
  shippingOptionId?: string;
  /**
   * Without a quote, `pickup` or `delivery` at the store's flat rate. With a
   * quote it is optional, and if given it must be the option's.
   */
  shippingMethod?: ShippingMethod;
  /** Required for deliveries and for a delivery agreed afterwards, and it must be the quoted destination. */
  shippingAddress?: AddressInput;
  customerNote?: string;
  /**
   * How the buyer pays. Optional when the store offers a single method;
   * otherwise one of `GET /v1/payments`.
   */
  paymentProvider?: PaymentProvider;
  /**
   * The total the buyer was shown, with the coupon of their cart and the
   * discount of the payment method taken off. If prices changed since, the order is
   * not placed and the new total is returned instead (`PRICE_CHANGED`).
   */
  expectedTotal: Money;
}

export interface CheckoutResult {
  order: StorefrontOrder;
  /** Lets the buyer follow the order without an account. */
  accessToken: string;
  /**
   * Where to send the buyer to pay. `null` if the provider could not be
   * reached: the order exists and payment can be retried.
   */
  paymentUrl: string | null;
}

export interface PaymentUrl {
  paymentUrl: string;
}

// --- bank transfer

/** The buyer says they transferred. */
export interface ReportTransferInput {
  /** The operation number of the transfer, to help the store find it. */
  reference?: string;
}

export type TransferDecision = 'approve' | 'reject';

/** Staff look for the money and answer. */
export interface ReviewTransferInput {
  decision: TransferDecision;
  /** Shown to the buyer when rejecting. */
  note?: string;
}
