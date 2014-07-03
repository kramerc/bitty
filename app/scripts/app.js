'use strict';

angular.module('bitty', [
  'ui.router'
]).config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('root', {
      url: '/',
      templateUrl: 'templates/root.html'
    });
}).run();
