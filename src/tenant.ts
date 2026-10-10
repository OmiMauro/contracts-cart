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
 * typography, layout of the header, home and product cards, and a few
 * palettes to choose from. The store can also set its own colors and radius.
 */
export const STOREFRONT_TEMPLATES = ['editorial', 'suave', 'audaz', 'oscura'] as const;
export type StorefrontTemplate = (typeof STOREFRONT_TEMPLATES)[number];

export const DEFAULT_STOREFRONT_TEMPLATE: StorefrontTemplate = 'suave';

interface PaletteOf<Key extends string> {
  /** Unique within its template. */
  key: Key;
  name: string;
  colors: ThemeColors;
  radius: ThemeRadius;
}

interface PresetOf<Key extends string> {
  name: string;
  /** One line for the picker in the panel. */
  description: string;
  /** Palettes curated for the template. The first one is its starting look. */
  palettes: readonly PaletteOf<Key>[];
}

/** `primary/primaryForeground secondary/… accent/… background/foreground muted/mutedForeground border`. */
function colors(tokens: string): ThemeColors {
  const [primary, secondary, accent, base, muted, border] = tokens.split(' ');
  const pair = (value: string) => value.split('/') as [string, string];
  return {
    primary: pair(primary)[0],
    primaryForeground: pair(primary)[1],
    secondary: pair(secondary)[0],
    secondaryForeground: pair(secondary)[1],
    accent: pair(accent)[0],
    accentForeground: pair(accent)[1],
    background: pair(base)[0],
    foreground: pair(base)[1],
    muted: pair(muted)[0],
    mutedForeground: pair(muted)[1],
    border,
  };
}

const PRESETS = {
  editorial: {
    name: 'Editorial',
    description: 'Serif, mucho aire y fotos verticales. Para marcas con historia.',
    palettes: [
      {
        key: 'tinta',
        name: 'Tinta',
        colors: colors('#151515/#ffffff #f5f5f4/#151515 #0f766e/#ffffff #ffffff/#151515 #f5f5f4/#57534e #e7e5e4'),
        radius: 'none',
      },
      {
        key: 'crema',
        name: 'Crema',
        colors: colors('#1f1a17/#fffaf0 #f3ebdd/#1f1a17 #9a3412/#ffffff #fffaf0/#1f1a17 #f6efe2/#6b5e52 #e8dfcf'),
        radius: 'none',
      },
      {
        key: 'noche',
        name: 'Noche',
        colors: colors('#f5f0e8/#15130f #26221c/#f5f0e8 #d6a85a/#15130f #15130f/#f5f0e8 #1e1a15/#b5ab9c #332d25'),
        radius: 'none',
      },
    ],
  },
  suave: {
    name: 'Suave',
    description: 'Redondeada, cálida y liviana. Para vender sin fricción.',
    palettes: [
      {
        key: 'menta',
        name: 'Menta',
        colors: colors('#0f766e/#ffffff #e7eeec/#1c1917 #1c1917/#ffffff #f4f6f5/#1c1917 #e9edeb/#57534e #dde3e0'),
        radius: 'full',
      },
      {
        key: 'durazno',
        name: 'Durazno',
        colors: colors('#c2410c/#ffffff #fde8d7/#431407 #1c1917/#ffffff #fff6ef/#292524 #fcebdd/#655a52 #f3d9c6'),
        radius: 'full',
      },
      {
        key: 'lavanda',
        name: 'Lavanda',
        colors: colors('#6d28d9/#ffffff #ede9fe/#2e1065 #1e1b4b/#ffffff #f7f5fb/#1e1b4b #ece8f5/#5b5577 #ddd6ee'),
        radius: 'full',
      },
    ],
  },
  audaz: {
    name: 'Audaz',
    description: 'Mayúsculas, reglas negras y tipografía grande. Para marcas con actitud.',
    palettes: [
      {
        key: 'carmin',
        name: 'Carmín',
        colors: colors('#be123c/#ffffff #0a0a0a/#f5f5f0 #0a0a0a/#f5f5f0 #f5f5f0/#0a0a0a #ebebe4/#3f3f3a #0a0a0a'),
        radius: 'none',
      },
      {
        key: 'senal',
        name: 'Señal',
        colors: colors('#0a0a0a/#fde047 #0a0a0a/#fde047 #0a0a0a/#fde047 #fde047/#0a0a0a #f2d93a/#3f3a0a #0a0a0a'),
        radius: 'none',
      },
      {
        key: 'negativo',
        name: 'Negativo',
        colors: colors('#ff3b1f/#0a0a0a #f5f5f0/#0a0a0a #f5f5f0/#0a0a0a #0a0a0a/#f5f5f0 #171717/#bdbdb5 #f5f5f0'),
        radius: 'none',
      },
    ],
  },
  oscura: {
    name: 'Oscura',
    description: 'Fondo negro, dorado y fotos grandes. Para productos premium.',
    palettes: [
      {
        key: 'dorado',
        name: 'Dorado',
        colors: colors('#f2f2f0/#0e0f11 #1c1e22/#f2f2f0 #e0a458/#0e0f11 #0e0f11/#f2f2f0 #16181c/#a1a1aa #26282d'),
        radius: 'md',
      },
      {
        key: 'esmeralda',
        name: 'Esmeralda',
        colors: colors('#f2f2f0/#0b1110 #16201d/#f2f2f0 #34d399/#0b1110 #0b1110/#f2f2f0 #111a17/#9ca3a0 #22302c'),
        radius: 'md',
      },
      {
        key: 'marfil',
        name: 'Marfil',
        colors: colors('#141414/#faf8f3 #ebe7de/#141414 #8a6d2f/#ffffff #faf8f3/#141414 #f1ede4/#5f5a51 #e1dccf'),
        radius: 'md',
      },
    ],
  },
} as const satisfies Record<StorefrontTemplate, PresetOf<string>>;

/** A palette of any template. Which ones a store may pick depends on its template. */
export type ThemePaletteKey = (typeof PRESETS)[StorefrontTemplate]['palettes'][number]['key'];
export type ThemePalette = PaletteOf<ThemePaletteKey>;
export type StorefrontTemplatePreset = PresetOf<ThemePaletteKey>;

export const STOREFRONT_TEMPLATE_PRESETS: Record<StorefrontTemplate, StorefrontTemplatePreset> = PRESETS;

export const THEME_PALETTE_KEYS: readonly ThemePaletteKey[] = [
  ...new Set(STOREFRONT_TEMPLATES.flatMap((template) => PRESETS[template].palettes.map((palette) => palette.key))),
];

/** The palette of a template with that key; none when the key belongs to another template or to none. */
export function paletteOf(template: StorefrontTemplate, key: unknown): ThemePalette | undefined {
  return STOREFRONT_TEMPLATE_PRESETS[template].palettes.find((palette) => palette.key === key);
}

/** The palette a store gets when it picks a template. */
export function defaultPalette(template: StorefrontTemplate): ThemePalette {
  return STOREFRONT_TEMPLATE_PRESETS[template].palettes[0];
}

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
  /**
   * The palette of the template the store picked. While it is set, `colors`
   * and `radius` are that palette's. Absent: the store chose its own.
   */
  palette?: ThemePaletteKey;
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
    /**
     * A palette of the store's template: the API applies its colors and radius.
     * `null`, or sending colors or a radius without it, makes the palette the store's own.
     */
    palette?: ThemePaletteKey | null;
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
