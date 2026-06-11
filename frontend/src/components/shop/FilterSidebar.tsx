'use client';

const categories = ['atelier-leather', 'evening-objects', 'travel-icons'];

export function FilterSidebar({ selected, onSelect }: { selected?: string; onSelect?: (category: string) => void }) {
  return (
    <aside className="grid h-fit gap-3 border-r border-mist pr-6 text-sm uppercase tracking-[0.18em]">
      {categories.map((category) => (
        <button key={category} className={selected === category ? 'text-champagne' : 'text-ink'} onClick={() => onSelect?.(category)}>{category.replaceAll('-', ' ')}</button>
      ))}
    </aside>
  );
}
