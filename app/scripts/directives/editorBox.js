'use strict';

angular.module('bitty').directive('editorBox', function () {
  return {
    restrict: 'AE',
    link: function (scope, element) {
      element.addClass('editor-box');

      scope.aceLoaded = function (editor) {
        editor.setShowPrintMargin(false);
      };
    },
    templateUrl: 'templates/directives/editorBox.html'
  };
});
