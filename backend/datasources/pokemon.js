const { RESTDataSource } = require('apollo-datasource-rest');

/**
 * Class to resolve the queries for the pokeAPI
 */
class PokemonAPI extends RESTDataSource {
  constructor(store) {
    super();
    this.baseURL = 'https://pokeapi.co/api/v2/';
    this.store = store;
    this.getPokemons();
  }

  /**
   * Fetch the pokemon list and cache it in the store object.
   */
  async getPokemons() {
    if (!this.store.list) {
      const count = await this.get('pokemon').then((data) => data.count);
      this.store.list = await this.get('pokemon', { limit: count }).then((data) => data.results);
    }
  }

  searchPokemon(name) {
    return this.store.search(name);
  }

  /**
   * Get the data for a single pokemon from PokeAPI.
   * @param {string} name - Fetch data for a single pokemon
   * @returns {object} Object with pokemon name and image
   */
  async getPokemon(name) {
    const pokemon = await this.get(`pokemon/${name}`);
    return {
      name: pokemon.name,
      image: pokemon.sprites.front_default,
    };
  }
}

module.exports = PokemonAPI;
