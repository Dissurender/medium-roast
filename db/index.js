import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/winston.js';

export const prisma = new PrismaClient({
  errorFormat: 'pretty',
});

/**
 * Attempt to connect to a database using the Prisma ORM.
 *
 * @param {number} maxAttempts - The maximum number of connection attempts to make.
 * @param {number} interval - The interval (in milliseconds) between each connection attempt.
 * @throws {Error} If the maximum number of attempts is reached without a successful connection.
 */
export async function initPrisma(maxAttempts, interval) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      await prisma.$connect();

      logger.info('Connected to the database.');
      return;
    } catch (error) {
      logger.error(`Error connecting to the database: ${error}`);
      logger.error(
        `Attempt ${attempt} of ${maxAttempts} to connect to the database..`
      );

      attempt++;
      if (attempt < maxAttempts) {
        logger.info(
          `Sleeping ${interval / 1000} seconds before attempting again..`
        );

        await new Promise((resole) => setTimeout(resole, interval));
      }
    }
  }
  throw new Error(
    `Failed to connect to the database after ${maxAttempts} attempts.`
  );
}

prisma.$on('error', (err) => {
  logger.error(err);
});

/**
 * Retrieves a story from the database using the Prisma ORM.
 *
 * @param {Number} id - story ID to be retrieve.
 * @returns {Object} - The story object retrieved from the database, or undefined if no story is found.
 * @throws {Error} - If an error occurs during the database operation.
 */
export async function selectStoryQuery(id) {
  try {
    const result = await prisma.story.findUnique({
      where: { id: Number(id) },
    });
    return result;
  } catch (error) {
    logger.error(`Error selecting story: ${error}`);
    throw new Error('Failed to select story');
  }
}

/**
 * Query comment table for given ID
 *
 * @param {number} id - comment ID to be retrieve.
 * @returns {object} - The comment object retrieved from the database, or undefined if no comment is found.
 * @throws {Error} - If an error occurs during the database operation.
 *
 */
export async function selectCommentQuery(id) {
  try {
    const result = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });
    return result;
  } catch (error) {
    logger.error(`Error selecting story: ${error}`);
    throw new Error('Failed to select story');
  }
}

/**
 * Retrieves a list of stories from the database.
 * If an error occurs during the retrieval process, log the error and throw an error.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of stories retrieved from the database.
 * @throws {Error} If an error occurs during the retrieval process.
 *
 */
export async function selectAllQuery() {
  return prisma.story
    .findMany({
      take: 100,
      orderBy: {
        time: 'desc',
      },
    })
    .catch((error) => {
      logger.error(`Error selecting stories: ${error}`);
      throw new Error('Failed to select all stories.');
    });
}

/**
 * Queries the appropriate table for an item.
 *
 * @param {number} id - item ID to be retrieve.
 * @returns {object} - The comment object retrieved from the database, or undefined if no comment is found.
 * @throws {Error} - If an error occurs during the database operation.
 */
export async function createQuery(item, type) {
  let result;

  if (type === 'story') {
    logger.info('creating story: ' + item.id);
    result = await prisma.story.create({
      data: {
        id: item.id,
        by: item.by,
        time: item.time,
        descendants: item.descendants,
        deleted: item.deleted,
        dead: item.dead,
        kids: item.kids,
        score: item.score,
        title: item.title,
        url: item.url,
      },
    });
  } else if (type === 'comment') {
    logger.info('creating comment: ' + item.id);
    result = await prisma.comment.create({
      data: {
        id: item.id,
        by: item.by,
        time: item.time,
        descendants: item.descendants,
        deleted: item.deleted,
        dead: item.dead,
        kids: item.kids,
        score: item.score,
        title: item.title,
        url: item.url,
        text: item.text,
        parent: item.parent,
      },
    });
  }

  return result;
}

/**
 * Query database for given ID and return if found or null.
 * @param {Number} id
 * @param {String} type
 * @return {Promise<Object>} Story or Comment Object
 */
export async function checkDB(id, type) {
  logger.info('lookup: ' + `${id} ${type}`);

  if (type === 'story') {
    const story = await selectStoryQuery(id);
    logger.info('story check: ' + id);
    return story;
  } else if (type === 'comment') {
    const comment = await selectCommentQuery(id);
    logger.info('comment check: ' + id);
    return comment;
  }
}