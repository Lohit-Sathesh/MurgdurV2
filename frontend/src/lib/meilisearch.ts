import { MeiliSearch } from 'meilisearch';
export const meilisearch = new MeiliSearch({ host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700', apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_KEY });
