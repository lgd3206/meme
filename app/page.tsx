import { headers, cookies } from 'next/headers';
import { LanguageProvider, type Language } from '@/contexts/LanguageContext';
import HomeClient from './HomeClient';

type SearchParams = {
  lang?: string | string[];
};

function normalizeLanguage(value: unknown): Language | undefined {
  if (value === 'zh' || value === 'en') return value;
  if (Array.isArray(value)) return normalizeLanguage(value[0]);
  return undefined;
}

function languageFromAcceptLanguage(acceptLanguage: string | null): Language {
  if (!acceptLanguage) return 'en';
  return acceptLanguage.toLowerCase().includes('zh') ? 'zh' : 'en';
}

export default async function Home({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const paramLanguage = normalizeLanguage(resolvedSearchParams?.lang);

  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLanguage = normalizeLanguage(cookieStore.get('language')?.value);
  const headerLanguage = languageFromAcceptLanguage(headerStore.get('accept-language'));

  const initialLanguage = paramLanguage ?? cookieLanguage ?? headerLanguage;

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <HomeClient />
    </LanguageProvider>
  );
}
