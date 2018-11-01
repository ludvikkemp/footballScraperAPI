const mongoose = require('mongoose');
const leagueSchema = require('../schemas/leagueSchema');
const teamSchema = require('../schemas/teamSchema');
const playerSchema = require('../schemas/playerSchema');

const connection = mongoose.createConnection(
  'mongodb://ludvikkemp:lulli123@ds147833-a0.mlab.com:47833,ds147833-a1.mlab.com:47833/fooballdb?replicaSet=rs-ds147833',
  {
    useNewUrlParser: true
  }
);

module.exports = {
  League: connection.model('League', leagueSchema),
  Team: connection.model('Team', teamSchema),
  Player: connection.model('Player', playerSchema),
  connection
};
