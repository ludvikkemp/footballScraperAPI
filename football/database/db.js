const mongoose = require('mongoose');
const leagueShema = require('../schemas/leagueSchema');
const teamShema = require('../schemas/teamSchema');

const connection = mongoose.createConnection(
  'mongodb://ludvikkemp:xxxxxxxx@ds147833-a0.mlab.com:47833,ds147833-a1.mlab.com:47833/fooballdb?replicaSet=rs-ds147833',
  {
    useNewUrlParser: true
  }
);

module.exports = {
  League: connection.model('League', leagueShema),
  Team: connection.model('Team', teamShema),
  connection
};
