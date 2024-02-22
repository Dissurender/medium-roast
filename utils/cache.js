class Cache {
  constructor() {
    this.cache = new Map();
  }

  getSize() {
    return this.cache.size;
  }

  get(key) {
    return this.cache.get(key);
  }

  getKeys() {
    return this.cache.keys();
  }

  /**
   * using the Story ID and the Story itself, put a
   * key/value pair into this.defaultCache
   * @method
   * @param {Number} key
   * @param {Object} value
   */
  put(key, value) {
    this.cache.set(key, value);
  }

  /**
   * Remove does just that.
   * @method
   * @param {Nunmber} key -- Story ID
   */
  remove(key) {
    this.cache.delete(key);
  }

  /**
   * retire flushes the  in the this.defaultCache
   * @method
   */
  retire() {
    this.cache.clear();
  }
}

const defaultCache = new Cache();

module.exports = {
  defaultCache,
};
