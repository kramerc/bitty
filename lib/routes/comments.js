'use strict';

var github = require('../github');

exports.list = function (req, res) {
  github.gists.getComments({
    'gist_id': req.params.gistId
  }, function (err, data) {
    res.send(data);
  });
};
