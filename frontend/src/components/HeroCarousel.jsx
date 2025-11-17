import React, { useRef } from 'react';

export default function HeroCarousel({ hero }){
  const vref = useRef();
  return (
    <div className="w-full relative h-[56vh] bg-black">
      <video ref={vref} autoPlay muted loop playsInline className="w-full h-full object-cover">
        <source src={hero.video} type="video/mp4" />
      </video>
      <div className="absolute bottom-10 left-10 max-w-lg">
        <h1 className="text-4xl font-bold">{hero.title}</h1>
        <p className="mt-2 text-sm">{/* short desc if available */}</p>
        <div className="mt-4 space-x-3">
          <button className="px-4 py-2 bg-white text-black rounded">Play</button>
          <button className="px-4 py-2 bg-gray-700 rounded">More info</button>
        </div>
      </div>
    </div>
  );
}
