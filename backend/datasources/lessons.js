const { RESTDataSource } = require('apollo-datasource-rest');

class LessonAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://c0d3.com/api/';
  }

  async getLessons() {
    return this.get('lessons');
  }
}

module.exports = LessonAPI;
