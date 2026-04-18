'use client';

import { usePlaybackAction, useSearch } from '@/lib/audio/hooks';
import { SearchResults } from '@m7/audio-os/feature/search';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearch(query);
  const action = usePlaybackAction();

  const tracks = data?.pages.flatMap((p) => p.tracks) ?? [];

  return (
    <div className="px-6 py-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-dark mb-6">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>

      {isFetching && !isFetchingNextPage && (
        <p className="text-lg text-charcoal/50 px-3">Searching…</p>
      )}

      {!isFetching && query && (
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

      {!query && (
        <p className="text-lg text-charcoal/50">Type something in the search bar above.</p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}
