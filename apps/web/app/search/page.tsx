'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch, usePlaybackAction } from '@/lib/audio/hooks';
import { SearchBox, SearchResults } from '@m7/audio-os/feature/search';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearch(query);
  const action = usePlaybackAction();

  const tracks = data?.pages.flatMap((p) => p.tracks) ?? [];

  return (
    <div className="px-6 py-5 max-w-2xl">
      <h1 className="text-xl font-bold text-dark mb-4">Search</h1>

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
    </div>
  );
}
