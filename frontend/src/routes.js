import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Index from './pages/Index';
import PokemonLanding from './pages/PokemonLanding';

function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Index} />
      <Route path="/addLesson" component={PokemonLanding} />
    </BrowserRouter>
  )
}

export default Routes;