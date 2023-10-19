const schema = require('schm');

const StorySchema = new schema({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  by: String,
  time: Number,
  kids: [Number],
  descendants: Number,
  score: Number,
  title: String,
  url: String,
  parent: Number,
  text: String,
});

module.exports = {
  StorySchema,
};
