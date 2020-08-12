/**
 * Create an object to store the pokemon list
 */
module.exports.createPokemonStore = () => {
  const pokemons = {};

  pokemons.list = null;

  /**
   * Searches the pokemon list and returns an array with all the matches
   * @param {string} name - Pokemon name
   * @returns {array} list of pokemons that match the name
   */
  pokemons.search = (name) => {
    if (!pokemons.list) return [];
    return pokemons.list.filter((pokemon) => pokemon.name.includes(name));
  };

  return pokemons;
};

/**
 * Create an object to store users by ID
 */
module.exports.createUserStore = () => {
  const users = {};

  /**
   * Store the new user information
   * @param {string} id - UUID for the user
   * @param {object} pokemon - User pokemon info
   */
  users.login = (id, pokemon) => {
    if (!users[id]) {
      users[id] = {
        name: pokemon.name,
        image: pokemon.image,
        lessons: [],
      };
    }
    return users[id];
  };

  /**
   * Enroll user in the lesson
   * @param {string} id - UUID for the user
   * @param {string} title - Lesson title
   */
  users.enroll = (id, title) => {
    if (!users[id].lessons.find((lesson) => lesson.title === title)) {
      users[id].lessons.push({ title });
    }
    return users[id];
  };

  /**
   * Unenroll user from the lesson
   * @param {string} id - UUID for the user
   * @param {string} title - Lesson title
   */
  users.unenroll = (id, title) => {
    const index = users[id].lessons.findIndex((lesson) => lesson.title === title);
    users[id].lessons.splice(index, 1);
    return users[id];
  };

  return users;
};
