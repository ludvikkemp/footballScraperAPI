const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  transfermarktId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  team: {
    transfermarktId: { type: String, required: true },
    name: { type: String, required: true }
  }
});
