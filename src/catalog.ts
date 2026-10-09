import type { Id, IsoDate, Money, PageQuery } from './common.js';

export enum ProductStatus {
  Draft = 'draft',
  Active = 'active',
  Archived = 'archived',
}

export const PRODUCT_SORTS = ['newest', 'price-asc', 'price-desc'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

/** A product reports `lowStock` when this many units or fewer remain. */
export const LOW_STOCK_THRESHOLD = 5;

export const PRODUCT_SEARCH = {
  minLength: 2,
  maxLength: 80,
} as const;

export const PRODUCT_LIMITS = {
  variants: 100,
  images: 20,
  options: 3,
  optionValues: 50,
  categories: 20,
  specs: 30,
  specName: 40,
  specValue: 200,
  brand: 60,
} as const;

// --- categories

export interface Category {
  id: Id;
  name: string;
  slug: string;
  description?: string;
  /** `null` for a top-level category. */
  parentId: Id | null;
  position: number;
  isActive: boolean;
  imageUrl?: string;
}

/** A category as shoppers see it: only active ones are ever returned. */
export type StorefrontCategory = Omit<Category, 'position' | 'isActive'>;

export interface CreateCategoryInput {
  name: string;
  /** Derived from the name when omitted. */
  slug?: string;
  description?: string | null;
  /** A top-level category to nest under; `null` for a top-level category. */
  parentId?: Id | null;
  position?: number;
  isActive?: boolean;
  imageUrl?: string | null;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// --- products

export interface ProductImage {
  url: string;
  alt?: string;
  /** Pixels of the stored file; layout hints only. */
  width?: number;
  height?: number;
  /** Shown first when shoppers choose this option value, e.g. `{ name: 'Color', value: 'Rojo' }`. */
  option?: OptionValue;
}

/** A line of a product's technical sheet, e.g. `{ name: 'Material', value: 'Algodón' }`. */
export interface ProductSpec {
  name: string;
  value: string;
}

/** Package size in millimetres. */
export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

/** An axis shoppers choose from, e.g. `{ name: 'Talle', values: ['S', 'M'] }`. */
export interface ProductOption {
  name: string;
  values: string[];
}

export interface OptionValue {
  name: string;
  value: string;
}

/** A variant as shoppers see it: active ones only, no stock counts, no SKU. */
export interface StorefrontVariant {
  id: Id;
  optionValues: OptionValue[];
  price: Money;
  /** The struck-through "was" price. */
  compareAtPrice?: Money;
  /** Whether it can be added to the cart right now. */
  available: boolean;
  weightGrams?: number;
  dimensionsMm?: Dimensions;
}

/** A variant as staff sees it: the public view plus what only staff may know. */
export interface Variant extends StorefrontVariant {
  sku: string;
  stock: number;
  isActive: boolean;
}

/** A product as shoppers see it. */
export interface StorefrontProduct {
  id: Id;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  specs: ProductSpec[];
  images: ProductImage[];
  options: ProductOption[];
  variants: StorefrontVariant[];
  priceMin: Money;
  priceMax: Money;
  available: boolean;
  /** Units left in total; only present when 1 to `LOW_STOCK_THRESHOLD` remain on a tracked product. */
  lowStock?: number;
  seoTitle?: string;
  seoDescription?: string;
}

/** A product as staff sees it: every variant, with stock, status and dates. */
export interface Product extends StorefrontProduct {
  variants: Variant[];
  status: ProductStatus;
  categoryIds: Id[];
  /** When false, stock is not checked nor decremented at checkout. */
  trackInventory: boolean;
  publishedAt?: IsoDate;
  createdAt: IsoDate;
  updatedAt: IsoDate;
}

/** A product in a storefront listing. */
export interface StorefrontProductSummary {
  id: Id;
  name: string;
  slug: string;
  brand?: string;
  image?: ProductImage;
  /** The second photo, shown when a shopper hovers the card. */
  hoverImage?: ProductImage;
  priceMin: Money;
  priceMax: Money;
  /** The "was" price of the cheapest variant, if that one is discounted. */
  compareAtPrice?: Money;
  available: boolean;
  /** Units left in total; only present when 1 to `LOW_STOCK_THRESHOLD` remain on a tracked product. */
  lowStock?: number;
}

export interface VariantInput {
  /** Id of an existing variant to keep. Omit it to create a new variant. */
  id?: Id;
  /** Generated when omitted. */
  sku?: string;
  /** One value per product option; empty for a product without options. */
  optionValues?: OptionValue[];
  price: Money;
  compareAtPrice?: Money | null;
  /**
   * Units on hand. Creating: 0 when omitted. Updating an existing variant:
   * omit it to leave the stock as it is, so an edit of the price or the SKU
   * never writes back a count that sales changed in the meantime.
   */
  stock?: number;
  isActive?: boolean;
  /** Omit it to leave the value as it is; `null` clears it. */
  weightGrams?: number | null;
  /** All three sides or none. Omit it to leave the value as it is; `null` clears it. */
  dimensionsMm?: Dimensions | null;
}

export interface CreateProductInput {
  name: string;
  /** Derived from the name when omitted. */
  slug?: string;
  description?: string | null;
  brand?: string | null;
  specs?: ProductSpec[];
  status?: ProductStatus;
  categoryIds?: Id[];
  images?: ProductImage[];
  /** Axes shoppers choose from. Omit for a product sold as a single item. */
  options?: ProductOption[];
  variants: VariantInput[];
  trackInventory?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

/** `options` and `variants` must be sent together: the variants given replace the current ones. */
export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductsQuery extends PageQuery {
  /** Staff only: shoppers always get published products. */
  status?: ProductStatus;
  /** Slug of a category; includes its sub-categories. */
  category?: string;
  sort?: ProductSort;
  /** Text to look for in the product name. Between `PRODUCT_SEARCH.minLength` and `maxLength` characters. */
  q?: string;
  /** Exact brand, as returned by `GET /v1/brands`. */
  brand?: string;
}

export interface BrandsQuery {
  /** Slug of a category; includes its sub-categories. */
  category?: string;
}

/** Distinct brands, sorted by name. Shoppers see those of published products. */
export interface BrandList {
  data: string[];
}
