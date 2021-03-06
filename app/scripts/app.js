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
  var renderer = new marked.Renderer();

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('root', {
      url: '/',
      views: {
        '': {
          templateUrl: 'templates/root.html'
        },
        'footer@': {
          templateUrl: 'templates/footers/root.html'
        }
      }
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
      title: 'New Gist',
      controller: 'NewGistCtrl',
      templateUrl: 'templates/gists/editor.html'
    })
    .state('gist.noUser', {
      url: '/:id',
      controller: 'GistNoUserCtrl'
    })
    .state('gist.editNoUser', {
      url: '/:id/edit',
      controller: 'GistNoUserCtrl'
    })
    .state('gist.editor.edit', {
      url: '/:user/:id/edit',
      title: 'Edit Gist',
      controller: 'EditGistCtrl',
      templateUrl: 'templates/gists/editor.html'
    })
    .state('gist.show', {
      url: '/:user/:id',
      views: {
        '': {
          controller: 'ShowGistCtrl',
          templateUrl: 'templates/gists/show.html'
        },
        'footer@': {
          templateUrl: 'templates/footers/gists/show.html'
        }
      }
    });

  // Add task list support
  renderer.list = function (body, ordered) {
    var type = ordered ? 'ol' : 'ul';
    var list = '<' + type + '>\n' + body + '</' + type + '>\n';
    if (/<li class="task-list-item">/.test(body)) {
      list = list.replace('<' + type + '>', '<' + type + ' class="task-list">');
    }
    return list;
  };
  renderer.listitem = function (text) {
    if (/^\s*\[[Xx ]\]\s*/.test(text)) {
      return '<li class="task-list-item">' + text + '</li>';
    }

    return '<li>' + text + '</li>';
  };

  markedProvider.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    renderer: renderer,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });
}).run(function ($rootScope, $document, $http, $timeout, $window, layout) {
  function getSession() {
    $http.get('/sessions/info')
      .success(function (user) {
        $rootScope.currentUser = user;
      });
  }

  getSession();

  $rootScope.layout = layout;

  $rootScope.getCurrentLogin = function () {
    var login = 'anonymous';
    if ($rootScope.currentUser) {
      login = $rootScope.currentUser.login;
    }
    return login;
  };

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

  $rootScope.$on('$stateChangeSuccess', function (event, newState) {
    var title = 'Bitty';
    if (newState.title) {
      title = newState.title + ' | ' + title;
    }
    $document.prop('title', title);
  });
});
