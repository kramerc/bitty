'use strict';

angular.module('bitty').directive('editorBox', function ($location, $modal) {
  return {
    restrict: 'AE',
    link: function (scope, element) {
      var confirmMsg = 'You will lose any unsaved changes.';

      element.addClass('editor-box');

      scope.dirty = false;

      scope.aceChanged = function () {
        scope.dirty = true;
      };

      scope.aceLoaded = function (editor) {
        editor.setShowPrintMargin(false);
      };

      window.onbeforeunload = function () {
        if (scope.dirty) {
          return confirmMsg;
        }
      };

      element.bind('$destroy', function () {
        window.onbeforeunload = null;
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
          $location.url(next);
        });
      });
    },
    templateUrl: 'templates/directives/editorBox.html'
  };
});
