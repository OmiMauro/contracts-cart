export const MEDIA = {
  maxUploadBytes: 10 * 1024 * 1024,
  /** Pixels (width × height) a source image may have; larger ones are refused before decoding. */
  maxInputPixels: 40_000_000,
  /** Recognised by their bytes, never by the declared type. SVG is excluded: it can carry scripts. */
  imageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  /** Widths of the WebP files generated for every upload: thumbnail, mobile, desktop. Never enlarged. */
  renditionWidths: [320, 828, 1600],
} as const;

/**
 * `<base>/t/<tenant>/<year>/<uuid>/<width>.webp`. The URL that gets stored is
 * always the widest one; the others are found by swapping the width.
 */
export const MEDIA_RENDITION_PATTERN = /^(.+\/[0-9a-f-]{36}\/)(\d+)\.webp$/;

export interface UploadedImage {
  /** The widest rendition. */
  url: string;
  contentType: string;
  /** Bytes of the widest rendition. */
  size: number;
  /** Pixels of the widest rendition. */
  width: number;
  height: number;
}
