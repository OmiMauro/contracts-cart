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
  'benefits',
  'promo-banners',
] as const;
export type HomeBlockType = (typeof HOME_BLOCK_TYPES)[number];

/**
 * How a block is drawn (ADR 0026). A closed list per type; the block says
 * what is shown, its variant how. The first variant of each type is the one a
 * block had before variants existed, so a block stored without one keeps its look.
 */
export const HOME_BLOCK_VARIANTS = {
  /** A text card beside a photo · the name set large · a headline over a rule · tiles of the newest products · a photo across the page · half color, half photo. */
  hero: ['cards', 'editorial', 'headline', 'bento', 'cover', 'split'],
  /** Round tiles · square tiles · tall cards with the name over the photo · a row that slides. */
  'category-grid': ['circles', 'squares', 'editorial-cards', 'slider'],
  /** An even grid · the first product twice as large · a row that slides · one tall photo beside four cards. */
  'product-showcase': ['grid', 'bento', 'carousel', 'spotlight'],
  /** Points over the photo · the photo beside the list of its products. */
  lookbook: ['hotspots', 'split'],
  /** A row that slides · a grid of cards · one large quote. */
  'social-proof': ['carousel', 'grid', 'quote'],
  /** Stacked cards · bands across the page. */
  urgency: ['card', 'bar'],
  /** A photo beside the text · centered text over a wide photo · the text over a photo across the page. */
  'brand-story': ['split', 'centered', 'banner'],
  /** Icons in a row · a card each · a compact band across the page. */
  benefits: ['row', 'cards', 'strip'],
  /** Two cards · three cards · one wide banner. */
  'promo-banners': ['pair', 'trio', 'wide'],
} as const satisfies Record<HomeBlockType, readonly [string, ...string[]]>;

export type HomeBlockVariant<T extends HomeBlockType = HomeBlockType> = (typeof HOME_BLOCK_VARIANTS)[T][number];

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
  benefits: 4,
  benefitTitle: 40,
  benefitText: 120,
  banners: 3,
} as const;

/** `id` of a block: lowercase letters, digits and dashes. Unique within the layout. */
export const HOME_BLOCK_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** An internal path (`/productos`) or an https URL. Anything else is rejected. */
export const HOME_LINK_PATTERN = /^(?:\/(?!\/)[^\s]*|https:\/\/[^\s]+)$/;

/**
 * `shape` of a category grid, from before variants existed, and the variant
 * each one became. Still accepted when writing and mapped when reading; no
 * block is written with it any more.
 */
export const LEGACY_CATEGORY_SHAPES = { circle: 'circles', square: 'squares' } as const;
export type LegacyCategoryShape = keyof typeof LEGACY_CATEGORY_SHAPES;

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
  /** "Sobre" and the store name when omitted. */
  title?: string;
  /** Paragraphs separated by blank lines. The store's description when omitted; with neither, the block is not drawn. */
  text?: string;
  imageUrl?: string;
  imageSide: HomeSide;
  values: BrandValue[];
}

/** Icons a benefit may carry. A closed list: the storefront maps each key to a drawing. */
export const BENEFIT_ICONS = [
  'truck',
  'map-pin',
  'package',
  'shield-check',
  'credit-card',
  'refresh-ccw',
  'message-circle',
  'clock',
  'award',
  'gift',
  'leaf',
  'sparkles',
] as const;
export type BenefitIcon = (typeof BENEFIT_ICONS)[number];

export interface BenefitItem {
  icon: BenefitIcon;
  title: string;
  text?: string;
}

/** Reasons to buy here: shipping, payment, returns. */
export interface BenefitsProps {
  title?: string;
  /**
   * Up to `HOME_LIMITS.benefits`. Empty: the storefront writes them from what
   * the store has set up (free shipping, pickup, returns), so they are never
   * a promise the store did not make.
   */
  items: BenefitItem[];
}

export interface PromoBanner {
  /** An image the store uploaded. */
  imageUrl: string;
  title: string;
  text?: string;
  buttonLabel?: string;
  /** An internal path or an https URL. */
  href: string;
}

