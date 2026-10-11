import { SLUG_PATTERN, type IsoDate, type Money } from './common.js';

/**
 * The platform itself: what it sells and how a store signs up for it. These
 * routes are served on the platform's own host and belong to no store.
 */

export interface PlatformPlan {
  /** Fixed amount per month, in minor units. No commission on sales. */
  monthlyFee: Money;
  /** ISO 4217. */
  currency: string;
  /** Free days after a store is activated. */
  trialDays: number;
}

/**
 * The one plan the platform sells. The landing, the sign-up and billing all
 * read it from here, so the price that is advertised is the price charged.
 */
export const PLATFORM_PLAN: PlatformPlan = {
  monthlyFee: 1_499_000,
  currency: 'ARS',
  trialDays: 15,
};

/** A store's slug is also its subdomain: `{slug}.<platform domain>`. */
export const STORE_SLUG = { minLength: 3, maxLength: 40 } as const;

/**
 * Subdomains a store cannot take: the platform's own, the ones a visitor
 * would trust as the platform's, and infrastructure names.
 */
export const RESERVED_SLUGS: readonly string[] = [
  'www',
  'api',
  'admin',
  'app',
  'panel',
  'mail',
  'email',
  'smtp',
  'cdn',
  'media',
  'static',
  'assets',
  'status',
  'ayuda',
  'soporte',
  'help',
  'support',
  'blog',
  'docs',
  'demo',
  'staging',
  'test',
  'dev',
  'login',
  'ingresar',
  'cuenta',
  'pagos',
  'checkout',
  'seguridad',
  'security',
  'legal',
  'tienda',
  'tiendas',
  'plataforma',
];

export enum SlugUnavailableReason {
  /** Not a slug: wrong characters or length. */
  Invalid = 'invalid',
  Reserved = 'reserved',
  Taken = 'taken',
}

/**
 * Why `slug` can never be a store's, whoever asks; `null` if nothing rules it
 * out. Whether it is already taken is the API's to answer.
 */
export function slugProblem(slug: string): SlugUnavailableReason | null {
  if (slug.length < STORE_SLUG.minLength || slug.length > STORE_SLUG.maxLength || !SLUG_PATTERN.test(slug)) {
    return SlugUnavailableReason.Invalid;
  }
  return RESERVED_SLUGS.includes(slug) ? SlugUnavailableReason.Reserved : null;
}

export const STORE_SIGNUP = {
  storeName: { maxLength: 80 },
  ownerName: { maxLength: 80 },
  /** How long the link of the activation email works. An unconfirmed store is deleted after it. */
  activationTtlHours: 48,
  /** Stores one email can have waiting for confirmation at once. */
  maxPendingPerEmail: 3,
  /** The version of the terms a sign-up accepts. */
  termsVersion: '2026-10',
} as const;

/** Where a sign-up came from. Captured on the first visit; every value is free text from a URL. */
export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'landing',
  'referrer',
] as const;
export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type SignupAttribution = Partial<Record<AttributionKey, string>>;
export const ATTRIBUTION_VALUE_MAX_LENGTH = 300;

export interface SlugAvailabilityQuery {
  slug: string;
}

export interface SlugAvailability {
  slug: string;
  available: boolean;
  reason?: SlugUnavailableReason;
}

/** Opens a store. It serves nothing until the email is confirmed. */
export interface CreateTenantInput {
  storeName: string;
  slug: string;
  ownerName: string;
  email: string;
  password: string;
  /** Must be `true`: the owner accepts the terms and the privacy policy. */
  acceptTerms: boolean;
  /** Proof that a person filled the form, from the human-verification widget. */
  captchaToken?: string;
  attribution?: SignupAttribution;
}

/**
 * A store waiting for its owner to confirm the email. The link works for
 * `STORE_SIGNUP.activationTtlHours`.
 */
export interface PendingTenant {
  slug: string;
  /** The host the store will be served on once confirmed. */
  host: string;
}

export interface ActivateTenantInput {
  /** From the link of the activation email. Works once. */
  token: string;
}

export interface TenantActivation {
  slug: string;
  host: string;
  /** Where the owner signs in. */
  adminUrl: string;
  trialEndsAt: IsoDate;
}

export interface ResendActivationInput {
  email: string;
}
