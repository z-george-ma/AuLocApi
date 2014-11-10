require("should")

var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("postcodes.sqlite");
var repo = require("../../dataaccess.js")(db);

describe("Get record with suburb Box Hill South and postcode 3128", function() {
  var record;

  before(function(done) {
    repo.getByPostcodeAndSuburb("3128", "Box Hill South", function(e, r) {
      record = r;
      done();
    });
  });

  it("should be in VIC", function() {
    record.state.should.be.exactly("VIC");
  });
});

describe("Lookup suburbs starting with Melbourne", function() {
  var records;

  before(function(done) {
    repo.lookupSuburb("Melbourne", function(e, r) {
      records = r;
      done();
    });
  });
  
  it("should all start with Melbourne", function() {
    records.should.matchEach(function(x) {
      return x.suburb.indexOf("Melbourne") == 0;
    });
  });

  it("should include Melbourne Airport", function() {
    records.should.match(function(x) {
      var i = x.length - 1;
      while(i--) {
        if (x[i].suburb == "Melbourne Airport") 
          return true;
      }

      return false;
    });
  });
});
