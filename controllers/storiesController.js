import {
  selectAllQuery,
} from '../db/index.js';
import { ingestData, checkDB, getComments } from './ingestController.js';
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
  const story = await checkDB(req.params.id, 'story');
  console.log('getStory result: ', story);

  if (story.kids.length > 0) {
    const kids = await getComments(story, 'comment');

    delete story['kids'];
    story['kids'] = kids;
  }

  res.json(story);
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const getComment = async (req, res) => {
  const comment = await checkDB(req.params.id, 'comment');
  console.log('getComment result: ', comment);

  if (comment) {
    const kids = await getComments(comment, 'comment');

    delete comment['kids'];
    comment['kids'] = kids;
  }

  res.json(comment);
};
