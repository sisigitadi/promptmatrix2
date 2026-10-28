/**
 * PromptMatrix URL & Deep-Link Utility
 * Generates and parses clean, human-readable slugs without %20, %28, or ugly encoded characters.
 * Example:
 * "RTF Framework" -> "rtf-framework"
 * "Hook-Story-Offer (HSO)" -> "hook-story-offer-hso"
 * "Problem-Agitate-Solve (PAS)" -> "problem-agitate-solve-pas"
 */

export const slugifyFormula = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const createFormulaShareUrl = (frameworkName: string): string => {
  const slug = slugifyFormula(frameworkName);
  const origin = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : 'https://prompt.sigitadi.id';
  return `${origin}/?f=${slug}`;
};
