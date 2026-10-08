import type { Id, Money } from './common.js';
import type { AppliedCoupon } from './coupons.js';

export const CART_LIMITS = { items: 100, quantity: 99 } as const;

export interface SetCartItemInput {
  productId: Id;
  /** The quantity wanted, not an increment. */
  quantity: number;
}

export interface CartLine {
  productId: Id;
  variantId: Id;
  /** Slug of the product page; absent if the product no longer exists. */
  slug?: string;
  name: string;
  variantLabel?: string;
  imageUrl?: string;
  quantity: number;
  /** The current price, not the one when it was added. */
  unitPrice: Money;
  lineTotal: Money;
  /** False when the product or variant can no longer be bought. */
  available: boolean;
  /** The most units that can be bought right now. */
  maxQuantity: number;
}

export interface Cart {
  lines: CartLine[];
  /** Units across all lines. */
  itemCount: number;
  /** Sum of the lines that can be bought. */
  subtotal: Money;
  /** The coupon in the cart, if any, with what it takes off. */
  coupon?: AppliedCoupon;
  /** What the coupon takes off the subtotal; 0 without one. */
  discount: Money;
  /** `subtotal` minus `discount`. Shipping and payment discounts come at checkout. */
  total: Money;
  currency: string;
  /** True when every line can be bought in the quantity asked. */
  purchasable: boolean;
}
