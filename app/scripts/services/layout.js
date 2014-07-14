'use strict';

angular.module('bitty').service('layout', function ($rootScope) {
  var defaults = {
    containerClass: 'container',
    editor: false,
    fluid: false,
    navbar: true
  };
  var fluid = defaults.fluid;

  Object.defineProperty(this, 'fluid', {
    get: function () {
      return fluid;
    }.bind(this),
    set: function (value) {
      if (value) {
        this.containerClass = 'container-fluid';
      } else {
        this.containerClass = 'container';
      }
      fluid = value;
    }.bind(this)
  });

  $rootScope.$on('$stateChangeStart', function () {
    for (var setting in defaults) {
      if (defaults.hasOwnProperty(setting)) {
        this[setting] = defaults[setting];
      }
    }
  }.bind(this));
});
