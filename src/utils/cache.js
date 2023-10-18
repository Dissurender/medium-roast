/**
 * Singleton Object
 */
const Cache = {};

const defaultNamespace = Symbol('defaultNamespace');

/**
 * useNamespace() is used to isolate the different 'zones'
 * of the Cache, such as Stories or Comments determined
 * by the type field in the Object.
 * @param {Symbol} namespace -- Name to break up span.
 * @returns methods for manipulating the focused namespace.
 */
function useNamespace(namespace) {
  if (!Cache[namespace]) {
    Cache[namespace] = new Map();
  }

  /**
   * @method
   * @param {Number} key -- Story ID 
   * @returns {Object} -- Schema found in src/models
   */
  function get(key) {
    return Cache[namespace].get(key);
  }

  /**
   * using the Story ID and the Story itself, put a
   * key/value pair into Cache
   * @method
   * @param {Number} key 
   * @param {Object} value 
   */
  function put(key, value) {
    Cache[namespace].set(key, value);
  }

  /**
   * Remove does just that.
   * @method
   * @param {Nunmber} key -- Story ID 
   */
  function remove(key) {
    Cache[namespace].delete(key);
  }

  /**
   * @method
   * retire flushes the namespace in the Cache
   */
  function retire() {
    Cache[namespace].clear();
  }

  return { get, put, remove, retire };
}

const { get, put, remove } = useNamespace(defaultNamespace);

module.exports = {
  get,
  put,
  remove,
  useNamespace,
};
