'use strict';

angular.module('bitty').factory('Comment', function ($resource) {
  return $resource('/api/gists/:gistId/comments/:id', {
    gistId: '@gistId'
  }, {
    create: {
      method: 'POST',
      params: {
        gistId: '@gistId',
        id: ''
      }
    },
    update: {
      method: 'PUT',
      params: {
        gistId: '@gistId',
        id: '@id'
      }
    }
  });
});
