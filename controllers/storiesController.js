import { selectQuery, selectAllQuery } from '../db/index.cjs';
/**
 * Retrieves top stories from HN API
 * @async
 * @method getAll returns all Objects in the namespace
 * @returns {*} Object Array
 */
export const getTopStories = async (req, res) => {
  const results = await selectAllQuery();
  res.json(results);
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const getStory = async (req, res) => {
  const story = await selectQuery(req.params.id);

  res.json(story);
};
