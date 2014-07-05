'use strict';

angular.module('bitty').service('layout', function ($rootScope) {
  var defaults = {
    navbar: true
  };

  $rootScope.$on('$stateChangeStart', function () {
    for (var setting in defaults) {
      if (defaults.hasOwnProperty(setting)) {
        this[setting] = defaults[setting];
      }
    }
  }.bind(this));
});