const Schema = require('mongoose').Schema;

module.exports = new Schema({
  transfermarktId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  nation: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  }
});
