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
}).run();
