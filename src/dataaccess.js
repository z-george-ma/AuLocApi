function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function formatSingleToTitleCase(callback) {
  return function(err, row) {
    if (row) {
      row.suburb = toTitleCase(row.suburb);
    }
    callback(err, row);
  }
}

function formatToTitleCase(callback) {
  return function(err, rows) {
    if (rows) {
      rows.forEach(function(x) {
        x.suburb = toTitleCase(x.suburb);
      });
    }
    callback(err, rows);
  }
}

module.exports = function(db) {
  var sqlPostcodeLookup = db.prepare("SELECT id, postcode, suburb, state FROM postcodes WHERE postcode like ?");
  var sqlSuburbLookup = db.prepare("SELECT id, postcode, suburb, state FROM postcodes WHERE suburb like ?");
  var sqlGetByPostcode = db.prepare("SELECT id, postcode, suburb, state, latitude, longitude FROM postcodes WHERE postcode = ?");
  var sqlGetBySuburb = db.prepare("SELECT id, postcode, suburb, state, latitude, longitude FROM postcodes WHERE suburb = ?");
  var sqlGetByPostcodeAndSuburb = db.prepare("SELECT id, postcode, suburb, state, latitude, longitude FROM postcodes WHERE postcode = ? AND suburb = ?");
  var sqlGetByRadius = db.prepare("SELECT id, postcode, suburb, state, latitude, longitude FROM postcodes WHERE (1-latcos*$latcos-latsin*$latsin)/2 +latcos*$latcos*(1-longcos*$longcos-longsin*$longsin)/2 < $rad"); 

  return {
    lookupPostcode: function(postcode, callback) {
      sqlPostcodeLookup.reset(function() {
        sqlPostcodeLookup.all(parseInt(postcode)+"%", formatToTitleCase(callback));
      });
    },
      lookupSuburb: function(suburb, callback) {
        sqlSuburbLookup.reset(function() {
          sqlSuburbLookup.all(suburb.toLowerCase()+"%", formatToTitleCase(callback));
        });
      },
      getByPostcodeAndSuburb: function(postcode, suburb, callback) {
        sqlGetByPostcodeAndSuburb.reset(function() {
          sqlGetByPostcodeAndSuburb.get(parseInt(postcode).toString(), suburb.toLowerCase(), formatSingleToTitleCase(callback));
        });
      },
      getByPostcode: function(postcode, callback) {
        sqlGetByPostcode.reset(function() {
          sqlGetByPostcode.all(parseInt(postcode).toString(), formatToTitleCase(callback));
        });
      },
      getBySuburb: function(suburb, callback) {
        sqlGetBySuburb.reset(function() {
          sqlGetBySuburb.all(suburb.toLowerCase(), formatToTitleCase(callback));
        });
      },
      getRadius: function(lat, _long, distance, callback) {
        sqlGetByRadius.reset(function() {
          var radius = Math.sin(distance / 2 / 6371),
        latrad = lat * Math.PI / 180,
        longrad = _long * Math.PI / 180;

        sqlGetByRadius.all({
          $latsin: Math.sin(latrad),
          $latcos: Math.cos(latrad),
          $longsin: Math.sin(longrad),
          $longcos: Math.cos(longrad),
          $rad: radius * radius
        }, formatToTitleCase(callback));
        });
      }
  };
};
