'use client';

import { SearchField, Label } from '@m7/audio-os/ui/primitives';
import { useEffect, useRef, useState } from 'react';

interface SearchBoxProps {
  value: string;
  onChange: (q: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(val: string) {
    setLocal(val);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(val), 300);
  }

  return (
    <SearchField
      value={local}
      onChange={handleChange}
      onClear={() => handleChange('')}
      className="w-full"
    >
      <Label className="sr-only">Search tracks</Label>
    </SearchField>
  );
}
