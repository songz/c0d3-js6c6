import React from 'react';

const PokemonSelection = ({ name, image }) => {
  return (
    <div className="selectedSection">
      <h1>{name}</h1>
      <img src={image} alt={name} />
    </div>
  );
};

export default PokemonSelection;
