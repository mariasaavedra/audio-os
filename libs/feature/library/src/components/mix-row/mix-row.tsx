'use client';

import type { TidalMixSummary } from '@m7/audio-os/shared/types';
import { Skeleton } from '@m7/audio-os/ui/primitives';

interface MixRowProps {
  title: string;
  mixes: TidalMixSummary[];
  hrefFor: (mix: TidalMixSummary) => string;
  renderLink: (props: { href: string; className?: string; children: React.ReactNode }) => React.ReactNode;
}

export function MixRow({ title, mixes, hrefFor, renderLink }: MixRowProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {mixes.map((mix) => (
          <div key={mix.uri} className="w-44 shrink-0">
            {renderLink({
              href: hrefFor(mix),
              className: 'group flex flex-col gap-2',
              children: (
                <>
                  <div className="aspect-square w-full overflow-hidden rounded-md border border-border bg-muted">
                    {mix.artworkUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mix.artworkUrl}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="truncate text-sm font-medium text-foreground">{mix.name}</span>
                    {mix.subtitle && (
                      <span className="line-clamp-2 text-xs text-muted-foreground">{mix.subtitle}</span>
                    )}
                  </div>
                </>
              ),
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export function MixRowSkeleton({ title }: { title: string }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="flex w-44 shrink-0 flex-col gap-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}
