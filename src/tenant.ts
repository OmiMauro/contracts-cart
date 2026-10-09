import type { Id, IsoDate, Money } from './common.js';
import type { HomeBlock } from './home.js';
import type { PaymentSettings } from './payments.js';
import type { ShippingBox, ShippingRule, ShippingRuleInput } from './shipping.js';

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

/**
 * Storefront templates. A template is a complete look the store picks:
 * typography, layout of the header, home and product cards, and a starting
 * palette. The store then adjusts its colors, logo and radius on top of it.
 */
export const STOREFRONT_TEMPLATES = ['editorial', 'suave', 'audaz', 'oscura'] as const;
export type StorefrontTemplate = (typeof STOREFRONT_TEMPLATES)[number];

export const DEFAULT_STOREFRONT_TEMPLATE: StorefrontTemplate = 'suave';

export interface StorefrontTemplatePreset {
  name: string;
  /** One line for the picker in the panel. */
  description: string;
  colors: ThemeColors;
  radius: ThemeRadius;
}

/**
 * Starting palette and radius of each template. The panel applies the preset
 * when a store picks a template; the store can change any value afterwards.
 */
export const STOREFRONT_TEMPLATE_PRESETS: Record<StorefrontTemplate, StorefrontTemplatePreset> = {
  editorial: {
    name: 'Editorial',
    description: 'Serif, mucho aire y fotos verticales. Para marcas con historia.',
    colors: {
      primary: '#151515',
      primaryForeground: '#ffffff',
      secondary: '#f5f5f4',
      secondaryForeground: '#151515',
      accent: '#0f766e',
      accentForeground: '#ffffff',
      background: '#ffffff',
      foreground: '#151515',
      muted: '#f5f5f4',
      mutedForeground: '#57534e',
      border: '#e7e5e4',
    },
    radius: 'none',
  },
  suave: {
    name: 'Suave',
    description: 'Redondeada, cálida y liviana. Para vender sin fricción.',
    colors: {
      primary: '#0f766e',
      primaryForeground: '#ffffff',
      secondary: '#e7eeec',
      secondaryForeground: '#1c1917',
      accent: '#1c1917',
      accentForeground: '#ffffff',
      background: '#f4f6f5',
      foreground: '#1c1917',
      muted: '#e9edeb',
      mutedForeground: '#57534e',
      border: '#dde3e0',
    },
    radius: 'full',
  },
  audaz: {
    name: 'Audaz',
    description: 'Mayúsculas, reglas negras y tipografía grande. Para marcas con actitud.',
    colors: {
      primary: '#be123c',
      primaryForeground: '#ffffff',
      secondary: '#0a0a0a',
      secondaryForeground: '#f5f5f0',
      accent: '#0a0a0a',
      accentForeground: '#f5f5f0',
      background: '#f5f5f0',
      foreground: '#0a0a0a',
      muted: '#ebebe4',
      mutedForeground: '#3f3f3a',
      border: '#0a0a0a',
    },
    radius: 'none',
  },
  oscura: {
    name: 'Oscura',
    description: 'Fondo negro, dorado y fotos grandes. Para productos premium.',
    colors: {
      primary: '#f2f2f0',
      primaryForeground: '#0e0f11',
      secondary: '#1c1e22',
      secondaryForeground: '#f2f2f0',
      accent: '#e0a458',
      accentForeground: '#0e0f11',
      background: '#0e0f11',
      foreground: '#f2f2f0',
      muted: '#16181c',
      mutedForeground: '#a1a1aa',
      border: '#26282d',
    },
    radius: 'md',
  },
};

/**
 * Fonts a store may pick for headings and body text (ADR 0014). A closed list:
 * the storefront loads them with `next/font`, self-hosted, never from a URL a
 * store provides.
 */
export const THEME_FONTS = [
  'inter',
  'geist',
  'manrope',
  'dm-sans',
  'plus-jakarta-sans',
  'space-grotesk',
  'poppins',
  'montserrat',
  'instrument-serif',
  'playfair-display',
  'lora',
] as const;
export type ThemeFont = (typeof THEME_FONTS)[number];

export const MAX_DOMAINS = 10;

export interface Theme {
  template: StorefrontTemplate;
  colors: ThemeColors;
  radius: ThemeRadius;
  /** Replaces the heading font of the template. Absent: the template's. */
  fontHeading?: ThemeFont;
  /** Replaces the body font of the template. Absent: the template's. */
  fontBody?: ThemeFont;
  logoUrl?: string;
  faviconUrl?: string;
}

