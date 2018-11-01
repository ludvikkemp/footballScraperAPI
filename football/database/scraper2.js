const cheerio = require('cheerio');
const axios = require('axios');
const chalk = require('chalk');
const { League, Team, Player, connection } = require('./db');
const scrapeInfo = require('./scrape.config');

// Global Variables
const europeURL = 'https://www.transfermarkt.com/wettbewerbe/europa';
const mainURL = 'https://www.transfermarkt.com';
let leagues = [];
let teams = [];
let players = [];

const scrapeLeagues = async url => {
  console.log(
    chalk.yellow.bgBlue(
      `\n  Scraping of ${chalk.underline.bold('Leagues')} initiated...\n`
    )
  );

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

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
      leagues.push(leagueInstance);
      // League Schema Saved into Database
      leagueInstance.save(err => {
        if (err) {
          throw new Error(err);
        }
      });
    }
    console.log('Leagues Successfully Scraped and Saved into Database!\n\n');
    scrapeTeams();
  } catch (error) {
    console.error(error);
  }
};

const scrapeTeams = async url => {
  console.log('---------- STARING SCRAPING TEAMS ----------\n');
  for (let i = 0; i < leagues.length; i++) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const data = $(
        '.responsive-table .items tbody .zentriert .vereinprofil_tooltip'
      ).toArray();

      const teamNames = $(
        '.responsive-table .items tbody .hauptlink .vereinprofil_tooltip'
      )
        .map(function(i, elem) {
          return $(this).text();
        })
        .get()
        .join(', ')
        .split(', ')
        .filter((elem, i) => i % 2 === 0);

      //TODO Her ætti ég að get náð í annað response await um liðin
      // More info

      for (let j = 0; j < data.length; j++) {
        console.log('...Adding ' + teamNames[j]);
        const teamInstance = new Team({
          transfermarktId: data[j].attribs.href.split('/', 7)[4],
          name: teamNames[j],
          href: data[j].attribs.href,
          league: {
            transfermarktId: leagues[i].transfermarktId,
            title: leagues[i].title,
            nation: leagues[i].nation
          }
        });
        teams.push(teamInstance);
        teamInstance.save(err => {
          if (err) {
            throw new Error(err);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  setTimeout(() => {
    console.log('\nTeams Successfully Scraped and Saved into Database!\n\n');
    scrapePlayers();
  }, 10000);
};

const scrapePlayers = () => {
  console.log('---------- STARING SCRAPING PLAYERS ----------\n');

  for (let i = 0; i < teams.length; i++) {
    request(
      {
        url: mainURL + teams[i].href,
        form: scrapeInfo.form(),
        headers: scrapeInfo.headers()
      },
      (err, res, body) => {
        const $ = cheerio.load(body);
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
          playerInstance.save(err => {
            if (err) {
              throw new Error(err);
            }
          });
        }
      }
    );
  }
  setTimeout(() => {
    console.log('\nPlayers Successfully Scraped and Saved into Database\n\n');
    console.log(
      'Mongo Database for football players and teams in 25 leagues in Europe'
    );
  }, 50000);
};

//scrapeLeagues();
