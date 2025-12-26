/**
 * Slug generation and validation utilities
 */

/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w-]+/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .substring(0, 100);
}

/**
 * Find a unique slug by trying variations (slug, slug-2, slug-3, etc.)
 * Returns the first available slug or null if all attempts fail
 */
export async function findUniqueSlug(
  baseSlug: string,
  checkAvailability: (slug: string) => Promise<boolean>,
  maxAttempts = 10
): Promise<string | null> {
  // Ensure base slug is valid
  const cleanBase = slugify(baseSlug);
  if (!cleanBase || cleanBase.length < 3) {
    return null;
  }

  // Try base slug first
  const isAvailable = await checkAvailability(cleanBase);
  if (isAvailable) {
    return cleanBase;
  }

  // Try numbered variations
  for (let i = 2; i <= maxAttempts + 1; i++) {
    const candidate = `${cleanBase}-${i}`;
    const available = await checkAvailability(candidate);
    if (available) {
      return candidate;
    }
  }

  // All attempts exhausted
  return null;
}

/**
 * Generate slug suggestions based on a taken slug
 */
export function generateSlugSuggestions(slug: string, count = 3): string[] {
  const base = slugify(slug);
  const suggestions: string[] = [];

  // Add numbered variations
  for (let i = 2; i <= count + 1; i++) {
    suggestions.push(`${base}-${i}`);
  }

  // Add timestamp-based variation
  const timestamp = Date.now().toString().slice(-6);
  suggestions.push(`${base}-${timestamp}`);

  return suggestions.slice(0, count);
}

/**
 * Validate slug format
 */
export function isValidSlugFormat(slug: string): boolean {
  // Only lowercase letters, numbers, and hyphens
  // Must start and end with alphanumeric
  // No consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}