export const POLICY_KEYS = ['shipping', 'returns', 'privacy', 'terms'] as const;
export type PolicyKey = (typeof POLICY_KEYS)[number];

export const POLICY_LIMITS = {
  text: 5000,
  businessName: 120,
  taxId: 20,
  address: 200,
} as const;

/**
 * The store's policies, as plain text (paragraphs separated by blank lines).
 * Each one has a public page when it is set; the footer links to them.
 */
export type PolicySettings = Partial<Record<PolicyKey, string>>;

/** Who sells: shown on the policy pages and the footer, as consumer law asks. */
export interface LegalSettings {
  businessName?: string;
  /** CUIT. */
  taxId?: string;
  address?: string;
}

export interface ShippingSettings {
  pickupEnabled: boolean;
  pickupInstructions?: string;
  deliveryEnabled: boolean;
  /** Flat price of a delivery. */
  deliveryFlatRate: Money;
  deliveryInstructions?: string;
  /**
   * Cart subtotal (before discounts) from which delivery is free. It feeds the
   * progress bar of the home and the checkout applies it to the order's shipping.
   * Absent: no bar and no free shipping. Replaced by shipping rules (ADR 0018).
   */
  freeShippingThreshold?: Money;
  /** The seller agrees the shipping afterwards (freight, a courier of their own). */
  arrangedEnabled: boolean;
  arrangedInstructions?: string;
  /** Days the store needs to prepare an order before it leaves. Added to every delivery time. */
  handlingDays: number;
}

/** What only staff may know about the store's shipping. */
export interface ShippingConfig {
  /** Length × width × height ÷ divisor = volumetric kilos. */
  volumetricDivisor: number;
  boxes: ShippingBox[];
  rules: ShippingRule[];
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
  policies: PolicySettings;
  legal: LegalSettings;
  seo: Seo;
  /**
   * Blocks of the home, in order. Never empty: a store without a layout of its
   * own gets `DEFAULT_HOME_LAYOUT` for its template.
   */
  homepageLayout: HomeBlock[];
}

export interface Domain {
  hostname: string;
  isPrimary: boolean;
  status: DomainStatus;
  verifiedAt?: IsoDate;
}

export interface Tenant extends StorefrontTenant {
  /** How the store takes payments; shoppers learn it from `GET /v1/payments`. */
  payments: PaymentSettings;
  shippingConfig: ShippingConfig;
  timezone: string;
  platformHost: string;
  domains: Domain[];
  createdAt: IsoDate;
}

/** `null` clears an optional field. */
export interface UpdateTenantInput {
  name?: string;
  theme?: {
    template?: StorefrontTemplate;
    colors?: Partial<ThemeColors>;
    radius?: ThemeRadius;
    /** `null` goes back to the font of the template. */
    fontHeading?: ThemeFont | null;
    fontBody?: ThemeFont | null;
    logoUrl?: string | null;
    faviconUrl?: string | null;
  };
  settings?: {
    contactEmail?: string | null;
    contactPhone?: string | null;
    guestCheckoutEnabled?: boolean;
    payments?: {
      mercadopago?: { discountPercent?: number };
      /** `null` clears an optional field. */
      bankTransfer?: {
        enabled?: boolean;
        holderName?: string | null;
        bankName?: string | null;
        cbu?: string | null;
        alias?: string | null;
        taxId?: string | null;
        instructions?: string | null;
        discountPercent?: number;
        deadlineHours?: number;
      };
    };
    shipping?: {
      pickupEnabled?: boolean;
      pickupInstructions?: string | null;
      deliveryEnabled?: boolean;
      deliveryFlatRate?: Money;
      deliveryInstructions?: string | null;
      freeShippingThreshold?: Money | null;
      arrangedEnabled?: boolean;
      arrangedInstructions?: string | null;
      handlingDays?: number;
      volumetricDivisor?: number;
      /** Replaces the whole list. */
      boxes?: ShippingBox[];
      /** Replaces the whole list. */
      rules?: ShippingRuleInput[];
    };
    /** `null` clears a policy, which removes its page. */
    policies?: Partial<Record<PolicyKey, string | null>>;
    legal?: { businessName?: string | null; taxId?: string | null; address?: string | null };
  };
  seo?: { title?: string | null; description?: string | null };
  /** Replaces the whole list. An empty list goes back to the default layout. */
  homepageLayout?: HomeBlock[];
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

export interface UpdateDomainInput {
  /** Makes this the primary domain. The previous one stops being it. */
  isPrimary: boolean;
}
