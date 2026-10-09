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
  /** The record changed while it was being edited; reload it and try again. */
  ConcurrentUpdate = 'CONCURRENT_UPDATE',
  RateLimited = 'RATE_LIMITED',
  Internal = 'INTERNAL_ERROR',

  TenantHostRequired = 'TENANT_HOST_REQUIRED',
  TenantNotFound = 'TENANT_NOT_FOUND',
  /** The operator suspended the store: nothing is served until it is restored. */
  TenantSuspended = 'TENANT_SUSPENDED',

  EmailTaken = 'EMAIL_TAKEN',
  LastOwner = 'LAST_OWNER',
  LoginRequired = 'LOGIN_REQUIRED',
  InvalidResetToken = 'INVALID_RESET_TOKEN',
  CannotDeleteSelf = 'CANNOT_DELETE_SELF',
  PrimaryDomainRequired = 'PRIMARY_DOMAIN_REQUIRED',

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
  /** The bytes look like an image but cannot be decoded. */
  ImageUnreadable = 'IMAGE_UNREADABLE',
  ImageDimensionsTooLarge = 'IMAGE_DIMENSIONS_TOO_LARGE',
  /** A photo is tagged with an option value the product does not have. */
  InvalidImageOption = 'INVALID_IMAGE_OPTION',

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
  PaymentMethodRequired = 'PAYMENT_METHOD_REQUIRED',
  PaymentMethodUnavailable = 'PAYMENT_METHOD_UNAVAILABLE',
  /** The action does not apply to the way this order is paid. */
  PaymentMethodMismatch = 'PAYMENT_METHOD_MISMATCH',
  BankTransferIncomplete = 'BANK_TRANSFER_INCOMPLETE',
  OrderNotPayable = 'ORDER_NOT_PAYABLE',
  InvalidOrderTransition = 'INVALID_ORDER_TRANSITION',
  OrderNotRefundable = 'ORDER_NOT_REFUNDABLE',
  /** Same answer for a coupon that does not exist, expired or ran out: the codes are not guessable. */
  CouponInvalid = 'COUPON_INVALID',
  CouponMinSubtotal = 'COUPON_MIN_SUBTOTAL',
  CouponCodeTaken = 'COUPON_CODE_TAKEN',
  CouponInUse = 'COUPON_IN_USE',
  /** The link to leave a newsletter does not match the email. */
  InvalidUnsubscribeToken = 'INVALID_UNSUBSCRIBE_TOKEN',
  InvalidCouponValue = 'INVALID_COUPON_VALUE',
  /** The payment provider refused or could not be reached; nothing changed. */
  PaymentProviderFailed = 'PAYMENT_PROVIDER_FAILED',
  ShipmentNotAllowed = 'SHIPMENT_NOT_ALLOWED',

  /** The quote ran out of time or the cart changed since: ask for a new one. */
  ShippingQuoteExpired = 'SHIPPING_QUOTE_EXPIRED',
  ShippingOptionInvalid = 'SHIPPING_OPTION_INVALID',
  /** A carrier could not be reached; the other options still stand. */
  CarrierUnavailable = 'CARRIER_UNAVAILABLE',
  /** The carrier refused the credentials of the store. */
  CarrierAuthFailed = 'CARRIER_AUTH_FAILED',
  /** The order cannot be sent to the carrier: it was not quoted with it, or it was already imported. */
  ShipmentImportNotAllowed = 'SHIPMENT_IMPORT_NOT_ALLOWED',
  /** A package is over what the carrier takes. */
  PackageExceedsLimits = 'PACKAGE_EXCEEDS_LIMITS',
  /** A product that is sold with a carrier has no weight or size. */
  ProductNeedsPackage = 'PRODUCT_NEEDS_PACKAGE',
  InvalidShippingRule = 'INVALID_SHIPPING_RULE',
  InvalidRateTable = 'INVALID_RATE_TABLE',
  RateTableNameTaken = 'RATE_TABLE_NAME_TAKEN',
  RateTableLimitReached = 'RATE_TABLE_LIMIT_REACHED',
  InvalidPriceTiers = 'INVALID_PRICE_TIERS',

  InvalidHostname = 'INVALID_HOSTNAME',
  DomainTaken = 'DOMAIN_TAKEN',
  DomainLimitReached = 'DOMAIN_LIMIT_REACHED',
  InvalidOAuthCallback = 'INVALID_OAUTH_CALLBACK',
  InvalidCursor = 'INVALID_CURSOR',

  DuplicateBlockId = 'DUPLICATE_BLOCK_ID',
  InvalidHomeBlock = 'INVALID_HOME_BLOCK',
}
