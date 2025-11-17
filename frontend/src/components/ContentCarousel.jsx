import React from 'react';

export default function ContentCarousel({ title, items=[] }){
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-3">
        {items.map((s) => (
          <div key={s._id} className="min-w-[200px]">
            <img src={s.poster} alt={s.title} className="w-full h-32 object-cover rounded" />
            <div className="mt-2 text-sm">{s.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
