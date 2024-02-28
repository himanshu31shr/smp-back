const master = require('../models');
const { ValidationError, ConfigError } = require('./exceptions');

/**
 * Abstract repositiry for providing common crud functions to other extended repositories
 *
 * @requires {Class} Another class to extends this class. Cannot be used seperately
 */
module.exports = class AbstractRepository {

  /**
   * Instance of the SQL model.
   */
  model;

  models = master;

  /**
   * Relations collections.
   */
  relations = [];

  /**
   * Locked properties
   */
  locked = ['password'];

  constructor() {
    this._bindModel();
    this._mutator = this._mutator.bind(this);
  }

  /**
   * Binds relations on the model on current object
   *
   * @param {Object} relations
   */
  setRelations() {
    return [];
  }

  /**
   * Binds model to the current object.
   */
  _bindModel() {
    const modelName = this.setModel();
    const relations = this.setRelations();

    if (!modelName) {
      throw new ConfigError('Please set a model to this repository!');
    }

    relations.map(relation => {
      if (master[relation]) {
        this.relations.push({
          model: master[relation]
        });
      }
    });

    this.model = master[modelName];
    return this.model;
  }

  /**
   * Function to define the model
   *
   * @returns {String} Name of file with target model.
   */
  setModel() { }

  /**
   * Finds all data with the specified filters
   *
   * @param {Object} Filters Object containing key value pairs for matching the modal
   * @returns {Array}
   *
   */
  findAll(options = null) {

    if (this.relations.length) {
      options.include = this.relations;
    }

    return this.model.findAll({
      attributes: {
        exclude: this.locked
      },
      ...(options || {})
    })
      .then(this._mutator)
  }


  /**
   * Find single object with specified filters.
   *
   * @param {Object} filter Object containing key value pairs for matching the modal
   * @returns {Object|Boolean}
   *
   */
  findOne(options, transaction = {}) {
    if (this.relations.length) {
      options.include = this.relations;
    }
    return this.model.findOne({
      attributes: {
        exclude: this.locked
      },
      ...(options || {})
    })
      .then(this._mutator);
  }

  /**
   * Fetches full length of current model
   */
  count(query = null) {
    return this.model.count(query || {});
  }

  /**
   * Creates a new row entry with provided data
   *
   * @param {Object} data
   * @returns {Object|Boolean}
   *
   */
  create(data, transaction = {}) {
    return this.model.create(this._accessor(data))
      .then(this._mutator);
  }

  /**
   * Updates existing row with new values
   *
   * @param {Object} query Accepts object container all the values
   *
   * @returns {Object}
   * @throws {Error} err
   */
  update(query, data, transaction = {}) {
    return this.model.update(data, query)
      .then(this._mutator);
  }

  createOrUpdate(query, insert) {
    // Find with query

    // If found update

    // If not found create

    // return row;
  }

  async isExists(where) {
    if (!where) {
      throw new ValidationError('No query defined!');
    }

    const instance = await this.model.findOne({
      where
    });

    if (!instance) {
      return false;
    }

    return true;
  }

  findOrCreate() { }

  /**
   * Deletes an existing row
   *
   */
  destroy(query, transaction = {}) {
    return this.model.destroy(query);
  }

  _accessor(row) {
    return row;
  }

  async _mutator(row) {
    return row;
  }

}