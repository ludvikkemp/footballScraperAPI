const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

module.exports = new Schema({
  transfermarktId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  league: {
    transfermarktId: { type: ObjectId, required: true },
    title: { type: String, required: true },
    nation: { type: String, required: true }
  }
});
