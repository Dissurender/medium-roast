-- CreateTable
CREATE TABLE "Story" (
    "id" INTEGER NOT NULL,
    "by" VARCHAR(255) NOT NULL,
    "time" INTEGER NOT NULL,
    "descendants" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "dead" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL,
    "by" VARCHAR(255) NOT NULL,
    "time" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "dead" BOOLEAN NOT NULL,
    "text" TEXT NOT NULL,
    "storyId" INTEGER NOT NULL,
    "commentId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
