/**
 * Stable error codes (`Problem.code`). Clients act on these; the human
 * texts of the API are only for developers.
 */
export enum ErrorCode {
  ValidationFailed = 'VALIDATION_FAILED',
  BadRequest = 'BAD_REQUEST',
  Unauthenticated = 'UNAUTHENTICATED',
  Forbidden = 'FORBIDDEN',
  NotFound = 'NOT_FOUND',
  Conflict = 'CONFLICT',
  RateLimited = 'RATE_LIMITED',
  Internal = 'INTERNAL_ERROR',

  TenantHostRequired = 'TENANT_HOST_REQUIRED',
  TenantNotFound = 'TENANT_NOT_FOUND',

  EmailTaken = 'EMAIL_TAKEN',
  LastOwner = 'LAST_OWNER',
  LoginRequired = 'LOGIN_REQUIRED',

  SlugRequired = 'SLUG_REQUIRED',
  SlugTaken = 'SLUG_TAKEN',
  SkuTaken = 'SKU_TAKEN',
  UnknownCategory = 'UNKNOWN_CATEGORY',
  InvalidParent = 'INVALID_PARENT',
  CategoryHasChildren = 'CATEGORY_HAS_CHILDREN',
  VariantsNeedOptions = 'VARIANTS_NEED_OPTIONS',
  DuplicateOption = 'DUPLICATE_OPTION',
  InvalidVariantOptions = 'INVALID_VARIANT_OPTIONS',
  DuplicateVariant = 'DUPLICATE_VARIANT',
  UnknownVariant = 'UNKNOWN_VARIANT',
  InvalidCompareAtPrice = 'INVALID_COMPARE_AT_PRICE',
  OptionsAndVariantsTogether = 'OPTIONS_AND_VARIANTS_TOGETHER',

  FileRequired = 'FILE_REQUIRED',
  EmptyFile = 'EMPTY_FILE',
  FileTooLarge = 'FILE_TOO_LARGE',
  UnsupportedImageType = 'UNSUPPORTED_IMAGE_TYPE',
  ForeignMediaUrl = 'FOREIGN_MEDIA_URL',

  CartTokenRequired = 'CART_TOKEN_REQUIRED',
  CartFull = 'CART_FULL',
  CartEmpty = 'CART_EMPTY',
  CartNotPurchasable = 'CART_NOT_PURCHASABLE',
  OutOfStock = 'OUT_OF_STOCK',
  PriceChanged = 'PRICE_CHANGED',
  AddressRequired = 'ADDRESS_REQUIRED',
  AddressLimitReached = 'ADDRESS_LIMIT_REACHED',
  ShippingMethodUnavailable = 'SHIPPING_METHOD_UNAVAILABLE',
  IdempotencyKeyRequired = 'IDEMPOTENCY_KEY_REQUIRED',
  PaymentAccountNotConnected = 'PAYMENT_ACCOUNT_NOT_CONNECTED',
  OrderNotPayable = 'ORDER_NOT_PAYABLE',
  InvalidOrderTransition = 'INVALID_ORDER_TRANSITION',

  InvalidHostname = 'INVALID_HOSTNAME',
  DomainTaken = 'DOMAIN_TAKEN',
  DomainLimitReached = 'DOMAIN_LIMIT_REACHED',
  InvalidOAuthCallback = 'INVALID_OAUTH_CALLBACK',
  InvalidCursor = 'INVALID_CURSOR',
  InvalidSlug = 'INVALID_SLUG',
}
