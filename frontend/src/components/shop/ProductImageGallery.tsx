'use client';

import { useState } from 'react';

export function ProductImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(images[0]);
  return (
    <div className="grid gap-4">
      <div className="aspect-[4/5] bg-mist">
        {active ? <img src={active} alt={name} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => (
          <button key={image} onClick={() => setActive(image)} className="aspect-square border border-mist">
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
