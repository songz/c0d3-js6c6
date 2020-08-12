import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import PokemonLanding from './pages/PokemonLanding';

function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={PokemonLanding} />
    </BrowserRouter>
  )
}

export default Routes;