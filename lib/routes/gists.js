'use strict';

var github = require('../github');

exports.create = function (req, res) {
  github(req).gists.create({
    files: req.body.files,
    public: true
  }, function (err, data) {
    res.send(data);
  });
};

exports.show = function (req, res) {
  github(req).gists.get({
    id: req.params.id
  }, function (err, data) {
    res.send(data);
  });
};

exports.update = function (req, res) {
  github(req).gists.edit({
    id: req.body.id,
    files: req.body.files
  }, function (err, data) {
    res.send(data);
  });
};
