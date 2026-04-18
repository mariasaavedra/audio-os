'use client';

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setLocal(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), 300);
  }

  return (
    <input
      type="search"
      value={local}
      onChange={handleChange}
      placeholder="Search tracks…"
      className="w-full rounded-xl px-4 py-2.5 text-sm bg-charcoal/10 text-dark placeholder:text-charcoal/40 outline-none focus:ring-2 focus:ring-brand/40"
    />
  );
}
