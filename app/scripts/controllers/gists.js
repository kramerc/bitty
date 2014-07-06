/* jshint maxlen:false */

'use strict';

angular.module('bitty')
  .controller('GistEditorCtrl', function ($scope, $modal, $window, layout) {
    layout.editor = true;
    layout.fluid = true;
    layout.navbar = false;

    $scope.config = {
      description: true,
      comments: false,
      meta: true,
      navbar: true,
      public: true
    };

    $scope.back = function () {
      $window.history.back();
    };

    $scope.openOptions = function (gist) {
      return $modal.open({
        templateUrl: 'templates/modals/gists/editorOptions.html',
        controller: 'GistOptionsModalCtrl',
        resolve: {
          config: function () {
            return $scope.config;
          },
          gist: function () {
            return gist;
          }
        }
      }).result;
    };

    $scope.stringifyConfig = function () {
      return JSON.stringify($scope.config, null, 2);
    };
  })
  .controller('GistOptionsModalCtrl', function ($scope, $modalInstance, config, gist) {
    $scope.config = config;
    $scope.gist = gist;

    $scope.set = function () {
      $modalInstance.close();
    };
  })
  .controller('NewGistCtrl', function ($scope, $state, Gist) {
    $scope.gist = new Gist({
      files: {
        'bit.md': {},
        'bitty.json': {}
      }
    });

    $scope.save = function () {
      $scope.gist.files['bit.md'].content = $scope.content;
      $scope.gist.files['bitty.json'].content = $scope.stringifyConfig();
      $scope.gist.public = $scope.config.public;

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
        if (file !== 'bitty.json') {
          firstFile = file;
          return false;
        }

        return true;
      });

      if (!gist.files['bitty.json']) {
        gist.files['bitty.json'] = {};
      }

      $scope.gist = gist;
      $scope.content = gist.files[firstFile].content;
      $scope.$parent.config = JSON.parse(gist.files['bitty.json'].content);
    });

    $scope.save = function () {
      $scope.gist.files[firstFile].content = $scope.content;
      $scope.gist.files['bitty.json'].content = $scope.stringifyConfig();
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
      meta: true,
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
      if (gist.files['bitty.json']) {
        angular.extend(
          $scope.config, JSON.parse(gist.files['bitty.json'].content));
        delete gist.files['bitty.json'];

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
