import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 *
 * @param {Request} req
 * @param {Result} res
 * @returns {Story}
 */
export const selectQuery = async (req, res) => {
  const { id } = req.body;
  const result = await prisma.story.findUnique({
    where: { id: Number(id) },
  });
  res.json(result);
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
  console.log(result);
};

/**
 *
 * @param {Story} story
 * @returns {Story}
 */
export const upsertQuery = async (story) => {
  let result;

  if (story.type === 'story') {
    result = await prisma.story.upsert({
      where: {
        id: story.id,
      },
      update: {},
      create: {
        id: story.id,
        by: story.by,
        time: story.time,
        descendants: story.descendants,
        deleted: story.deleted,
        dead: story.dead,
        kids: {
          connectOrCreate: [story["kids"]]
        },
        score: story.score,
        title: story.title,
        url: story.url,
      },
    });
  } else if (story.type === 'comment') {
    result = await prisma.comment.upsert({
      where: {
        id: story.id,
      },
      update: {},
      create: {
        id: story.id,
        by: story.by,
        time: story.time,
        descendants: story.descendants,
        deleted: story.deleted,
        dead: story.dead,
        kids: {
          connect: [story["kids"]]
        },
        score: story.score,
        title: story.title,
        url: story.url,
        Story: story.parent,
      },
    });
  }

  return result;
};
