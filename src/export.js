var fs = require("fs");
var csv = require("fast-csv");
var sqlite3 = require("sqlite3");

var createDb = function(sqlite3, name) {
  var db = new sqlite3.Database(name);
  db.exec("CREATE TABLE postcodes (postcode TEXT, suburb TEXT, state TEXT, latitude REAL, longitude REAL); \
CREATE INDEX idx_postcodes_postcode on postcodes(postcode); \
CREATE INDEX idx_postcodes_suburb on postcodes(suburb); \
CREATE INDEX idx_postcodes_long on postcodes(longitude); \
CREATE INDEX idx_postcodes_lat on postcodes(latitude);");

  return db;
}

var db = createDb(sqlite3, "postcodes.sqlite")
var stream = fs.createReadStream("../data/pc_full_lat_long.csv");
var cache = [];
var csvStream = csv({
      headers: true,
      ignoreEmpty: true
    })
    .on("data", function(data){
      cache[cache.length] = {
        $pcode: data.Pcode,
        $suburb: data.Locality.toLowerCase(),
        $state: data.State,
        $lat: data.Lat,
        $long: data.Long
      };
    })
    .on("end", function(){
      db.exec("BEGIN");
      var previous = {};
      cache.forEach(function(x) {
        if (x.$pcode < "8000" && x.$pcode != previous.$pcode || x.$suburb != previous.$suburb) {
          db.run("INSERT INTO postcodes VALUES($pcode, $suburb, $state, $lat, $long)", x);
        }
        previous = x;
      });
      db.exec("COMMIT");
      db.close();
      stream.close();
    });

stream.pipe(csvStream);

