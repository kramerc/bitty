'use strict';

angular.module('bitty').factory('Gist', function ($resource) {
  return $resource('/api/gists/:id', {
    id: '@id'
  });
});
