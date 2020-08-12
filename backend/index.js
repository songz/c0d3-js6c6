const express = require('express');
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schema');
const { createPokemonStore, createUserStore } = require('./utils');
const LessonAPI = require('./datasources/lessons');
const PokemonAPI = require('./datasources/pokemon');
const UserAPI = require('./datasources/user');

const pokemonStore = createPokemonStore();
const userStore = createUserStore();

const app = express();
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs,
  resolvers,
  dataSources: () => ({
    lessonAPI: new LessonAPI(),
    pokemonAPI: new PokemonAPI(pokemonStore),
    userAPI: new UserAPI(userStore),
  }),
  context: ({ req }) => ({ session: req.session }),
});

server.applyMiddleware({ app });
app.get('/*', (req, res) => res.sendFile(path.resolve(__dirname, 'public', 'index.html')));
app.listen({ port: process.env.PORT || 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
