import type { Id, IsoDate, Money, Page, PageQuery } from './common.js';

/** 3 to 30 uppercase letters, digits, dashes or underscores. Stored uppercase. */
export const COUPON_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,29}$/;

/** A coupon never takes more than this share of the subtotal, whatever its type. */
export const MAX_COUPON_PERCENT = 90;

export enum CouponType {
  /** `value` is a percent of the subtotal. */
  Percent = 'percent',
  /** `value` is an amount in minor units. */
  Fixed = 'fixed',
}

/** Why a coupon gives no discount right now. */
export enum CouponIssue {
  Inactive = 'inactive',
  NotStarted = 'not_started',
  Expired = 'expired',
  UsedUp = 'used_up',
  /** The cart is below the minimum purchase. */
  MinSubtotal = 'min_subtotal',
  /** The code in the cart no longer exists. */
  Unknown = 'unknown',
}

export interface Coupon {
  id: Id;
  code: string;
  type: CouponType;
  /** A whole percent (1 to 90) or an amount in minor units, by `type`. */
  value: number;
  /** Smallest subtotal the coupon applies to. */
  minSubtotal?: Money;
  startsAt?: IsoDate;
  endsAt?: IsoDate;
  /** Orders that may use it, in all. Absent: no limit. */
  maxUses?: number;
  usedCount: number;
  active: boolean;
  createdAt: IsoDate;
}

export interface CouponInput {
  code: string;
  type: CouponType;
  value: number;
  minSubtotal?: Money;
  startsAt?: IsoDate;
  endsAt?: IsoDate;
  maxUses?: number;
  active?: boolean;
}

/** The code and type are fixed once created. `null` clears an optional field. */
export interface UpdateCouponInput {
  value?: number;
  minSubtotal?: Money | null;
  startsAt?: IsoDate | null;
  endsAt?: IsoDate | null;
  maxUses?: number | null;
  active?: boolean;
}

export type CouponPage = Page<Coupon>;
export type CouponsQuery = PageQuery;

export interface SetCartCouponInput {
  code: string;
}

/** The coupon in a shopper's cart, and what it does to the subtotal. */
export interface AppliedCoupon {
  code: string;
  /** Taken off the subtotal. Zero when the coupon does not apply (see `issue`). */
  discount: Money;
  /** Why it gives nothing right now. Absent when it applies. */
  issue?: CouponIssue;
  /** For `min_subtotal`: what the cart has to reach. */
  minSubtotal?: Money;
}
