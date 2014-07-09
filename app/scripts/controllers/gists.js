/* jshint maxlen:false */

'use strict';

angular.module('bitty')
  .controller('GistCtrl', function ($scope) {
    var defaultConfig = {
      description: true,
      comments: false,
      meta: true,
      navbar: true
    };

    $scope.config = angular.copy(defaultConfig);

    $scope.defaultFilename = 'bit.md';
    $scope.configFilename = 'bitty.json';

    $scope.$on('$stateChangeStart', function () {
      $scope.config = angular.copy(defaultConfig);
    });
  })
  .controller('GistNoUserCtrl', function ($state, $stateParams, Gist) {
    Gist.get({id: $stateParams.id}, function (gist) {
      var login = 'anonymous';
      var newState = 'gist.show';

      if (gist.user) {
        login = gist.user.login;
      }

      if ($state.current.name === 'gist.editNoUser') {
        newState = 'gist.editor.edit';
      }

      $state.go(newState, {
        user: login,
        id: gist.id
      }, {
        location: 'replace'
      });
    });
  })
  .controller('GistEditorCtrl', function ($scope, $modal, $window, layout) {
    layout.editor = true;
    layout.fluid = true;
    layout.navbar = false;

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

    $scope.close = function () {
      $modalInstance.close();
    };
  })
  .controller('NewGistCtrl', function ($scope, $state, Gist) {
    var bitFile = $scope.defaultFilename;
    var configFile = $scope.configFilename;

    $scope.gist = new Gist({
      files: {},
      public: true
    });
    $scope.gist.files[bitFile] = {};
    $scope.gist.files[configFile] = {};

    $scope.save = function () {
      $scope.gist.files[bitFile].content = $scope.content;
      $scope.gist.files[configFile].content = $scope.stringifyConfig();

      $scope.gist.$create(function (gist) {
        $state.go('gist.show', {
          user: $scope.getCurrentLogin(),
          id: gist.id
        });
      });
    };
  })
  .controller('EditGistCtrl', function ($scope, $state, $stateParams, Gist, alert) {
    var configFile = $scope.configFilename;
    var firstFile;

    Gist.get({
      id: $stateParams.id
    }, function (gist) {
      if ($scope.currentUser && gist.user &&
          gist.user.login !== $scope.currentUser.login) {
        $state.go('gist.show', {id: gist.id});
        alert.emit({
          msg: 'You are not the owner of this gist.',
          type: 'danger'
        });
        return;
      } else if (!gist.user) {
        $state.go('gist.show', {id: gist.id});
        alert.emit({
          msg: 'Sorry, anonymous gists cannot be edited.',
          type: 'danger'
        });
        return;
      } else if (!$scope.currentUser) {
        $state.go('gist.show', {id: gist.id});
        alert.emit({
          msg: 'You need to be signed in to edit gists.',
          type: 'danger'
        });
        return;
      }

      Object.keys(gist.files).every(function (file) {
        if (file !== configFile) {
          firstFile = file;
          return false;
        }

        return true;
      });

      if (!gist.files[configFile]) {
        gist.files[configFile] = {};
      }

      $scope.gist = gist;
      $scope.content = gist.files[firstFile].content;
      if (gist.files[configFile].content) {
        $scope.$parent.config = JSON.parse(gist.files[configFile].content);
      }
    });

    $scope.save = function () {
      $scope.gist.files[firstFile].content = $scope.content;
      $scope.gist.files[configFile].content = $scope.stringifyConfig();
      $scope.gist.$update(function (gist) {
        $state.go('gist.show', {
          user: $scope.getCurrentLogin(),
          id: gist.id
        });
      });
    };
  })
  .controller('ShowGistCtrl', function ($scope, $stateParams, Gist, Comment, layout) {
    var configFile = $scope.configFilename;

    $scope.updating = true;

    function processGist(gist) {
      if (gist.files[configFile]) {
        angular.extend(
          $scope.config, JSON.parse(gist.files[configFile].content));
        delete gist.files[configFile];

        if ($scope.config.comments) {
          $scope.comments = Comment.query({gistId: $stateParams.id});
        }

        if (!$scope.config.navbar) {
          layout.navbar = false;
        }
      }
      $scope.gist = gist;
      $scope.updating = false;
    }

    $scope.taskListItems = [];

    $scope.comment = new Comment({gistId: $stateParams.id});

    $scope.postComment = function () {
      $scope.comment.$create(function (comment) {
        $scope.comments.push(comment);
        $scope.comment = new Comment();
      });
    };

    Gist.get({id: $stateParams.id}, processGist);

    $scope.$watch('taskListItems', function () {
      var index = 0;
      var file;

      if ($scope.gist && $scope.taskListItems.length > 0) {
        $scope.updating = true;

        file = $scope.gist.files[Object.keys($scope.gist.files)[0]];
        file.content = file.content.replace(/\s*\[[x ]\]\s*/g, function () {
          if ($scope.taskListItems[index++]) {
            return ' [x] ';
          }

          return ' [ ] ';
        });

        $scope.gist.$update(processGist);
      }
    });
  });
