import React, { useEffect, useState } from 'react';
import API from '../api';
import ContentCarousel from '../components/ContentCarousel';
import HeroCarousel from '../components/HeroCarousel';

export default function Browse(){
  const [shows, setShows] = useState([]);
  useEffect(()=> {
    API.get('/shows')
      .then(r=> setShows(r.data))
      .catch(err => console.error('fetch shows err', err));
  },[]);

  const hero = shows[0] ? { title: shows[0].title, video: shows[0].heroVideo, poster: shows[0].poster } : null;

  return (
    <div>
      {hero && <HeroCarousel hero={hero} />}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-3">Top Picks</h2>
        <ContentCarousel items={shows} />
      </div>
    </div>
  );
}
