'use strict';

angular.module('bitty').factory('alert', function ($rootScope) {
  return {
    emit: function (alert) {
      $rootScope.$emit('newAlert', angular.extend({
        timeout: 15000
      }, alert));
    }
  };
});
