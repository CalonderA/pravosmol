import { useEffect } from 'react';

/** Аккуратное обновление title / description для каждой страницы (SEO без перезагрузки). */
export function useSeo(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', description);
    }
  }, [title, description]);
}
