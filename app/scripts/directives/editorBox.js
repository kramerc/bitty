'use strict';

angular.module('bitty')
  .directive('editorBox', function ($location, $modal, $window) {
    return {
      restrict: 'AE',
      link: function (scope, element) {
        var confirmMsg = 'You will lose any unsaved changes.';
        var popping = false;
        var win = angular.element($window);

        element.addClass('editor-box');

        scope.dirty = false;

        scope.aceChanged = function () {
          scope.dirty = true;
        };

        scope.aceLoaded = function (editor) {
          editor.setShowPrintMargin(false);
        };

        function beforeunloadListener() {
          if (scope.dirty) {
            return confirmMsg;
          }
        }

        function popstateListener() {
          popping = true;
        }

        win.bind('beforeunload', beforeunloadListener);
        win.bind('popstate', popstateListener);

        element.bind('$destroy', function () {
          win.unbind('beforeunload', beforeunloadListener);
          win.unbind('popstate', popstateListener);
        });

        scope.$on('$locationChangeStart', function (event, next) {
          if (!scope.dirty) {
            return;
          }

          event.preventDefault();
          $modal.open({
            templateUrl: 'templates/modals/confirm.html',
            controller: 'ConfirmCtrl',
            resolve: {
              confirm: function () {
                return {
                  title: 'Are you sure?',
                  body: confirmMsg
                };
              }
            }
          }).result.then(function () {
            // Confirmed
            scope.dirty = false;

            if (popping) {
              $window.history.back();
            } else {
              $location.$$parse(next);
            }
          }, function () {
            popping = false;
          });
        });
      },
      templateUrl: 'templates/directives/editorBox.html'
    };
  });
