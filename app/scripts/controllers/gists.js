'use strict';

angular.module('bitty')
  .controller('ShowGistCtrl', function ($scope, $stateParams, Gist) {
    Gist.get({
      id: $stateParams.id
    }, function (gist) {
      $scope.gist = gist;
    });
  });
