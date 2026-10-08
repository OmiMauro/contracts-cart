export const NEWSLETTER_LIMITS = {
  email: 254,
} as const;

export interface SubscribeToNewsletterInput {
  email: string;
}

/**
 * The same answer whether or not the email was already subscribed, so the
 * endpoint does not reveal who is on a store's list.
 */
export interface NewsletterSubscription {
  subscribed: true;
}
