import { selectAllQuery } from '../db/index.js';
import { checkDB, getComments } from './ingestController.js';
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
  let story = await checkDB(req.params.id, 'story');
  console.log('getStory result: ', story);

  story = await getComments(story, 'comment');

  res.json(story);
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const getComment = async (req, res) => {
  let comment = await checkDB(req.params.id, 'comment');
  console.log('getComment result: ', comment);

  comment = await getComments(comment, 'comment');

  res.json(comment);
};
