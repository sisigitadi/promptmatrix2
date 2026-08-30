import { TranslationKey, Translations, Language } from './types';
import { allTranslations } from './translations';

const getTranslatedName = (key: string, lang: 'id' | 'en'): string => {
  const translationSet = lang === 'id' ? allTranslations.id : allTranslations.en;
  const value = translationSet[key];
  if (typeof value === 'string') {
    return value;
  }
  return key;
};

export const standardTextToolLinks = [
  { name: 'ChatGPT (OpenAI)', url: 'https://chat.openai.com/' },
  { name: 'Gemini (Google)', url: 'https://gemini.google.com/app' },
  { name: 'Copilot (Microsoft)', url: 'https://copilot.microsoft.com/' },
  { name: 'Claude (Anthropic)', url: 'https://claude.ai/chats/' },
  { name: 'Perplexity AI', url: 'https://www.perplexity.ai/' },
  { name: 'Meta AI', url: 'https://www.meta.ai/' },
  { name: 'Jasper', url: 'https://app.jasper.ai/' },
  { name: 'Copy.ai', url: 'https://app.copy.ai/' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com/' },
  { name: 'Blackbox AI', url: 'https://www.blackbox.ai/' },
];

export const mergeAndSortTextToolLinks = (existingLinks: { name:string; url: string }[] = []) => {
  const finalLinks = [...standardTextToolLinks];
  const standardUrls = new Set(standardTextToolLinks.map(link => link.url));
  const uniqueExistingLinks = existingLinks
    .filter(link => !standardUrls.has(link.url))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...finalLinks, ...uniqueExistingLinks];
};

export const standardImageVideoAlternatives = [
  { name: 'Leonardo.Ai', url: 'https://app.leonardo.ai/' },
  { name: 'Playground AI', url: 'https://playground.com/' },
  { name: 'RunwayML (Gen-2, etc.)', url: 'https://app.runwayml.com/' },
  { name: 'Pika Labs', url: 'https://pika.art/' },
  { name: 'Adobe Firefly', url: 'https://firefly.adobe.com/' },
  { name: 'Canva Magic Media', url: 'https://www.canva.com/ai-image-generator/' },
  { name: 'Clipdrop (Stability AI Tools)', url: 'https://clipdrop.co/tools' },
  { name: 'Ideogram', url: 'https://ideogram.ai/' },
  { name: 'Kaiber.ai', url: 'https://kaiber.ai/' },
  { name: 'NightCafe Creator', url: 'https://creator.nightcafe.studio/' }
].sort((a, b) => a.name.localeCompare(b.name));

export const standardMusicAlternatives = [
  { name: 'Udio', url: 'https://www.udio.com/' },
  { name: 'Stable Audio (Stability AI)', url: 'https://stableaudio.com/' },
  { name: 'Mubert', url: 'https://mubert.com/render' },
  { name: 'Suno AI', url: 'https://suno.com/'},
  { name: 'Google MusicFX (AI Test Kitchen)', url: 'https://aitestkitchen.withgoogle.com/tools/music-fx' }
].sort((a, b) => a.name.localeCompare(b.name));

export const createMediaMusicToolLinks = (
  officialFrameworkShortNameKey: TranslationKey,
  officialFrameworkUrl: string | undefined,
  alternativeTools: { name: string; url: string }[],
  lang: 'id' | 'en' // Language parameter for correct translation
) => {
  const links: { name: string; url: string }[] = [];
  const urlsPresent = new Set<string>();

  const translatedShortName = getTranslatedName(officialFrameworkShortNameKey, lang);
  const translatedSuffix = getTranslatedName('officialPlatformSuffix' as TranslationKey, lang);

  if (officialFrameworkUrl) {
    links.push({ name: `${translatedShortName} ${translatedSuffix}`, url: officialFrameworkUrl });
    urlsPresent.add(officialFrameworkUrl);
  }

  alternativeTools.forEach(altTool => {
    if (!urlsPresent.has(altTool.url)) {
      links.push(altTool);
      urlsPresent.add(altTool.url);
    }
  });
  return links.sort((a, b) => a.name.localeCompare(b.name));
};
