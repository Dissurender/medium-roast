/**
 * TODO:
 */
class Cache {
  defaultCache;
  constructor() {
    this.defaultCache = new Map();
  }

  getSize() {
    return this.defaultCache.size;
  }

  peekName() {
    return this.defaultCache;
  }

  /**
   * @method
   * @param {Number} key -- Story ID
   * @returns {Object} -- Schema found in src/models
   */
  get(key) {
    return this.defaultCache.get(key);
  }

  getAll() {
    return this.defaultCache.values;
  }

  /**
   * using the Story ID and the Story itself, put a
   * key/value pair into this.defaultCache
   * @method
   * @param {Number} key
   * @param {Object} value
   */
  put(key, value) {
    this.defaultCache.set(key, value);
  }

  /**
   * Remove does just that.
   * @method
   * @param {Nunmber} key -- Story ID
   */
  remove(key) {
    this.defaultCache.delete(key);
  }

  /**
   * @method
   * retire flushes the  in the this.defaultCache
   */
  retire() {
    this.defaultCache.clear();
  }
}

const defaultCache = new Cache();

module.exports = {
  defaultCache,
};
