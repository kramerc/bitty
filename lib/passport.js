'use strict';

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

module.exports = function () {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, {
      accessToken: accessToken,
      id: profile.id,
      username: profile.username
    });
  }));

  passport.serializeUser(function (user, done) {
    return done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    return done(null, user);
  });
};
