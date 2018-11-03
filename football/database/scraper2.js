const cheerio = require('cheerio'),
  cheerioTableparser = require('cheerio-Tableparser');
const axios = require('axios');
const chalk = require('chalk');
const { League, Team, Player, connection } = require('./db');
const scrapeInfo = require('./scrape.config');

// Global Variables
const europeUrl = 'https://www.transfermarkt.com/wettbewerbe/europa';
const mainUrl = 'https://www.transfermarkt.com';
let leagues = [];
let teams = [];
let players = [];

const scrape = async () => {
  console.log(
    chalk.yellow.bgBlue(
      `\n  Scraping of ${chalk.underline.bold('Leagues')} initiated...\n`
    )
  );
  try {
    //await scrapeLeagues(europeUrl);
    //await scrapeLeaguesUrls();
    await scrapeLeaguesStandings();
  } catch (error) {
    console.log(error);
  }
};

const scrapeLeagues = async url => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Scraping League Names
    const leagueNames = $('.responsive-table .items tbody .hauptlink tr a')
      .toArray()
      .filter((e, i) => i % 2 !== 0);

    // Scraping League Nations
    const leagueNations = $(
      '.responsive-table .items tbody .zentriert img'
    ).toArray();

    // Creating All League Instances and Pushing into Array
    for (let i = 0; i < leagueNames.length; i++) {
      const leagueInstance = {
        transfermarktId: leagueNames[i].attribs.href.split('/', 7)[4],
        title: leagueNames[i].attribs.title,
        nation: leagueNations[i].attribs.title,
        urls: {
          main: leagueNames[i].attribs.href,
          marketValue: null,
          gamePlan: null,
          standings: null,
          topGoalScorers: null
        }
      };
      leagues.push(leagueInstance);
    }
  } catch (error) {
    console.error(error);
  }
};

const scrapeLeaguesUrls = async () => {
  console.log('---------- STARING LEAGUES URLS SCRAPING ----------');

  for (let i = 0; i < leagues.length; i++) {
    try {
      console.log(
        chalk.black.bgYellow(
          `\n\n  Scraping  ${chalk.underline.bold(leagues[i].title)} URLs\n`
        )
      );
      const response = await axios.get(mainUrl + leagues[i].urls.main);
      const $ = cheerio.load(response.data);

      const data1 = $('.footer-links a[href]').each((i, elem) => {
        return $(elem).attr('href');
      });

      const data2 = $('.table-footer a[href]').each((i, elem) => {
        return $(elem).attr('href');
      });

      leagues[i].urls.gamePlan = data1[1].attribs.href;
      leagues[i].urls.marketValue = data2[0].attribs.href;
      leagues[i].urls.topGoalScorers = data2[1].attribs.href;
      leagues[i].urls.standings = data2[2].attribs.href;
    } catch (error) {
      console.error(error);
    }
  }
};

const scrapeLeaguesStandings = async () => {
  console.log('---------- STARING LEAGUES STANDINGS SCRAPING ----------');

  // TEST CODE !!
  const response = await axios.get(
    'https://www.transfermarkt.com/premier-league/tabelle/wettbewerb/GB1/saison_id/2018'
  );
  const $ = cheerio.load(response.data);

  cheerioTableparser($);
  var data = $('table').parsetable(true, true, true);
  console.log(data);
  /*
  for (let i = 0; i < leagues.length; i++) {
    try {
      console.log(
        chalk.black.bgGreen(
          `\n\n  Scraping  ${chalk.underline.bold(
            leagues[i].title
          )} Table Standings\n`
        )
      );

      const response = await axios.get(mainUrl + leagues[i].urls.standings);
      const $ = cheerio.load(response.data);

      cheerioTableparser($);
      var data = $('table').parsetable(true, true, true);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  */
};

const scrapePlayers = async () => {
  console.log('---------- STARING SCRAPING PLAYERS ----------\n');

  for (let i = 0; i < teams.length; i++) {
    const response = await axios.get(mainUrl + teams[i].href);
    const $ = cheerio.load(response.data);
    const data = $('span.hide-for-small a.spielprofil_tooltip').toArray();

    for (let j = 0; j < data.length; j++) {
      console.log('...Adding ' + data[j].attribs.title);
      const playerInstance = new Player({
        transfermarktId: data[j].attribs.id,
        name: data[j].attribs.title,
        url: data[j].attribs.href,
        team: {
          transfermarktId: teams[i].transfermarktId,
          name: teams[i].name
        }
      });
      players.push(playerInstance);
    }
  }
};

scrape();
