import React from 'react';

const PokemonResult = ({ name, search, onClick }) => {
  const splitName = name.split(search);
  return (
    <h3 onClick={onClick}>
      {splitName[0]}
      <span className="match">{search}</span>
      {splitName[1]}
    </h3>
  );
};

export default PokemonResult;