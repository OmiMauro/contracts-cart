import type { Id, IsoDate, Money } from './common.js';
import type { ShippingMethod } from './orders.js';

// Shipping with carriers, rate tables and per-store rules. See ADR 0018.
// Weights are whole grams and sizes whole millimetres, like money is whole centavos.

export enum ShippingCarrier {
  /** The store's own price list, by province and weight. Needs no contract. */
  RateTable = 'rate_table',
  CorreoArgentino = 'correo_argentino',
  Andreani = 'andreani',
}

export enum ShipmentStatus {
  LabelCreated = 'label_created',
  InTransit = 'in_transit',
  ReadyForPickup = 'ready_for_pickup',
  Delivered = 'delivered',
  Exception = 'exception',
  Returned = 'returned',
}

/** How a product may be sent. */
export enum ProductShippingMode {
  Standard = 'standard',
  /** Too big or too fragile for a carrier: agreed with the seller afterwards. */
  ArrangedOnly = 'arranged_only',
  /** Only collected at the store. */
  PickupOnly = 'pickup_only',
}

export enum ShippingRuleEffect {
  /** The buyer pays nothing. */
  Free = 'free',
  /** The buyer pays `amount`, whatever the carrier charges. */
  FlatPrice = 'flat_price',
  /** `percent` is taken off what the buyer would pay. */
  PercentOff = 'percent_off',
  /** The buyer pays at most `amount`; the store absorbs the rest. */
  Cap = 'cap',
}

export const SHIPPING_LIMITS = {
  boxes: 10,
  rules: 20,
  rateTables: 5,
  rateRows: 100,
  /** Packages in one quote. */
  packages: 20,
  /** Options a quote offers. */
  options: 12,
  /** Tracking events kept on an order. */
  events: 50,
  handlingDays: 30,
  ruleName: 80,
  boxName: 60,
  /** Provinces one rule or rate row can list. */
  provinces: 24,
} as const;

/** Length × width × height ÷ divisor = volumetric kilos, when the carrier does not say. */
export const DEFAULT_VOLUMETRIC_DIVISOR = 6000;
export const VOLUMETRIC_DIVISOR_RANGE = { min: 1000, max: 20000 } as const;

/** How long a quote can be used to place an order. */
export const SHIPPING_QUOTE_TTL_MINUTES = 30;

// --- provinces

export interface Province {
  /** ISO 3166-2:AR, e.g. `AR-B`. */
  code: string;
  name: string;
}

export const AR_PROVINCES: readonly Province[] = [
  { code: 'AR-C', name: 'Ciudad Autónoma de Buenos Aires' },
  { code: 'AR-B', name: 'Buenos Aires' },
  { code: 'AR-K', name: 'Catamarca' },
  { code: 'AR-H', name: 'Chaco' },
  { code: 'AR-U', name: 'Chubut' },
  { code: 'AR-X', name: 'Córdoba' },
  { code: 'AR-W', name: 'Corrientes' },
  { code: 'AR-E', name: 'Entre Ríos' },
  { code: 'AR-P', name: 'Formosa' },
  { code: 'AR-Y', name: 'Jujuy' },
  { code: 'AR-L', name: 'La Pampa' },
  { code: 'AR-F', name: 'La Rioja' },
  { code: 'AR-M', name: 'Mendoza' },
  { code: 'AR-N', name: 'Misiones' },
  { code: 'AR-Q', name: 'Neuquén' },
  { code: 'AR-R', name: 'Río Negro' },
  { code: 'AR-A', name: 'Salta' },
  { code: 'AR-J', name: 'San Juan' },
  { code: 'AR-D', name: 'San Luis' },
  { code: 'AR-Z', name: 'Santa Cruz' },
  { code: 'AR-S', name: 'Santa Fe' },
  { code: 'AR-G', name: 'Santiago del Estero' },
  { code: 'AR-V', name: 'Tierra del Fuego' },
  { code: 'AR-T', name: 'Tucumán' },
];

export const PROVINCE_CODES: readonly string[] = AR_PROVINCES.map((province) => province.code);

// --- what a product says about its shipping

/** Per product. The weight and size of each unit live on its variants. */
export interface ProductShipping {
  /** Travels in a box of its own, one per unit (bicycles, frames). */
  shipsAlone: boolean;
  /**
   * What the seller pays of the shipping for each unit sold, taken off the
   * buyer's shipping price. Never more than the carrier charges.
   */
  subsidyPerUnit: Money;
  mode: ProductShippingMode;
}

export interface ProductShippingInput {
  shipsAlone?: boolean;
  subsidyPerUnit?: Money;
  mode?: ProductShippingMode;
}

// --- store settings

/** A box the store packs with. Inner size, so the items must fit inside. */
export interface ShippingBox {
  name: string;
  innerLengthMm: number;
  innerWidthMm: number;
  innerHeightMm: number;
  /** What the empty box weighs. */
  tareGrams: number;
  /** The most it may weigh once packed, tare included. */
  maxWeightGrams: number;
}

