var sockjs = require('sockjs')
  , path  = require('path')
  , fs = require('fs');

var SOCKJS_FILE = path.join(__dirname, './sockjs-0.3-min.js')
  , RELOAD_FILE = path.join(__dirname, './reload-client.js');

var _serve = function (httpServer, expressApp, time_ms) {
  var reload = sockjs.createServer({log: function(){}});
  reload.installHandlers(httpServer, {prefix: '/sockreload'});
};

module.exports.serve = _serve;

var _addPath = function(app,time_ms){
  
  //this happens at startup of program, so sync is alright
  var sockjsCode = fs.readFileSync(SOCKJS_FILE, 'utf8')
    , reloadCode = fs.readFileSync(RELOAD_FILE, 'utf8');
    
  console.log(SOCKJS_FILE);

  if (time_ms) {
    reloadCode = reloadCode.replace('RLD_TIMEOUT = 300', 'RLD_TIMEOUT = ' + time_ms)
  }

  var clientCode = sockjsCode + '\n\n' + reloadCode;
  
  app.get('/reload/reload.js', function(req, res) {
    res.type('text/javascript')
    res.send(clientCode)
  });
  
};

module.exports.addPath = _addPath;

module.exports.all = function (httpServer, expressApp, time_ms) {
  _addPath(expressApp,time_ms);
  _serve(httpServer,expressApp,time_ms);
};
