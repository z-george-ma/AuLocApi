require("should")

var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("postcodes.sqlite");
var repo = require("../dataaccess.js")(db);

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
      var i = x.length;
      while(i--) {
        if (x[i].suburb == "Melbourne Airport") 
          return true;
      }

      return false;
    });
  });
});

describe("Lookup postcode starting with 300", function() {
  var records;

  before(function(done) {
    repo.lookupPostcode("300", function(e, r) {
      records = r;
      done();
    });
  });
  
  it("should return 9 results", function() {
    records.length.should.be.exactly(9);
  });

  it("should include Docklands", function() {
    records.should.match(function(x) {
      var i = x.length;
      while(i--) {
        if (x[i].suburb == "Docklands") 
          return true;
      }

      return false;
    });
  });
});

describe("Get all records with postcode 3128", function() {
  var records;

  before(function(done) {
    repo.getByPostcode("3128", function(e, r) {
      records = r;
      done();
    });
  });
  
  it("should return 5 results", function() {
    records.length.should.be.exactly(5);
  });

  it("should include Box Hill", function() {
    records.should.match(function(x) {
      var i = x.length;
      while(i--) {
        if (x[i].suburb == "Box Hill") 
          return true;
      }

      return false;
    });
  });
});

describe("Get all records with suburb Burwood", function() {
  var records;

  before(function(done) {
    repo.getBySuburb("Burwood", function(e, r) {
      records = r;
      done();
    });
  });
  
  it("should return 2 results", function() {
    records.length.should.be.exactly(2);
  });

  it("should include the one in NSW", function() {
    records.should.match(function(x) {
      var i = x.length;
      while(i--) {
        if (x[i].state == "NSW") 
          return true;
      }

      return false;
    });
  });
});

describe("Get all records with 1.5km of Melbourne", function() {
  var records;
  
  before(function(done) {
    repo.getRadius(-37.814563, 144.970267, 1.5, function(e, r) {
	  records = r;
      done();
    });
  });
  
  it("should return 3 results", function() {
    records.length.should.be.exactly(3);
  });

  it("should include Southbank", function() {
    records.should.match(function(x) {
      var i = x.length;
      while(i--) {
        if (x[i].suburb == "Southbank") 
          return true;
      }

      return false;
    });
  });
});
