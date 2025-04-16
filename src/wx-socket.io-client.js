const WXManager = require('./Code/wx-manager.js');

function connect(url, options){
  const manager = new WXManager(url, options);
  const socket = manager.socket('/',manager.opts);
  return socket;
}

module.exports = connect;