var passport = require('passport')
,   BasicStrategy = require('passport-http').BasicStrategy
,   ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
,   BearerStrategy = require('passport-http-bearer').Strategy
,   models = require('./models')

passport.use(new BasicStrategy(
  function(username, password, done) {

    models.Client.find({where: {id: username}})
    .then(function(client) {
      if (!client) { return done(null, false) }
      if (client.secret !== password) { return done(null, false) }
      return done(null, client)
    }, function(err) { return done(err) })

  }
))

passport.use(new ClientPasswordStrategy(
  function(clientId, clientSecret, done) {

    models.Client.find({where: {clientId: clientId}})
    .then(function(client) {
      if (!client) { return done(null, false) }
      if (client.secret !== clientSecret) { return done(null, false) }
      return done(null, client)
    }, function(err) { return done(err) })

  }
))

passport.use(new BearerStrategy(
  function(accessToken, done) {
    models.AccessToken.find({where: {token: accessToken}})
    .then(function(user) {
      if (!user) { return done(null, false) }

      var info = {scope: user.scope}
      done(null, user, info)
    }, function(err) { return done(err) })
  }
))

module.exports = passport