/** Banners that send to a category, a product or a campaign. */
export interface PromoBannersProps {
  title?: string;
  /** Up to `HOME_LIMITS.banners`. Empty: the block is not drawn. */
  banners: PromoBanner[];
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
  benefits: BenefitsProps;
  'promo-banners': PromoBannersProps;
}

export type HomeBlockOf<T extends HomeBlockType> = {
  id: string;
  type: T;
  /** A block that is off stays in the layout and is not drawn. */
  enabled: boolean;
  variant: HomeBlockVariant<T>;
  props: HomePropsByType[T];
};

/** One block of the home, as the API answers it. A union discriminated by `type`. */
export type HomeBlock = { [T in HomeBlockType]: HomeBlockOf<T> }[HomeBlockType];

/** One block as a store sends it. Without a `variant` it gets the look blocks had before variants existed (`variantOf`). */
export type HomeBlockInputOf<T extends HomeBlockType> = Omit<HomeBlockOf<T>, 'variant'> & {
  variant?: HomeBlockVariant<T>;
};
export type HomeBlockInput = { [T in HomeBlockType]: HomeBlockInputOf<T> }[HomeBlockType];

export function isHomeVariantOf<T extends HomeBlockType>(type: T, variant: unknown): variant is HomeBlockVariant<T> {
  return typeof variant === 'string' && (HOME_BLOCK_VARIANTS[type] as readonly string[]).includes(variant);
}

const block = <T extends HomeBlockType>(
  id: string,
  type: T,
  variant: HomeBlockVariant<T>,
  props: HomePropsByType[T],
  enabled = true,
): HomeBlock => ({ id, type, enabled, variant, props }) as unknown as HomeBlock;

const hero = (variant: HomeBlockVariant<'hero'>, alignment: HomeAlignment = 'left') =>
  block('portada', 'hero', variant, { alignment });

const categories = (variant: HomeBlockVariant<'category-grid'>) =>
  block('categorias', 'category-grid', variant, { categorySlugs: [] });

/** The newest products. A second showcase of the newest goes on where the one before it stopped. */
const newest = (id: string, variant: HomeBlockVariant<'product-showcase'>, limit: number, title?: string) =>
  block(id, 'product-showcase', variant, { ...(title ? { title } : {}), source: 'newest', productSlugs: [], limit });

/** Without a text of its own it tells the store's description, so it can be on from the start. */
const story = (variant: HomeBlockVariant<'brand-story'>, imageSide: HomeSide = 'left') =>
  block('historia', 'brand-story', variant, { imageSide, values: [] });

/** Without items of its own it lists what the store has set up. */
const benefits = (variant: HomeBlockVariant<'benefits'>) => block('beneficios', 'benefits', variant, { items: [] });

/** Shows only what the store has: products with few units left and the free shipping bar. */
const urgency = (variant: HomeBlockVariant<'urgency'>) =>
  block('urgencia', 'urgency', variant, { showLowStock: true, showFreeShippingBar: true });

/** Off until the store writes its testimonials. */
const opinions = (variant: HomeBlockVariant<'social-proof'>) =>
  block('opiniones', 'social-proof', variant, { testimonials: [] }, false);

/**
 * Layout a store gets while it has none of its own (or an empty one). The API
 * returns it; nothing is written to the database, so improving a preset never
 * needs a migration.
 *
 * Each template has a structure of its own, not only a look (ADR 0026): which
 * blocks, in which order and in which variant. Every block that is on draws
 * with what any store has (its name, its description, its categories and its
 * products); the ones that need content of the store start off.
 */
