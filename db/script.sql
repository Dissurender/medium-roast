
create table if not exists "stories" (
  "id" INTEGER primary key,
  "deleted" BOOLEAN,
  "type" VARCHAR(20) not null,
  "by" VARCHAR(255),
  "time" INTEGER,
  "dead" BOOLEAN,
  "descendants" INTEGER,
  "score" INTEGER,
  "title" VARCHAR(255),
  "url" VARCHAR(255),
  "text" text,
  "parent" INTEGER,
  "kids" INTEGER[]
);
