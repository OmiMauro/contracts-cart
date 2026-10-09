import type { Id, IsoDate, PageQuery } from './common.js';

export const NEWSLETTER_LIMITS = {
  email: 254,
  source: 40,
} as const;

/** Where a subscription came from. Free text for imports; the storefront form says `storefront`. */
export const NEWSLETTER_STOREFRONT_SOURCE = 'storefront';

export interface SubscribeToNewsletterInput {
  email: string;
}

/** Staff only. */
export interface NewsletterSubscriber {
  id: Id;
  email: string;
  source: string;
  /** When the person gave their email (the form's consent). */
  consentedAt: IsoDate;
  createdAt: IsoDate;
}

export type NewsletterSubscribersQuery = PageQuery;

/**
 * Leaves the list without an account: the token is derived from the email
 * and the store, and travels in the unsubscribe link of every mailing.
 */
export interface UnsubscribeInput {
  email: string;
  token: string;
}

/**
 * The same answer whether or not the email was already subscribed, so the
 * endpoint does not reveal who is on a store's list.
 */
export interface NewsletterSubscription {
  subscribed: true;
}
