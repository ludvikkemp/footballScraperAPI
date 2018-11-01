const cheerio = require('cheerio');
const request = require('request');
const { League, Team, connection } = require('./db');
const scrapeInfo = require('./scrape.config');

// Global Variables
const europeURL = 'https://www.transfermarkt.com/wettbewerbe/europa';
const mainURL = 'https://www.transfermarkt.com';

class Scraper extends cheerio {
  constructor() {
    super();
    this.properties = {
      leagues: [],
      teams: [],
      players: [],
      leaguesScraped: false,
      teamsScraped: false,
      playersScraped: false
    };
  }

  scrapeLeagues() {
    request(
      {
        url: europeURL,
        form: scrapeInfo.form(),
        headers: scrapeInfo.headers()
      },
      (err, res, body) => {
        const $ = cheerio.load(body);

        // Scraping League Names
        const leagueNames = $('.responsive-table .items tbody .hauptlink tr a')
          .toArray()
          .filter((elem, i) => i % 2 !== 0);

        // Scraping League Nations
        const leagueNations = $(
          '.responsive-table .items tbody .zentriert img'
        ).toArray();

        // Saving each leagueSchema
        for (let i = 0; i < leagueNames.length; i++) {
          // New League Schema Created
          const leagueInstance = new League({
            transfermarktId: leagueNames[i].attribs.href.split('/', 7)[4],
            title: leagueNames[i].attribs.title,
            nation: leagueNations[i].attribs.title,
            href: leagueNames[i].attribs.href
          });

          // League Schema Saved into Database
          leagueInstance.save(err => {
            if (err) {
              throw new Error(err);
            }
          });
        }
        console.log('Successfully saved leagues to database!');
        this.properties.leaguesScraped = true;
      }
    );
  }

  scrapeTeams() {
    // TODO
  }

  scrapePlayers() {
    // TODO
  }
}

module.exports = Scraper;
