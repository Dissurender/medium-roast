import {PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();

/**
 *
 * @returns {Story}
 * @param id
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
 * @returns {Comment}
 * @param id
 */
export const selectCommentQuery = async (id) => {
  const result = await prisma.comment.findUnique({
    where: { id: Number(id) },
  });
  console.log('selectCommentQ: ', id, result);
  return result;
};

/**
 *
 * @returns {Story[]}
 */
export const selectAllQuery = async () => {
  return prisma.story.findMany({
    take: 100,
    orderBy: {
      time: 'desc',
    },
  });
};

/**
 *
 * @param {Story} item
 * @returns {Story}
 */
export const createQuery = async (item, type) => {
  let result;

  if (type === 'story') {
    console.log('creating story: ', item.id);
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
    console.log('creating comment: ', item.id);
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
};
