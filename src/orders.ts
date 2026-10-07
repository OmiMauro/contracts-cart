import type { Id, IsoDate, Money, PageQuery } from './common.js';
import type { Address, AddressInput } from './customers.js';

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
  unitPrice: Money;
  quantity: number;
  total: Money;
}

export interface OrderTotals {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  /** subtotal - discount + shipping: the amount charged. */
  total: Money;
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
}

export interface OrderPaymentDetails extends OrderPayment {
  /** Id of the payment at the provider. */
  externalId?: string;
  /** Commission kept by the platform. */
  platformFee: Money;
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
  payment: OrderPayment;
  shippingMethod: ShippingMethod;
  shippingAddress?: Address;
  customerNote?: string;
  /** Whether the buyer can still be sent to pay. */
  awaitingPayment: boolean;
  createdAt: IsoDate;
}

/** An order as staff sees it. */
export interface Order extends StorefrontOrder {
  customerId?: Id;
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
  createdAt: IsoDate;
}

export interface OrderStats {
  /** Orders paid and waiting to be prepared. */
  toPrepare: number;
  awaitingPayment: number;
}

export interface OrdersQuery extends PageQuery {
  status?: OrderStatus;
}

export interface ChangeOrderStatusInput {
  status: ManualOrderStatus;
  note?: string;
}

// --- checkout

export interface CheckoutInput {
  contact: OrderContact;
  shippingMethod: ShippingMethod;
  /** Required for deliveries. */
  shippingAddress?: AddressInput;
  customerNote?: string;
  /**
   * The total the buyer was shown. If prices changed since, the order is
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
