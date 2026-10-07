import type { Id, IsoDate, Money } from './common.js';

export enum TenantStatus {
  Pending = 'pending',
  Active = 'active',
  Suspended = 'suspended',
}

export enum DomainStatus {
  /** Registered, waiting for the customer's DNS and TLS issuance. */
  Pending = 'pending',
  Active = 'active',
  Failed = 'failed',
}

export const THEME_RADII = ['none', 'sm', 'md', 'lg', 'full'] as const;
export type ThemeRadius = (typeof THEME_RADII)[number];

export const THEME_COLOR_TOKENS = [
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'accent',
  'accentForeground',
  'background',
  'foreground',
  'muted',
  'mutedForeground',
  'border',
] as const;
export type ThemeColorToken = (typeof THEME_COLOR_TOKENS)[number];

export type ThemeColors = Record<ThemeColorToken, string>;

export const MAX_DOMAINS = 10;

export interface Theme {
  colors: ThemeColors;
  radius: ThemeRadius;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface ShippingSettings {
  pickupEnabled: boolean;
  pickupInstructions?: string;
  deliveryEnabled: boolean;
  /** Flat price of a delivery. */
  deliveryFlatRate: Money;
  deliveryInstructions?: string;
}

export interface Seo {
  title?: string;
  description?: string;
}

/** What shoppers may know about a store. Nothing private belongs here. */
export interface StorefrontTenant {
  id: Id;
  slug: string;
  name: string;
  /** Canonical host: the primary custom domain, or the platform subdomain. */
  primaryHost: string;
  theme: Theme;
  /** ISO 4217. */
  currency: string;
  /** BCP 47. */
  locale: string;
  contactEmail?: string;
  contactPhone?: string;
  guestCheckoutEnabled: boolean;
  shipping: ShippingSettings;
  seo: Seo;
}

export interface Domain {
  hostname: string;
  isPrimary: boolean;
  status: DomainStatus;
  verifiedAt?: IsoDate;
}

export interface Tenant extends StorefrontTenant {
  timezone: string;
  platformHost: string;
  domains: Domain[];
  createdAt: IsoDate;
}

/** `null` clears an optional field. */
export interface UpdateTenantInput {
  name?: string;
  theme?: {
    colors?: Partial<ThemeColors>;
    radius?: ThemeRadius;
    logoUrl?: string | null;
    faviconUrl?: string | null;
  };
  settings?: {
    contactEmail?: string | null;
    contactPhone?: string | null;
    guestCheckoutEnabled?: boolean;
    shipping?: {
      pickupEnabled?: boolean;
      pickupInstructions?: string | null;
      deliveryEnabled?: boolean;
      deliveryFlatRate?: Money;
      deliveryInstructions?: string | null;
    };
  };
  seo?: { title?: string | null; description?: string | null };
}

export interface DnsInstruction {
  type: 'CNAME';
  /** What the store owner must point their hostname to. */
  target: string;
}

export interface DomainList {
  data: Domain[];
  /** The DNS record a store owner must create for a new domain. */
  dns: DnsInstruction;
}

export interface AddDomainInput {
  hostname: string;
  isPrimary?: boolean;
}
