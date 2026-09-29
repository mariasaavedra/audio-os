'use client';

import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@m7/audio-os/shared/utils';
import * as React from 'react';
import { Input } from '../input';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  children?: React.ReactNode;
}

function SearchField({ value, onChange, onSubmit, onClear, className, children }: SearchFieldProps) {
  const id = React.useId();

  return (
    <div data-slot="search-field" className={cn('relative flex items-center', className)}>
      {/* Label is passed as a child and wired to the input via htmlFor */}
      {React.Children.map(children, (child) =>
        React.isValidElement<{ htmlFor?: string }>(child) ? React.cloneElement(child, { htmlFor: id }) : child,
      )}
      <HugeiconsIcon
        icon={Search01Icon}
        size={16}
        className="pointer-events-none absolute left-0 text-muted-foreground"
      />
      <Input
        id={id}
        type="search"
        value={value}
        placeholder="Search"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit?.(value);
          if (e.key === 'Escape' && value) onClear?.();
        }}
        className="pl-6 pr-6 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onClear?.()}
          className="absolute right-0 text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </button>
      )}
    </div>
  );
}

export { SearchField };
