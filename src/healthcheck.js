var request = require("request");

var wait = function(count, callback) {
  return function() {
    count--;
    if (count == 0)
      callback();
  }
}

module.exports = function(app, port) {
  var baseUri = "http://localhost:" + port;

  app.get("/healthcheck", function(req, res) {
    var result = {
      searchByPostcode: false,
      searchBySuburb: false,
      getLocation: false,
      getByRadius: false
    };
    
    var done = wait(4, function() {
      res.json(result);
    });
    
    request.get(baseUri + "/search/postcode/300", function(e, r, b) {
      if (!e && b) {
        var body = JSON.parse(b);
        if (body.length == 9) 
          result.searchByPostcode = true;
      }
      done();
    });

    request.get(baseUri + "/search/suburb/melbourne", function(e, r, b) {
      if (!e && b) {
        var body = JSON.parse(b);
        if (body.length == 4) 
          result.searchBySuburb = true;
      }
      done();
    });

    request.get(baseUri + "/location?s=Box Hill South&p=3128", function(e, r, b) {
      if (!e && b) {
        var body = JSON.parse(b);
        if (body.state == "VIC") 
          result.getLocation = true;
      }
      done();
    });

    request.get(baseUri + "/radius?lat=-37.814563&long=144.970267&rad=1.5", function(e, r, b) {
      if (!e && b) {
        var body = JSON.parse(b);
        if (body.length == 3) 
          result.getByRadius = true;
      }
      done();
    });
  });
}
