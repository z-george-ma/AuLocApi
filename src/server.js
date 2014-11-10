var config = require("config-node")();
var app = require("express")();

var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("./postcodes.sqlite");
var repo = require("./dataaccess.js")(db);

require("./api.js")(app, repo);

app.listen(config.port);


