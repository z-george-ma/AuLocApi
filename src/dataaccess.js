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
  var sqlPostcodeLookup = db.prepare("SELECT postcode, suburb, state FROM postcodes WHERE postcode like ?");
  var sqlSuburbLookup = db.prepare("SELECT postcode, suburb, state FROM postcodes WHERE suburb like ?");
  var sqlGetByPostcode = db.prepare("SELECT * FROM postcodes WHERE postcode = ?");
  var sqlGetBySuburb = db.prepare("SELECT * FROM postcodes WHERE suburb = ?");
  var sqlGetByPostcodeAndSuburb = db.prepare("SELECT * FROM postcodes WHERE postcode = ? AND suburb = ?");

  return {
    lookupPostcode: function(postcode, callback) {
      sqlPostcodeLookup.reset(function() {
        sqlPostcodeLookup.all(postcode+"%", formatToTitleCase(callback));
      });
    },
    lookupSuburb: function(suburb, callback) {
      sqlSuburbLookup.reset(function() {
        sqlSuburbLookup.all(suburb.toLowerCase()+"%", formatToTitleCase(callback));
      });
    },
    getByPostcodeAndSuburb: function(postcode, suburb, callback) {
      sqlGetByPostcodeAndSuburb.reset(function() {
        sqlGetByPostcodeAndSuburb.get(postcode, suburb.toLowerCase(), formatSingleToTitleCase(callback));
      });
    },
    getByPostcode: function(postcode, callback) {
      sqlGetByPostcode.reset(function() {
        sqlGetByPostcode.all(postcode, formatToTitleCase(callback));
      });
    },
    getBySuburb: function(suburb, callback) {
      sqlGetBySuburb.reset(function() {
        sqlGetBySuburb.all(suburb.toLowerCase(), formatToTitleCase(callback));
      });
    }
  };
};
