import { selectAllQuery } from '../db/index.js';
import { checkDB, getComments } from './ingestController.js';
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
 *
 * @param {Request} req
 * @param {Response} res
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
 *
 * @param {Request} req
 * @param {Response} res
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
