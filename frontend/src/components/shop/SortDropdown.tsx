'use client';

export function SortDropdown({ value = 'newest', onChange }: { value?: string; onChange?: (value: string) => void }) {
  return (
    <label className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.18em]">
      Sort
      <select value={value} onChange={(event) => onChange?.(event.target.value)} className="border border-mist bg-transparent px-3 py-2 normal-case tracking-normal">
        <option value="newest">Newest</option>
        <option value="price-asc">Price ascending</option>
        <option value="price-desc">Price descending</option>
      </select>
    </label>
  );
}
