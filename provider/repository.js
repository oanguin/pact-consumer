// Simple object repository
class Repository {
  constructor() {
    this.entities = [];
  }

  fetchAll() {
    return this.entities;
  }

  getByEmail(email) {
    return this.entities.find((entity) => entity.email == email);
  }

  insert(entity) {
    this.entities.push(entity);
  }

  clear() {
    this.entities = [];
  }
}

module.exports = Repository;