/** When a rule applies. Every condition that is present has to hold. */
export interface ShippingRuleCondition {
  /** Cart subtotal, before discounts. */
  minSubtotal?: Money;
  /** The whole order, packed. */
  maxWeightGrams?: number;
  provinces?: string[];
  carriers?: ShippingCarrier[];
}

export interface ShippingRuleAction {
  effect: ShippingRuleEffect;
  /** Money for `flat_price` and `cap`. */
  amount?: Money;
  /** A whole percent, 1 to 100, for `percent_off`. */
  percent?: number;
}

/** One rule of a store. The one with the lowest `priority` is applied first. */
export interface ShippingRule {
  id: Id;
  name: string;
  active: boolean;
  priority: number;
  when: ShippingRuleCondition;
  action: ShippingRuleAction;
}

export interface ShippingRuleInput {
  /** Keep an existing rule; omit it for a new one. */
  id?: Id;
  name: string;
  active?: boolean;
  priority?: number;
  when?: ShippingRuleCondition;
  action: ShippingRuleAction;
}

// --- the store's own rate tables

export interface RateRow {
  /** Empty: every province. */
  provinces: string[];
  /** This row covers packages up to this billable weight. */
  maxWeightGrams: number;
  price: Money;
  /** Delivery time, in business days, as the store promises it. */
  etaDays?: { min: number; max: number };
}

export interface RateTable {
  id: Id;
  name: string;
  /** Which carrier these prices were copied from, if any. Only a label. */
  carrierLabel?: string;
  active: boolean;
  /** Overrides the store's divisor for this table. */
  volumetricDivisor?: number;
  rows: RateRow[];
  createdAt: IsoDate;
  updatedAt: IsoDate;
}

export interface RateRowInput {
  provinces?: string[];
  maxWeightGrams: number;
  price: Money;
  etaDays?: { min: number; max: number };
}

export interface RateTableInput {
  name: string;
  carrierLabel?: string | null;
  active?: boolean;
  volumetricDivisor?: number | null;
  rows: RateRowInput[];
}

// --- what the buyer was offered, frozen with the order

export interface ShippingPackage {
  weightGrams: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  /** The weight billed: the larger of the real and the volumetric one. */
  billableGrams: number;
}

export interface ShippingBranch {
  id: string;
  name: string;
  address?: string;
}

/** The shipping choice of an order, as its buyer saw it. */
export interface StorefrontOrderShipping {
  /** `null` for pickup and for a delivery agreed with the seller. */
  carrier: ShippingCarrier | null;
  service?: string;
  branch?: ShippingBranch;
  /** What the buyer paid. Equals `totals.shipping`. */
  price: Money;
  etaDays?: { min: number; max: number };
}

/** The same choice as staff sees it, with what it costs the store. */
export interface OrderShipping extends StorefrontOrderShipping {
  packages: ShippingPackage[];
  /** What the carrier (or the rate table) charges the store. Never shown to buyers. */
  carrierCost: Money;
  /** What the products gave towards it. */
  subsidy: Money;
  /** What the store's rules took off. Negative when a flat price charged more than the carrier. */
  ruleDiscount: Money;
  /** Rules that changed the price. */
  appliedRuleIds: Id[];
  quoteId: Id;
}

export interface ShipmentEvent {
  at: IsoDate;
  status: ShipmentStatus;
  description: string;
  location?: string;
}

// --- quotes

export interface ShippingQuoteItemInput {
  productId: Id;
  variantId: Id;
  quantity: number;
}

export interface ShippingQuoteInput {
  postalCode: string;
  /** ISO 3166-2:AR, e.g. `AR-B`. */
  province: string;
  /**
   * Quote these instead of the cart, for the shipping calculator of a
   * product page. Nothing is saved, so the result has no `id`.
   */
  items?: ShippingQuoteItemInput[];
}

/** One way to get the order, as the buyer sees it. */
export interface ShippingOption {
  /** What checkout is told to pick it; unique within the quote. */
  id: string;
  method: ShippingMethod;
  /** `null` for pickup, the store's flat rate and a delivery agreed afterwards. */
  carrier: ShippingCarrier | null;
  /** What to call it: the name of the rate table, of the service. */
  service?: string;
  branch?: ShippingBranch;
  /** What the buyer pays. */
  price: Money;
  etaDays?: { min: number; max: number };
  /** Earliest and latest arrival if the order is placed now. Absent when the time is not known. */
  estimatedDelivery?: { from: IsoDate; to: IsoDate };
}

export interface ShippingQuote {
  /** Absent when the quote was asked for `items` and nothing was saved. */
  id?: Id;
  destination: { postalCode: string; province: string };
  /** Cheapest first. Empty when the store cannot send there. */
  options: ShippingOption[];
  /** After this the cart must be quoted again. */
  expiresAt?: IsoDate;
}
