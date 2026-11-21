/**
 * Agent Skill Logo & Visual Emblem Service
 * Provides vector SVG logo generation via Universal AI,
 * plus aligned deterministic SVG generation and Midjourney/FLUX prompting.
 * 100% Client-Side, Zero External API Limit / Rate Limit Free.
 */

import { generateTextWithUniversalAI, sanitizePromptText } from './universalAIService';
import { AgensiPillar } from '../config/agensiConfig';

export interface SkillLogoInput {
  readonly slug: string;
  readonly name: string;
  readonly title: string;
  readonly category: string;
  readonly pillar?: AgensiPillar;
  readonly description?: string;
  readonly language?: 'id' | 'en';
}

/**
 * Sanitizes and extracts valid standalone SVG markup.
 */
export const sanitizeSvgMarkup = (raw: string): string => {
  if (!raw) return '';

  let cleaned = raw
    .replace(/^```(?:xml|svg|html)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  const svgMatch = cleaned.match(/<svg[\s\S]*?<\/svg>/i);
  if (svgMatch) {
    cleaned = svgMatch[0];
  }

  // Security: eliminate active script tags, foreignObject, iframe, object, embed, event handlers, and javascript/data URIs
  cleaned = cleaned
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?<\/embed>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(?:href|xlink:href)\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, '')
    .replace(/(?:href|xlink:href)\s*=\s*["']?\s*data:[^"'>\s]*/gi, '');

  // Ensure mandatory attributes
  if (!cleaned.includes('xmlns="http://www.w3.org/2000/svg"')) {
    cleaned = cleaned.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!cleaned.includes('viewBox=')) {
    cleaned = cleaned.replace(/<svg\b/i, '<svg viewBox="0 0 128 128"');
  }

  return cleaned.trim();
};

/**
 * Generates an aligned Midjourney v7 / FLUX.2 prompt for creators who want
 * to generate a 3D isometric app icon in an external image generator.
 */
export const generateMidjourneyLogoPrompt = (input: {
  readonly name: string;
  readonly title: string;
  readonly category: string;
  readonly pillar?: AgensiPillar;
}): string => {
  const pillar = input.pillar || 'develop';

  const pillarColorMap: Record<AgensiPillar, string> = {
    develop: 'deep slate container, neon emerald and electric cyan accents',
    grow: 'midnight navy container, royal indigo and laser blue accents',
    operate: 'dark bronze container, warm amber and gold gradient accents',
    create: 'matte obsidian container, vibrant fuchsia and neon coral accents',
  };

  const palette = pillarColorMap[pillar];

  return `Modern 3D vector app icon representing "${input.title}", minimalist symbolic emblem, ${palette}, rounded squircle icon container with subtle rim lighting, glossy glassmorphic details, 8k resolution, clean geometry, iOS app store icon style, octane render --ar 1:1 --v 7`;
};

/**
 * Deterministic, instant, aligned SVG logo generator for any skill (offline and fallback).
 */
export const generateAlignedSkillLogoSvg = (input: SkillLogoInput): string => {
  const { slug, title, pillar = 'develop' } = input;
  const cleanSlug = slug.toLowerCase();

  // Color schemes and gradients per pillar
  const pillarThemes: Record<
    AgensiPillar,
    { bg1: string; bg2: string; accent: string; glow: string }
  > = {
    develop: { bg1: '#09131f', bg2: '#064e3b', accent: '#10b981', glow: '#34d399' },
    grow: { bg1: '#0b112c', bg2: '#1e1b4b', accent: '#3b82f6', glow: '#60a5fa' },
    operate: { bg1: '#1a1005', bg2: '#451a03', accent: '#f59e0b', glow: '#fbbf24' },
    create: { bg1: '#190a1f', bg2: '#4a044e', accent: '#d946ef', glow: '#f472b6' },
  };

  const theme = pillarThemes[pillar] || pillarThemes.develop;

  // Specific bespoke glyph paths for known flagship packages
  let glyphContent = '';

  if (cleanSlug.includes('nextjs') || cleanSlug.includes('fullstack')) {
    glyphContent = `
      <!-- Fullstack Next.js Layered Architecture Glyph -->
      <path d="M40 88L64 40L88 88" stroke="${theme.accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M48 76H80" stroke="${theme.glow}" stroke-width="5" stroke-linecap="round" />
      <circle cx="64" cy="40" r="5" fill="#ffffff" />
      <rect x="36" y="94" width="56" height="4" rx="2" fill="${theme.accent}" opacity="0.6" />
    `;
  } else if (cleanSlug.includes('mcp') || cleanSlug.includes('server')) {
    glyphContent = `
      <!-- MCP Server Protocol Hub Glyph -->
      <circle cx="64" cy="64" r="16" fill="${theme.accent}" opacity="0.2" />
      <circle cx="64" cy="64" r="10" fill="${theme.accent}" />
      <circle cx="36" cy="44" r="6" fill="${theme.glow}" />
      <circle cx="92" cy="44" r="6" fill="${theme.glow}" />
      <circle cx="64" cy="94" r="6" fill="${theme.glow}" />
      <line x1="41" y1="48" x2="57" y2="59" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" />
      <line x1="87" y1="48" x2="71" y2="59" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" />
      <line x1="64" y1="88" x2="64" y2="74" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" />
    `;
  } else if (cleanSlug.includes('postgres') || cleanSlug.includes('sql')) {
    glyphContent = `
      <!-- Postgres Database Stack with Zero-Downtime Lightning -->
      <ellipse cx="64" cy="42" rx="28" ry="10" fill="none" stroke="${theme.accent}" stroke-width="5" />
      <path d="M36 42V62C36 67.5 48.5 72 64 72C79.5 72 92 67.5 92 62V42" fill="none" stroke="${theme.accent}" stroke-width="5" />
      <path d="M36 62V82C36 87.5 48.5 92 64 92C79.5 92 92 87.5 92 82V62" fill="none" stroke="${theme.accent}" stroke-width="5" />
      <polygon points="68,34 52,62 64,62 60,90 76,58 64,58" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
    `;
  } else if (cleanSlug.includes('playwright') || cleanSlug.includes('contract')) {
    glyphContent = `
      <!-- Playwright Browser & OpenAPI Contract Shield -->
      <rect x="32" y="34" width="64" height="48" rx="6" fill="none" stroke="${theme.accent}" stroke-width="5" />
      <line x1="32" y1="46" x2="96" y2="46" stroke="${theme.accent}" stroke-width="4" />
      <circle cx="42" cy="40" r="2.5" fill="${theme.glow}" />
      <circle cx="50" cy="40" r="2.5" fill="${theme.glow}" />
      <path d="M50 64L60 74L78 54" fill="none" stroke="#22c55e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    `;
  } else if (cleanSlug.includes('security') || cleanSlug.includes('owasp')) {
    glyphContent = `
      <!-- Security Shield & Digital Keyhole -->
      <path d="M64 30L92 42V66C92 84 80 96 64 102C48 96 36 84 36 66V42L64 30Z" fill="none" stroke="${theme.accent}" stroke-width="5" stroke-linejoin="round" />
      <circle cx="64" cy="58" r="8" fill="${theme.glow}" />
      <polygon points="61,58 67,58 70,76 58,76" fill="${theme.glow}" />
      <circle cx="64" cy="58" r="3" fill="#09131f" />
    `;
  } else if (cleanSlug.includes('swarm') || cleanSlug.includes('orchestrat')) {
    glyphContent = `
      <!-- Multi-Agent Swarm Orbit -->
      <circle cx="64" cy="64" r="14" fill="${theme.accent}" />
      <circle cx="64" cy="64" r="32" fill="none" stroke="${theme.glow}" stroke-width="3" stroke-dasharray="6 6" />
      <circle cx="64" cy="32" r="7" fill="${theme.glow}" />
      <circle cx="92" cy="74" r="7" fill="${theme.glow}" />
      <circle cx="36" cy="74" r="7" fill="${theme.glow}" />
    `;
  } else if (cleanSlug.includes('prd') || cleanSlug.includes('product-manager')) {
    glyphContent = `
      <!-- Product Blueprint & Metric Compass -->
      <rect x="36" y="32" width="56" height="66" rx="6" fill="none" stroke="${theme.accent}" stroke-width="5" />
      <line x1="46" y1="46" x2="82" y2="46" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" />
      <line x1="46" y1="58" x2="74" y2="58" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" />
      <line x1="46" y1="70" x2="66" y2="70" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" />
      <circle cx="76" cy="80" r="10" fill="${theme.accent}" />
      <path d="M72 80L75 83L80 77" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    `;
  } else if (cleanSlug.includes('workflow') || cleanSlug.includes('n8n')) {
    glyphContent = `
      <!-- Workflow Automation Nodes & Branching -->
      <rect x="32" y="54" width="20" height="20" rx="4" fill="${theme.accent}" />
      <rect x="76" y="36" width="20" height="20" rx="4" fill="${theme.glow}" />
      <rect x="76" y="72" width="20" height="20" rx="4" fill="${theme.glow}" />
      <path d="M52 64H64V46H76" fill="none" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" />
      <path d="M64 64V82H76" fill="none" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" />
    `;
  } else if (cleanSlug.includes('seo') || cleanSlug.includes('geo')) {
    glyphContent = `
      <!-- SEO & GEO Organic Search Matrix -->
      <circle cx="56" cy="56" r="22" fill="none" stroke="${theme.accent}" stroke-width="6" />
      <line x1="72" y1="72" x2="94" y2="94" stroke="${theme.accent}" stroke-width="7" stroke-linecap="round" />
      <path d="M42 62L52 50L60 56L72 40" fill="none" stroke="${theme.glow}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <polygon points="72,40 64,40 72,48" fill="${theme.glow}" />
    `;
  } else if (cleanSlug.includes('outreach') || cleanSlug.includes('sales')) {
    glyphContent = `
      <!-- High-Conversion Outreach Rocket & Target -->
      <path d="M34 68L94 34L60 94L54 74Z" fill="${theme.accent}" />
      <path d="M94 34L54 74" stroke="#ffffff" stroke-width="3" />
      <circle cx="86" cy="82" r="12" fill="none" stroke="${theme.glow}" stroke-width="3" stroke-dasharray="4 4" />
      <circle cx="86" cy="82" r="4" fill="${theme.glow}" />
    `;
  } else if (cleanSlug.includes('hook') || cleanSlug.includes('video')) {
    glyphContent = `
      <!-- Retention Pattern Interrupt Hook & Play -->
      <polygon points="46,38 90,64 46,90" fill="${theme.accent}" />
      <path d="M34 40C26 52 26 76 34 88" fill="none" stroke="${theme.glow}" stroke-width="5" stroke-linecap="round" />
      <path d="M98 48C104 56 104 72 98 80" fill="none" stroke="${theme.glow}" stroke-width="5" stroke-linecap="round" />
    `;
  } else if (cleanSlug.includes('music') || cleanSlug.includes('suno')) {
    glyphContent = `
      <!-- Audio Spectrum & Eighth Note -->
      <rect x="32" y="60" width="8" height="24" rx="4" fill="${theme.accent}" />
      <rect x="46" y="44" width="8" height="40" rx="4" fill="${theme.glow}" />
      <rect x="60" y="32" width="8" height="52" rx="4" fill="#ffffff" />
      <rect x="74" y="50" width="8" height="34" rx="4" fill="${theme.glow}" />
      <rect x="88" y="64" width="8" height="20" rx="4" fill="${theme.accent}" />
    `;
  } else if (cleanSlug.includes('antislop')) {
    glyphContent = `
      <!-- Contrast & Anti-Slop Hygiene Gauge -->
      <circle cx="64" cy="64" r="30" fill="none" stroke="${theme.accent}" stroke-width="6" />
      <path d="M64 34C80.5 34 94 47.5 94 64C94 80.5 80.5 94 64 94Z" fill="${theme.accent}" />
      <circle cx="64" cy="49" r="6" fill="#09131f" />
      <circle cx="64" cy="79" r="6" fill="#ffffff" />
    `;
  } else {
    // Dynamic universal monogram emblem based on first characters of title
    const initials = (title || slug)
      .split(/[\s-_]+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('');

    glyphContent = `
      <!-- Universal Agent Emblem -->
      <polygon points="64,32 94,50 94,78 64,96 34,78 34,50" fill="none" stroke="${theme.accent}" stroke-width="5" stroke-linejoin="round" />
      <circle cx="64" cy="64" r="16" fill="${theme.accent}" opacity="0.3" />
      <text x="64" y="71" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="1">
        ${initials || 'AG'}
      </text>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_${cleanSlug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}" />
      <stop offset="100%" stop-color="${theme.bg2}" />
    </linearGradient>
    <linearGradient id="accent_${cleanSlug}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}" />
      <stop offset="100%" stop-color="${theme.glow}" />
    </linearGradient>
    <filter id="glow_${cleanSlug}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Squircle App Icon Base -->
  <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#bg_${cleanSlug})" stroke="rgba(255,255,255,0.12)" stroke-width="2" />

  <!-- Ambient Rim Glow -->
  <rect x="6" y="6" width="116" height="116" rx="26" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.35" />

  <!-- Foreground Aligned Emblem -->
  <g filter="url(#glow_${cleanSlug})">
    ${glyphContent}
  </g>
</svg>`.trim();
};

/**
 * Generates an aligned vector SVG logo using Universal AI.
 */
export const generateSkillLogoSvgWithUniversalAI = async (
  input: SkillLogoInput
): Promise<string> => {
  const { slug, title, category, pillar = 'develop', description = '', language = 'id' } = input;
  const isId = language === 'id';

  const systemInstruction = isId
    ? `Anda adalah Principal Vector Icon Designer dan Brand Architect untuk AI Agent Skills. Tugas Anda adalah merancang logo vektor SVG 1:1 (viewBox 0 0 128 128) yang modern, berwibawa, dan selaras dengan domain fungsional skill tersebut.
ATURAN MUTLAK:
1. Kembalikan HANYA kode SVG murni tanpa pembungkus markdown (\`\`\`xml atau \`\`\`svg), tanpa penjelasan.
2. SVG wajib memiliki atribut: viewBox="0 0 128 128" dan xmlns="http://www.w3.org/2000/svg".
3. Latar belakang wajib berupa squircle modern (<rect x="4" y="4" width="120" height="120" rx="28" ...>) dengan gradien linier gelap elegan.
4. Gunakan palet warna yang selaras dengan pilar ekosistem:
   - Develop: Slate gelap dengan aksen neon emerald (#10b981) dan cyan (#06b6d4).
   - Grow: Navy gelap dengan aksen royal blue (#3b82f6) dan violet (#8b5cf6).
   - Operate: Bronze gelap dengan aksen warm amber (#f59e0b) dan gold (#fbbf24).
   - Create: Obsidian gelap dengan aksen fuchsia (#d946ef) dan neon coral (#f43f5e).
5. Buat elemen ikon vektor geometris di tengah (paths, shapes, polylines) yang melambangkan fungsi utama skill.
6. DILARANG menggunakan tag <script> atau teks panjang.
7. Pastikan kontras tinggi dan estetika aplikasi modern.`
    : `You are an elite Vector Icon Designer and Brand Architect for AI Agent Skills. Your mission is to craft a modern, premium 1:1 SVG vector icon (viewBox 0 0 128 128) that strictly aligns with the skill domain and ecosystem pillar.
STRICT RULES:
1. Return ONLY pure SVG code without markdown blocks (\`\`\`xml or \`\`\`svg), without commentary.
2. Mandatory attributes: viewBox="0 0 128 128" and xmlns="http://www.w3.org/2000/svg".
3. Background must be a squircle (<rect x="4" y="4" width="120" height="120" rx="28" ...>) with a dark linear gradient.
4. Color palette aligned with ecosystem pillar:
   - Develop: Dark slate with neon emerald (#10b981) and cyan (#06b6d4).
   - Grow: Dark navy with royal blue (#3b82f6) and violet (#8b5cf6).
   - Operate: Dark bronze with warm amber (#f59e0b) and gold (#fbbf24).
   - Create: Dark obsidian with vibrant fuchsia (#d946ef) and neon coral (#f43f5e).
5. Clean, centered geometric vector glyphs symbolizing the core capability.
6. NO <script> tags or long text. High contrast and modern app icon aesthetics.`;

  const prompt = isId
    ? `Nama Slug Skill: "${slug}"
Judul Skill: "${title}"
Kategori: "${category}"
Pilar Ekosistem: "${pillar}"
Deskripsi Singkat: "${description.slice(0, 300)}"

Rancang SATU logo vektor SVG mandiri 128x128 berestetika modern squircle yang selaras dengan spesifikasi skill di atas.
Kembalikan HANYA tag <svg> hingga </svg> murni:`
    : `Skill Slug: "${slug}"
Skill Title: "${title}"
Category: "${category}"
Ecosystem Pillar: "${pillar}"
Brief Description: "${description.slice(0, 300)}"

Design ONE standalone modern squircle vector SVG logo (128x128) aligned with this skill specification.
Return ONLY raw <svg> to </svg> markup:`;

  try {
    const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
    const sanitized = sanitizeSvgMarkup(raw);
    if (sanitized && sanitized.startsWith('<svg') && sanitized.endsWith('</svg>')) {
      return sanitized;
    }
    return generateAlignedSkillLogoSvg(input);
  } catch (err) {
    console.warn('AI logo generation fallback to deterministic emblem:', err);
    return generateAlignedSkillLogoSvg(input);
  }
};

/**
 * Rasterizes an SVG string into a high-resolution PNG Data URL via client-side HTML5 Canvas.
 * Supports high-smoothing quality, transparent or solid squircle boundaries, and 0 external dependencies.
 */
export const renderSvgToPngDataUrl = async (
  svgString: string,
  width = 512,
  height = 512
): Promise<string> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Canvas rasterization requires a browser window environment');
  }

  const sanitized = sanitizeSvgMarkup(svgString);
  if (!sanitized) {
    throw new Error('Empty or invalid SVG markup provided for rasterization');
  }

  return new Promise((resolve, reject) => {
    let objectUrl = '';
    try {
      const blob = new Blob([sanitized], { type: 'image/svg+xml;charset=utf-8' });
      objectUrl = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Canvas 2D context unavailable'));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const pngDataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(objectUrl);
          resolve(pngDataUrl);
        } catch (canvasErr) {
          URL.revokeObjectURL(objectUrl);
          reject(canvasErr);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load SVG into raster Image element'));
      };

      img.src = objectUrl;
    } catch (err) {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(err);
    }
  });
};

/**
 * Converts a PNG or base64 Data URL to raw Uint8Array binary bytes.
 */
export const dataUrlToUint8Array = (dataUrl: string): Uint8Array => {
  const marker = ';base64,';
  const markerIndex = dataUrl.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error('Invalid Data URL: missing base64 marker');
  }
  const base64Data = dataUrl.slice(markerIndex + marker.length);
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Rasterizes an SVG string and returns raw PNG Uint8Array bytes directly.
 */
export const renderSvgToPngBytes = async (
  svgString: string,
  width = 512,
  height = 512
): Promise<Uint8Array> => {
  const dataUrl = await renderSvgToPngDataUrl(svgString, width, height);
  return dataUrlToUint8Array(dataUrl);
};

