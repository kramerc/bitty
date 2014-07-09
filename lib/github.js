'use strict';

var GitHubApi = require('github');

module.exports = function (req) {
  var github;

  if (!process.env.GITHUB_USER_AGENT) {
    throw new Error('GITHUB_USER_AGENT environment variable is not set');
  }

  github = new GitHubApi({
    version: '3.0.0',
    headers: {
      'User-Agent': process.env.GITHUB_USER_AGENT
    }
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
