import { MopidyClient } from '../client';
import { MopidyImageRaw, MopidyRefRaw, MopidySearchResultRaw } from '../rpc/methods';

export interface LibraryService {
  browse(uri?: string | null): Promise<MopidyRefRaw[]>;
  getImages(uris: string[]): Promise<Record<string, MopidyImageRaw[]>>;
  search(
    query: Record<string, string[]>,
    uris?: string[] | null,
    exact?: boolean | null,
  ): Promise<MopidySearchResultRaw[]>;
}

export const createLibraryService = (client: MopidyClient): LibraryService => {
  return {
    async browse(uri) {
      return client.call('core.library.browse', { uri: uri ?? null });
    },

    async getImages(uris) {
      return client.call('core.library.get_images', { uris });
    },

    async search(query, uris, exact) {
      return client.call('core.library.search', {
        query,
        uris: uris ?? null,
        exact: exact ?? null,
      });
    },
  };
};
