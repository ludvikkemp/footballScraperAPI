//const { League, Team, connection } = require('./database/db');
const Scraper = require('./database/scraper');

const scraperInstance = new Scraper();
scraperInstance.scrapeLeagues();
console.log(scraperInstance.properties.leaguesScraped);

setTimeout(() => {
  console.log(scraperInstance.properties.leaguesScraped);
}, 3000);
