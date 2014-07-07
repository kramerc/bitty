/* jshint maxlen:false */

'use strict';

angular.module('bitty', [
  'angularMoment',
  'ngResource',
  'ngSanitize',
  'ui.ace',
  'ui.bootstrap',
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
      controller: 'GistCtrl',
      url: '',
      template: '<ui-view>'
    })
    .state('gist.editor', {
      abstract: true,
      controller: 'GistEditorCtrl',
      url: '',
      template: '<ui-view>'
    })
    .state('gist.editor.new', {
      url: '/new',
      controller: 'NewGistCtrl',
      templateUrl: 'templates/gists/editor.html'
    })
    .state('gist.editor.edit', {
      url: '/:id/edit',
      controller: 'EditGistCtrl',
      templateUrl: 'templates/gists/editor.html'
    })
    .state('gist.show', {
      url: '/:id',
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
