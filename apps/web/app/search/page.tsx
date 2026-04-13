'use client';

import { useState } from 'react';
import { useSearch, usePlaybackAction } from '@/lib/audio/hooks';
import { SearchBox } from '@/components/search/SearchBox';
import { SearchResults } from '@/components/search/SearchResults';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearch(query);
  const action = usePlaybackAction();

  const tracks = data?.pages.flatMap((p) => p.tracks) ?? [];

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-dark mb-6">Search</h1>

      <SearchBox value={query} onChange={setQuery} />

      <div className="mt-4">
        {isFetching && !isFetchingNextPage && (
          <p className="text-sm text-charcoal/50 px-3">Searching…</p>
        )}
        {!isFetching && data && (
          <SearchResults
            tracks={tracks}
            query={query}
            onPlayTrack={(uri) => action.mutate({ action: 'playTrack', uri })}
            onAddToQueue={(uri) => action.mutate({ action: 'addToQueue', uri })}
            hasMore={hasNextPage}
            onLoadMore={fetchNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        )}
      </div>
    </main>
  );
}
