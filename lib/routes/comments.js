'use strict';

var github = require('../github');

exports.list = function (req, res) {
  github(req).gists.getComments({
    'gist_id': req.params.gistId
  }, function (err, data) {
    res.send(data);
  });
};

exports.create = function (req, res) {
  github(req).gists.createComment({
    'gist_id': req.params.gistId,
    body: req.body.body
  }, function (err, data) {
    if (err) {
      return res.send(422, err);
    }
    res.send(data);
  });
};

exports.update = function (req, res) {
  github(req).gists.editComment({
    'gist_id': req.params.gistId,
    id: req.params.id,
    body: req.body.body
  }, function (err, data) {
    if (err) {
      return res.send(422, err);
    }
    res.send(data);
  });
};

exports.delete = function (req, res) {
  github(req).gists.deleteComment({
    'gist_id': req.params.gistId,
    id: req.params.id
  }, function (err) {
    if (err) {
      return res.send(422, err);
    }
    res.send(204);
  });
};
