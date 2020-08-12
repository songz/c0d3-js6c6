const { gql } = require('apollo-server-express');

module.exports.typeDefs = gql`
  type Lesson {
    title: String
  },

  type BasicPokemon {
    name: String
  },

  type Pokemon {
    name: String!
    image: String
  },

  type User {
    name: String!
    image: String
    lessons: [Lesson]
  },

  type Query {
    lessons: [Lesson]
    search(str: String!): [BasicPokemon]
    getPokemon(str: String!): Pokemon
    user: User
    login(pokemon: String!): User
  },

  type Mutation {
    enroll(title: String!): User
    unenroll(title: String!): User
  }
`;

module.exports.resolvers = {
  Query: {
    lessons: async (_, __, { dataSources }) => dataSources.lessonAPI.getLessons(),
    search: async (_, { str }, { dataSources }) => dataSources.pokemonAPI.searchPokemon(str),
    getPokemon: async (_, { str }, { dataSources }) => dataSources.pokemonAPI.getPokemon(str),
    user: async (_, __, { dataSources }) => dataSources.userAPI.getUser(),
    login: async (_, { pokemon }, { dataSources }) => {
      const pokemonData = await dataSources.pokemonAPI.getPokemon(pokemon);
      return dataSources.userAPI.login(pokemonData);
    },
  },
  Mutation: {
    enroll: async (_, { title }, { dataSources }) => dataSources.userAPI.enroll(title),
    unenroll: async (_, { title }, { dataSources }) => dataSources.userAPI.unenroll(title),
  },
};
