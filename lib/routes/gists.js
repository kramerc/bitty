'use strict';

var GitHubApi = require('github');

var github = new GitHubApi({
  version: '3.0.0'
});

github.authenticate({
  type: 'oauth',
  key: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET
});

exports.show = function (req, res) {
  github.gists.get({
    id: req.params.id
  }, function (err, data) {
    res.send(data);
  });
};
