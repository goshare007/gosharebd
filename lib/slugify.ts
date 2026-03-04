import slugify from 'slugify';

export function toSlug(str: string): string {
  return slugify(str, {
    lower: true,
    strict: true,
    trim: true,
  });
}
