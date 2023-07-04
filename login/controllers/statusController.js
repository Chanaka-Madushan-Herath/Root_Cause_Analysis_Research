const os = require('os');
const pjson = require('../package');

module.exports = {
  getStatus: (req, res) => {
    return res.send({
      hostname: os.hostname(),
      status: 'running',
      version: pjson.version
    });
  }
};
