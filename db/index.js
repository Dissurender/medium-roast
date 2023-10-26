import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/winston.js';
const prisma = new PrismaClient();

/**
 * Query story table for given ID
 * @param {Number} id story id
 * @returns {Promise<Story>}
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
 * @param {Number} id
 * @returns {Comment}
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
 * Query the story table for 100 rows
 * @returns {Story[]}
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
 * @param {Story} item
 * @returns {Story}
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
