import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useDebounce from '../utils/useDebounce';
import useQuery from '../utils/useQuery';
import PokemonSelection from '../components/PokemonSelection';
import PokemonResult from '../components/PokemonResult';

const PokemonLogin = () => {
  const [search, setSearch] = useState('');
  const [{ result }, runQuery] = useQuery();

  const debouncedSearch = useDebounce(search, 500);
  const history = useHistory();

  const handleLogin = async () => {
    await runQuery(`{login (pokemon: "${result.getPokemon.name}") {name}}`);
    history.go();
  };

  useEffect(
    () => {
      (async function() {
        // Make sure we have a value (user has entered something in input)
        if (debouncedSearch) {
          // Fire off our API call
          await runQuery(`{search(str: "${search}") {name}}`);
        }
      })()
    },
    // execute if (search) hasn't changed for more than 500ms.
    [debouncedSearch]
  );

  return (
    <div>
      <h1>Pokemon Search</h1>
      <input className="searchBox" type="text" onChange={(e) => setSearch(e.target.value)} />
      <hr />
      <div className="suggestions">
        {result.search && result.search.map((pokemon) => {
          return (
            <PokemonResult
              key={pokemon.name}
              name={pokemon.name}
              search={search}
              onClick={() => runQuery(`{getPokemon(str:"${pokemon.name}"){name, image}}`)}
            />
          );
        })}
      </div>
      {result.getPokemon && (
        <div>
          <PokemonSelection name={result.getPokemon.name} image={result.getPokemon.image} />
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default PokemonLogin;
