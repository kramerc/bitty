'use strict';

var GitHubApi = require('github');

module.exports = function (req) {
  var github = new GitHubApi({
    version: '3.0.0'
  });

  if (req.user) {
    github.authenticate({
      type: 'oauth',
      token: req.user.accessToken
    });
  } else {
    github.authenticate({
      type: 'oauth',
      key: process.env.GITHUB_CLIENT_ID,
      secret: process.env.GITHUB_CLIENT_SECRET
    });
  }

  return github;
};
