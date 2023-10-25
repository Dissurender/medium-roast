import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 *
 * @param {Request} req
 * @param {Result} res
 * @returns {Story}
 */
export const selectStoryQuery = async (id) => {
  const result = await prisma.story.findUnique({
    where: { id: Number(id) },
  });
  console.log('selectStoryQ: ', id, result);
  return result;
};

/**
 *
 * @param {Request} req
 * @param {Result} res
 * @returns {Comment}
 */
export const selectCommentQuery = async (id) => {
  const result = await prisma.story.findUnique({
    where: { id: Number(id) },
  });
  console.log('selectCommentQ: ', id, result);
  return result;
};

/**
 *
 * @param {Request} req
 * @param {Result} res
 * @returns {Story[]}
 */
export const selectAllQuery = async () => {
  const result = await prisma.story.findMany({
    take: 100,
    orderBy: {
      time: 'desc',
    },
  });
  return result;
};

/**
 *
 * @param {Story} story
 * @returns {Story}
 */
export const createQuery = async (story) => {
  let result;

  if (story.story === 'story') {
    console.log('creating story: ', story.id);
    result = await prisma.story.create({
      data: {
        id: story.id,
        by: story.by,
        time: story.time,
        descendants: story.descendants,
        deleted: story.deleted,
        dead: story.dead,
        kids: story.kids,
        score: story.score,
        title: story.title,
        url: story.url,
      },
    });
  } else if (story.comment === 'comment') {
    console.log('creating comment: ', story.id);
    result = await prisma.comment.create({
      data: {
        id: story.id,
        by: story.by,
        time: story.time,
        descendants: story.descendants,
        deleted: story.deleted,
        dead: story.dead,
        kids: story.kids,
        score: story.score,
        title: story.title,
        url: story.url,
        parent: story.parent,
      },
    });
  }

  console.log('created: ', result);
  return result;
};
