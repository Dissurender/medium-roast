/*
  Warnings:

  - You are about to drop the column `commentId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_storyId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "commentId",
ADD COLUMN     "kids" INTEGER[],
ALTER COLUMN "by" DROP NOT NULL,
ALTER COLUMN "time" DROP NOT NULL,
ALTER COLUMN "deleted" DROP NOT NULL,
ALTER COLUMN "deleted" SET DEFAULT false,
ALTER COLUMN "dead" DROP NOT NULL,
ALTER COLUMN "dead" SET DEFAULT false,
ALTER COLUMN "text" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "kids" INTEGER[],
ALTER COLUMN "by" DROP NOT NULL,
ALTER COLUMN "time" DROP NOT NULL,
ALTER COLUMN "descendants" SET DEFAULT 0,
ALTER COLUMN "deleted" DROP NOT NULL,
ALTER COLUMN "deleted" SET DEFAULT false,
ALTER COLUMN "dead" DROP NOT NULL,
ALTER COLUMN "dead" SET DEFAULT false,
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;
