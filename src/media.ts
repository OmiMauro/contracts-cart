export const MEDIA = {
  maxUploadBytes: 5 * 1024 * 1024,
  /** Recognised by their bytes, never by the declared type. SVG is excluded: it can carry scripts. */
  imageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
} as const;

export interface UploadedImage {
  url: string;
  contentType: string;
  size: number;
}
