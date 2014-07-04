'use strict';

var github = require('../github');

exports.show = function (req, res) {
  github(req).gists.get({
    id: req.params.id
  }, function (err, data) {
    res.send(data);
  });
};
