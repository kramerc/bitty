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

    $scope.file = {
      content: ''
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
    $scope.gist.files[bitFile] = $scope.bitFile = {};
    $scope.gist.files[configFile] = {};

    $scope.save = function () {
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
      $scope.bitFile = gist.files[firstFile];
      if (gist.files[configFile].content) {
        $scope.$parent.config = JSON.parse(gist.files[configFile].content);
      }
    });

    $scope.save = function () {
      $scope.gist.files[configFile].content = $scope.stringifyConfig();
      $scope.gist.$update(function (gist) {
        $state.go('gist.show', {
          user: $scope.getCurrentLogin(),
          id: gist.id
        });
      });
    };
  })
  .controller('ShowGistCtrl', function ($document, $modal, $scope, $stateParams, Gist, Comment, layout) {
    var configFile = $scope.configFilename;
    var taskListItemRegex = /\s*\[[x ]\]\s*/g;
    var taskListItemChecked = ' [x] ';
    var taskListItemUnchecked = ' [ ] ';

    $scope.gist = {};
    $scope.gist.$updating = true;

    function processGist(gist) {
      var title = ' | Bitty';

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

      if (gist.description) {
        title = gist.description + title;
      } else {
        title = 'gist:' + gist.id + title;
      }
      $document.prop('title', title);

      $scope.gist = gist;
      $scope.gist.$taskListItems = [];
      $scope.gist.$updating = false;
    }

    $scope.comment = new Comment({gistId: $stateParams.id});

    $scope.editComment = function (comment) {
      comment.editing = true;
      comment.originalBody = angular.copy(comment.body);
    };

    $scope.cancelEditComment = function (comment) {
      comment.editing = false;
      comment.body = comment.originalBody;
      delete comment.originalBody;
    };

    $scope.deleteComment = function (index) {
      var comment = $scope.comments[index];

      $modal.open({
        templateUrl: 'templates/modals/confirm.html',
        controller: 'ConfirmCtrl',
        resolve: {
          confirm: function () {
            return {
              title: 'Are you sure?',
              body: 'This action cannot be undone.',
              ok: 'Delete',
              okClass: 'btn-danger'
            };
          }
        }
      }).result.then(function () {
        comment.$delete({
          gistId: $stateParams.id,
          id: comment.id
        }, function () {
          $scope.comments.splice(index, 1);
        });
      });

    };

    $scope.postComment = function () {
      $scope.comment.$create(function (comment) {
        $scope.comments.push(comment);
        $scope.comment = new Comment();
      });
    };

    $scope.updateComment = function (comment) {
      var index = 0;

      comment.$updating = true;

      if (comment.$taskListItems) {
        comment.body = comment.body.replace(taskListItemRegex, function () {
          if (comment.$taskListItems[index++]) {
            return taskListItemChecked;
          }

          return taskListItemUnchecked;
        });
        delete comment.$taskListItems;
      }

      delete comment.originalBody;

      comment.$update({gistId: $stateParams.id}, function () {
        comment.$updating = false;
      });
    };

    Gist.get({id: $stateParams.id}, processGist);

    $scope.gistTaskListUpdated = function (taskListItems) {
      var index = 0;
      var file;

      if (!taskListItems) {
        return;
      }

      if ($scope.gist && taskListItems.length > 0) {
        $scope.gist.$updating = true;

        file = $scope.gist.files[Object.keys($scope.gist.files)[0]];
        file.content = file.content.replace(taskListItemRegex, function () {
          if (taskListItems[index++]) {
            return taskListItemChecked;
          }

          return taskListItemUnchecked;
        });

        $scope.gist.$update(processGist);
      }
    };
  });
