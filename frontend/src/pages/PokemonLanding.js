import React, { useState, useEffect } from 'react';
import useQuery from '../utils/useQuery'

import PokemonLogin from './PokemonLogin';
import PokemonLessons from './PokemonLessons';

import '../styles/pokemon.css';

const PokemonLanding = () => {
  const [ {result, isLoading}, runQuery ] = useQuery()

  useEffect(() => {
    (async function() {
      await runQuery('{user {name, image}}');
    })();
  }, []);

  if (isLoading) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      {result.user ? <PokemonLessons name={result.user.name} image={result.user.image} /> : <PokemonLogin />}
    </main>
  );
};

export default PokemonLanding;
