/** Finds a simple encyclopedia article for a topic: Klexikon (children's wiki) first, then German Wikipedia. */

export interface Source {
  site: 'Klexikon' | 'Wikipedia';
  title: string;
  url: string;
  text: string;
}

const SITES = [
  { site: 'Klexikon' as const, api: 'https://klexikon.zum.de/api.php', page: 'https://klexikon.zum.de/wiki/', intro: false },
  { site: 'Wikipedia' as const, api: 'https://de.wikipedia.org/w/api.php', page: 'https://de.wikipedia.org/wiki/', intro: true },
];

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export async function fetchSource(query: string, maxChars = 4000): Promise<Source | null> {
  for (const s of SITES) {
    try {
      const search = (await getJson(
        `${s.api}?${new URLSearchParams({ action: 'query', list: 'search', srsearch: query, srlimit: '1', format: 'json', origin: '*' })}`,
      )) as { query?: { search?: { title: string }[] } };
      const title = search.query?.search?.[0]?.title;
      if (!title) continue;
      const params: Record<string, string> = { action: 'query', prop: 'extracts', explaintext: '1', titles: title, format: 'json', origin: '*', redirects: '1' };
      if (s.intro) params.exintro = '1';
      const data = (await getJson(`${s.api}?${new URLSearchParams(params)}`)) as { query?: { pages?: Record<string, { extract?: string }> } };
      const text = Object.values(data.query?.pages ?? {})[0]?.extract?.trim();
      if (!text || text.length < 200) continue;
      return { site: s.site, title, url: s.page + encodeURIComponent(title.replace(/ /g, '_')), text: text.slice(0, maxChars) };
    } catch {
      // try the next site
    }
  }
  return null;
}
