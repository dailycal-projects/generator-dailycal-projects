const app = require('../../server/server.js');
const { argv } = require('yargs');

module.exports = () => {
  app.renderIndex();
}
