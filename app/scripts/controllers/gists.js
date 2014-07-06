/* jshint maxlen:false */

'use strict';

angular.module('bitty')
  .controller('GistEditorCtrl', function ($scope, layout) {
    layout.editor = true;
    layout.fluid = true;
    layout.navbar = false;
  })
  .controller('NewGistCtrl', function ($scope, $state, Gist) {
    $scope.gist = new Gist({
      files: {
        'bit.md': {
        }
      }
    });

    $scope.save = function () {
      $scope.gist.files['bit.md'].content = $scope.content;
      $scope.gist.$create(function (gist) {
        $state.go('gist.show', {
          id: gist.id
        });
      });
    };
  })
  .controller('EditGistCtrl', function ($scope, $state, $stateParams, Gist) {
    var firstFile;

    Gist.get({
      id: $stateParams.id
    }, function (gist) {
      Object.keys(gist.files).every(function (file) {
        if (file !== '_bitty.json') {
          firstFile = file;
          return false;
        }

        return true;
      });

      $scope.gist = gist;
      $scope.content = gist.files[firstFile].content;
    });

    $scope.save = function () {
      $scope.gist.files[firstFile].content = $scope.content;
      $scope.gist.$update(function (gist) {
        $state.go('gist.show', {
          id: gist.id
        });
      });
    };
  })
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
