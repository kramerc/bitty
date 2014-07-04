'use strict';

angular.module('bitty').factory('Comment', function ($resource) {
  return $resource('/api/gists/:gistId/comments', {
    gistId: '@gistId'
  }, {
    create: {
      method: 'POST',
      params: {
        gistId: '@gistId'
      }
    }
  });
});
