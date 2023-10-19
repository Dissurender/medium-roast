
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
  "text" text
);

create table if not exists "comments" (
  "id" SERIAL primary key,
  "deleted" BOOLEAN,
  "type" VARCHAR(20) not null,
  "by" VARCHAR(255),
  "time" INTEGER,
  "dead" BOOLEAN,
  "descendants" INTEGER,
  "score" INTEGER,
  "text" text,
  "story_id" INTEGER references "stories"("id"),
  "parent" INTEGER,
  "kids" INTEGER[]
);

create table if not exists "story_comments" (
  "story_id" INTEGER not null,
  "comment_id" INTEGER not null,
  primary key ("story_id", "comment_id"),
  foreign key ("story_id") references "stories" ("id"),
  foreign key ("comment_id") references "comments" ("id")
);