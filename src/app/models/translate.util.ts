// Utility function to translate a key using translations.json
// @ts-ignore: allow importing JSON without enabling resolveJsonModule in tsconfig
import translations from '../../assets/i18n/translations.json';

export function translate(key: string, lang: string = 'gr'): string {
  if (!key) return '';
  const entry = (translations as any)[key];
  if (!entry) return key;
  return entry[lang] || key;
}
