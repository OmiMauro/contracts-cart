import type { StorefrontTemplate } from './tenant.js';

/**
 * Home page of a store: an ordered list of typed blocks (ADR 0014).
 *
 * The set of block types is closed. Content is plain text, https image URLs
 * and internal links: never HTML or CSS. Categories and products are
 * referenced by slug and resolved inside the tenant of the request, so a
 * layout can never point at another store's data.
 */
export const HOME_BLOCK_TYPES = [
  'hero',
  'category-grid',
  'product-showcase',
  'lookbook',
  'social-proof',
  'urgency',
  'brand-story',
] as const;
export type HomeBlockType = (typeof HOME_BLOCK_TYPES)[number];

export const HOME_LIMITS = {
  blocks: 20,
  blockId: 40,
  title: 80,
  headline: 120,
  subtitle: 240,
  buttonLabel: 40,
  text: 1000,
  url: 2048,
  alt: 140,
  categories: 12,
  products: 12,
  hotspots: 8,
  testimonials: 12,
  author: 60,
  values: 6,
  valueTitle: 60,
  valueText: 200,
} as const;

/** `id` of a block: lowercase letters, digits and dashes. Unique within the layout. */
export const HOME_BLOCK_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** An internal path (`/productos`) or an https URL. Anything else is rejected. */
export const HOME_LINK_PATTERN = /^(?:\/(?!\/)[^\s]*|https:\/\/[^\s]+)$/;

export const HOME_SHAPES = ['circle', 'square'] as const;
export type HomeShape = (typeof HOME_SHAPES)[number];

export const HOME_SIDES = ['left', 'right'] as const;
export type HomeSide = (typeof HOME_SIDES)[number];

export const HOME_ALIGNMENTS = ['left', 'center'] as const;
export type HomeAlignment = (typeof HOME_ALIGNMENTS)[number];

export const HOME_PRODUCT_SOURCES = ['newest', 'category', 'manual'] as const;
export type HomeProductSource = (typeof HOME_PRODUCT_SOURCES)[number];

// --- props of each block

export interface HeroProps {
  /** The store name when omitted. */
  headline?: string;
  subtitle?: string;
  /** An image the store uploaded. */
  imageUrl?: string;
  alignment?: HomeAlignment;
  buttonLabel?: string;
  buttonHref?: string;
}

export interface CategoryGridProps {
  title?: string;
  shape: HomeShape;
  /** Slugs to show, in order. Empty: the top-level categories. */
  categorySlugs: string[];
}

export interface ProductShowcaseProps {
  title?: string;
  source: HomeProductSource;
  /** Required when `source` is `category`. */
  categorySlug?: string;
  /** Required when `source` is `manual`. Slugs, in order. */
  productSlugs: string[];
  /** How many products to show for `newest` and `category`. */
  limit: number;
}

export interface LookbookHotspot {
  /** Position over the photo, in percent (0 to 100). */
  x: number;
  y: number;
  productSlug: string;
}

export interface LookbookProps {
  title?: string;
  imageUrl: string;
  imageAlt?: string;
  hotspots: LookbookHotspot[];
}

export interface Testimonial {
  author: string;
  text: string;
  /** 1 to 5. */
  rating: number;
  /** What the store declares. The platform does not verify it. */
  verifiedPurchase: boolean;
}

export interface SocialProofProps {
  title?: string;
  testimonials: Testimonial[];
}

export interface UrgencyProps {
  /** Short banner text, e.g. "Oferta relámpago". */
  message?: string;
  /** When the offer ends. Shows a countdown; the banner hides once it passes. */
  endsAt?: string;
  /** Shows "Últimas X unidades" on products that report `lowStock`. */
  showLowStock: boolean;
  /** Shows the free shipping progress bar (needs `shipping.freeShippingThreshold`). */
  showFreeShippingBar: boolean;
}

export interface BrandValue {
  title: string;
  text?: string;
}

export interface BrandStoryProps {
  title: string;
  text: string;
  imageUrl?: string;
  imageSide: HomeSide;
  values: BrandValue[];
}

// --- the block

export interface HomePropsByType {
  hero: HeroProps;
  'category-grid': CategoryGridProps;
  'product-showcase': ProductShowcaseProps;
  lookbook: LookbookProps;
  'social-proof': SocialProofProps;
  urgency: UrgencyProps;
  'brand-story': BrandStoryProps;
}

export type HomeBlockOf<T extends HomeBlockType> = {
  id: string;
  type: T;
  enabled: boolean;
  props: HomePropsByType[T];
};

/** One block of the home. A union discriminated by `type`. */
export type HomeBlock = { [T in HomeBlockType]: HomeBlockOf<T> }[HomeBlockType];

/**
 * Layout a store gets while it has none of its own (or an empty one). The API
 * returns it; nothing is written to the database, so improving a preset never
 * needs a migration.
 */
/** The opening section, the categories and the newest products: what every template starts with. */
const startingLayout = (alignment: HomeAlignment, shape: HomeShape): HomeBlock[] => [
  { id: 'portada', type: 'hero', enabled: true, props: { alignment } },
  { id: 'categorias', type: 'category-grid', enabled: true, props: { shape, categorySlugs: [] } },
  {
    id: 'novedades',
    type: 'product-showcase',
    enabled: true,
    props: { source: 'newest', productSlugs: [], limit: 8 },
  },
];

export const DEFAULT_HOME_LAYOUT: Record<StorefrontTemplate, HomeBlock[]> = {
  editorial: startingLayout('left', 'square'),
  suave: startingLayout('center', 'circle'),
  audaz: startingLayout('left', 'square'),
  oscura: startingLayout('center', 'circle'),
  galeria: startingLayout('left', 'square'),
  mercado: startingLayout('left', 'square'),
  tecnica: startingLayout('left', 'square'),
  natural: startingLayout('center', 'circle'),
  pop: startingLayout('center', 'circle'),
  clasica: startingLayout('left', 'square'),
};
