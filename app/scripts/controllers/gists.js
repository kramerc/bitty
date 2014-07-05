/* jshint maxlen:false */

'use strict';

angular.module('bitty')
  .controller('ShowGistCtrl', function ($scope, $stateParams, Gist, Comment, layout) {
    $scope.config = {
      description: true,
      comments: false,
      navbar: true
    };

    $scope.comment = new Comment({gistId: $stateParams.id});

    $scope.postComment = function () {
      $scope.comment.$create(function (comment) {
        $scope.comments.push(comment);
        $scope.comment = new Comment();
      });
    };

    Gist.get({
      id: $stateParams.id
    }, function (gist) {
      if (gist.files['_bitty.json']) {
        angular.extend(
          $scope.config, JSON.parse(gist.files['_bitty.json'].content));
        delete gist.files['_bitty.json'];

        if ($scope.config.comments) {
          $scope.comments = Comment.query({gistId: $stateParams.id});
        }

        if (!$scope.config.navbar) {
          layout.navbar = false;
        }
      }
      $scope.gist = gist;
    });
  });
