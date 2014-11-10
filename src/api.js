module.exports = function(app, repo) {
  app.get("/search/postcode/:postcode", function(req, res) {
    repo.lookupPostcode(req.params.postcode, function(e, r) {
      res.json(r);
    });
  });

  app.get("/search/suburb/:suburb", function(req, res) {
    repo.lookupSuburb(req.params.suburb, function(e, r) {
      res.json(r);
    });
  });

  app.get("/location", function(req, res) {
    var postcode = req.param("p");
    var suburb = req.param("s");
    if (!postcode) {
      if (!suburb) {
        res.status(403);
      }
      else {
        repo.getBySuburb(suburb, function(e, r) {
          res.json(r);
        });
      }
    }
    else {
      if (!suburb) {
        repo.getByPostcode(postcode, function(e, r) {
          res.json(r);
        });
      }
      else {
        repo.getByPostcodeAndSuburb(req.param("p"), req.param("s"), function(e, r) {
          res.json(r);
        });
      }
    }
  });
}
