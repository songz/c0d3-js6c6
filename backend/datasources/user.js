const { DataSource } = require('apollo-datasource');
const { v4: uuidv4 } = require('uuid');

/**
 * Class to resolve the queries for the users
 */
class UserAPI extends DataSource {
  constructor(store) {
    super();
    this.store = store;
  }

  /**
   * Gets the context from Apollo to identify the user by the session id
   * @param {object} config - Object containing the context from Apollo Server
   */
  initialize(config) {
    this.session = config.context.session;
  }

  getUser() {
    return this.store[this.session.userid];
  }

  login(pokemon) {
    if (!this.session.userid) {
      this.session.userid = uuidv4();
    }
    const { userid } = this.session;
    return this.store.login(userid, pokemon);
  }

  enroll(title) {
    return this.store.enroll(this.session.userid, title);
  }

  unenroll(title) {
    return this.store.unenroll(this.session.userid, title);
  }

  rate(title, rating) {
    return this.store.rate(this.session.userid, title, rating);
  }
}

module.exports = UserAPI;
