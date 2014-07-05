/* jshint maxlen:false */

'use strict';

angular.module('bitty', [
  'angularMoment',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'hc.marked'
]).config(function ($locationProvider, $stateProvider, $urlRouterProvider, markedProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('root', {
      url: '/',
      templateUrl: 'templates/root.html'
    })
    .state('gist', {
      abstract: true,
      url: '/:id',
      template: '<ui-view>'
    })
    .state('gist.show', {
      url: '',
      templateUrl: 'templates/gists/show.html',
      controller: 'ShowGistCtrl'
    });

  markedProvider.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });
}).run(function ($rootScope, $http, $timeout, $window, layout) {
  function getSession() {
    $http.get('/sessions/info')
      .success(function (user) {
        $rootScope.currentUser = user;
      });
  }

  getSession();

  $rootScope.layout = layout;

  $rootScope.signIn = function () {
    var authWindow = $window.open(
      '/auth/github', 'AuthWindow', 'dialog=1,location=0,width=1024,height=768');

    function watchWindow() {
      if (authWindow.window) {
        if (authWindow.window.location.pathname === '/') {
          getSession();
          authWindow.window.close();
        }
        $timeout(watchWindow, 500);
      }
    }
    $timeout(watchWindow, 500);
  };

  $rootScope.signOut = function () {
    $http.delete('/sessions')
      .success(function () {
        $rootScope.currentUser = null;
      });
  };

});
