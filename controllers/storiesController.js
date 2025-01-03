import { checkDB, selectAllQuery } from '../db/index.js';
import { getComments } from './ingestController.js';
import { logger } from '../utils/winston.js';

/**
 * Retrieves top stories from HN API
 * @async
 * @returns {*} Object Array
 */
export const getTopStories = async (req, res) => {
  const results = await selectAllQuery();

  res.json(results);
};

/**
 * Retrieves the most recent stories from the Database
 * @async
 * @returns {*} Object
 */
export const getRecentStories = async (req, res) => {
  const results = await selectAllQuery();

  res.json(results);
};

/**
 * getStory retrieves a story from the database or the HN API
 * @param {Request} req
 * @param {Response} res
 * @returns {Object} Story Object
 * @async
 */
export const getStory = async (req, res) => {
  try {
    let story = await checkDB(req.params.id, 'story');
    logger.info('getStory result: ' + `${story.id}`);

    story = await getComments(story, 'comment');

    res.json(story);
  } catch (error) {
    logger.error('Error occurred: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * getComment retrieves a comment from the database or the HN API
 * @param {Request} req
 * @param {Response} res
 * @returns {Object} Comment Object
 * @async
 */
export const getComment = async (req, res) => {
  try {
    let comment = await checkDB(req.params.id, 'comment');
    logger.info('getComment result: ' + `${comment.id}`);

    comment = await getComments(comment, 'comment');

    res.json(comment);
  } catch (error) {
    logger.error('Error occurred: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * getStories retrieves a paginated list of stories from the database
 * @param {Request} req
 * @param {Response} res
 * @returns {Object} Array of Story Objects
 * @async
 */
export const getStories = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const results = await selectAllQuery(page, limit);

    res.json(results);
  } catch (error) {
    logger.error('Error occurred: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
