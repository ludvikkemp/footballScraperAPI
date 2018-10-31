// Form and headers for pretending to be a browser
// in order to be able to scrape transfermarkt for data
const form = () => {
  return {
    username: 'usr',
    password: 'pwd',
    opaque: 'opaque',
    logintype: '1'
  };
};
const headers = () => {
  return {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
};

module.exports = {
  form,
  headers
};