export const DEFAULT_HOME_LAYOUT: Record<StorefrontTemplate, HomeBlock[]> = {
  // The brand first: a few chosen pieces, then its story, then the catalog.
  editorial: [
    hero('editorial'),
    newest('seleccion', 'spotlight', 5, 'Selección'),
    categories('editorial-cards'),
    story('centered'),
    newest('novedades', 'grid', 8, 'Más para descubrir'),
    opinions('quote'),
  ],
  // Friendly and short: why to buy here, where to go, what is new.
  suave: [
    hero('cards'),
    benefits('row'),
    categories('circles'),
    newest('novedades', 'grid', 8),
    story('split', 'right'),
  ],
  // Loud: the newest piece large, a row of categories, what is running out.
  audaz: [
    hero('headline'),
    newest('lo-nuevo', 'bento', 5, 'Lo nuevo'),
    categories('slider'),
    urgency('bar'),
    newest('novedades', 'grid', 8, 'Seguí mirando'),
    story('banner'),
  ],
  // Premium: products as tiles, tall category cards, one piece under the light.
  oscura: [
    hero('bento'),
    categories('editorial-cards'),
    newest('destacados', 'spotlight', 5, 'Destacados'),
    benefits('strip'),
    newest('novedades', 'grid', 8, 'Colección'),
  ],
  // The photo does the talking: a cover across the page and large tiles.
  galeria: [
    hero('cover'),
    newest('obras', 'bento', 5, 'Lo último'),
    categories('squares'),
    newest('novedades', 'grid', 6, 'Colección'),
    story('centered'),
  ],
  // A big catalog: categories at hand, reasons to buy, rows and a dense grid.
  mercado: [
    hero('split'),
    categories('slider'),
    benefits('strip'),
    newest('novedades', 'carousel', 12, 'Novedades'),
    urgency('bar'),
    newest('catalogo', 'grid', 10, 'Más productos'),
    block('promos', 'promo-banners', 'pair', { banners: [] }, false),
  ],
  // Precise: what is new as tiles, the guarantees as cards, an ordered grid.
  tecnica: [
    hero('bento'),
    benefits('cards'),
    categories('squares'),
    newest('novedades', 'grid', 8, 'Recién llegados'),
    urgency('card'),
    story('split'),
  ],
  // Warm: who makes it comes before the catalog.
  natural: [
    hero('cards'),
    categories('circles'),
    story('split'),
    newest('novedades', 'grid', 8),
    benefits('row'),
  ],
  // Young and fast: the offer on top, rows to swipe, favorites large.
  pop: [
    hero('headline'),
    urgency('bar'),
    categories('slider'),
    newest('novedades', 'carousel', 12, 'Recién llegados'),
    newest('favoritos', 'bento', 5, 'Favoritos'),
    opinions('carousel'),
  ],
  // Traditional: a centered opening, framed categories, the house and its word.
  clasica: [
    hero('editorial', 'center'),
    categories('editorial-cards'),
    newest('novedades', 'grid', 8),
    story('split', 'right'),
    benefits('row'),
  ],
};

/**
 * The variant a template gives a block of a type: that of the first such block
 * of its starting layout, or the first of the type when the layout has none.
 */
export function templateVariant<T extends HomeBlockType>(template: StorefrontTemplate, type: T): HomeBlockVariant<T> {
  const found = DEFAULT_HOME_LAYOUT[template]?.find((candidate) => candidate.type === type);
  return (found?.variant ?? HOME_BLOCK_VARIANTS[type][0]) as HomeBlockVariant<T>;
}

/**
 * The variant of a block that may have none, or one this version does not
 * know. A block written before variants existed keeps the look it had: the
 * opening section followed the template, a category grid had a `shape`, and
 * every other block was drawn as the first variant of its type.
 */
export function variantOf<T extends HomeBlockType>(
  type: T,
  variant: unknown,
  legacy: { template?: StorefrontTemplate; props?: unknown } = {},
): HomeBlockVariant<T> {
  if (isHomeVariantOf(type, variant)) return variant;
  if (type === 'category-grid') {
    const shape = (legacy.props as { shape?: unknown } | null | undefined)?.shape;
    if (typeof shape === 'string' && Object.hasOwn(LEGACY_CATEGORY_SHAPES, shape)) {
      return LEGACY_CATEGORY_SHAPES[shape as LegacyCategoryShape] as HomeBlockVariant<T>;
    }
  }
  if (type === 'hero' && legacy.template) return templateVariant(legacy.template, type);
  return HOME_BLOCK_VARIANTS[type][0] as HomeBlockVariant<T>;
}
