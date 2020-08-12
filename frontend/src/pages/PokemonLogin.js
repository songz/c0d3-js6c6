import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useDebounce from '../utils/useDebounce';
import useQuery from '../utils/useQuery';
import PokemonSelection from '../components/PokemonSelection';
import PokemonResult from '../components/PokemonResult';

const PokemonLogin = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState({});
  const [{ result }, runQuery] = useQuery();

  const debouncedSearch = useDebounce(search, 500);
  const history = useHistory();

  const handleLoadSelection = async (name) => {
    await runQuery(`{getPokemon(str:"${name}"){name, image}}`);
    setSelected(result.getPokemon);
    setResults([]);
  };

  const handleLogin = async () => {
    await runQuery(`{login (pokemon: "${selected.name}") {name}}`);
    history.go();
  };

  useEffect(
    () => {
      async function fetchData() {
        // Make sure we have a value (user has entered something in input)
        if (debouncedSearch) {
          // Fire off our API call
          await runQuery(`{search(str: "${search}") {name}}`);
          setResults(result.search || []);
        } else {
          setResults([]);
        }
      }
      fetchData();
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
        {results.map((result) => {
          return (
            <PokemonResult
              key={result.name}
              name={result.name}
              search={search}
              onClick={() => handleLoadSelection(result.name)}
            />
          );
        })}
      </div>
      {selected.name && (
        <div>
          <PokemonSelection name={selected.name} image={selected.image} />
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default PokemonLogin;
