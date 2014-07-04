'use strict';

angular.module('bitty')
  .controller('ShowGistCtrl', function ($scope, $stateParams, Gist, Comment) {
    $scope.config = {
      description: true,
      comments: false
    };

    Gist.get({
      id: $stateParams.id
    }, function (gist) {
      if (gist.files['_bitty.json']) {
        $scope.config = JSON.parse(gist.files['_bitty.json'].content);
        delete gist.files['_bitty.json'];

        if ($scope.config.comments) {
          $scope.comments = Comment.query({gistId: $stateParams.id});
        }
      }
      $scope.gist = gist;
    });
  });
