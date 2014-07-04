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

module.exports = github;
