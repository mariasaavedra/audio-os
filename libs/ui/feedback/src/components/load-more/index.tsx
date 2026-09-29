'use client';

import { Button } from '@m7/audio-os/ui/primitives';
import { cn } from '@m7/audio-os/shared/utils';
import { Spinner } from '../spinner';

interface LoadMoreProps {
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export function LoadMore({ hasMore, isLoading, onLoadMore, className }: LoadMoreProps) {
  if (!hasMore) return null;
  return (
    <div className={cn('flex justify-center mt-2', className)}>
      {isLoading ? (
        <Spinner />
      ) : (
        <Button variant="ghost" onClick={onLoadMore}>
          Load more
        </Button>
      )}
    </div>
  );
}
