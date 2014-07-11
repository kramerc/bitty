'use strict';

angular.module('bitty').directive('markedGist', function (marked) {
  return {
    restrict: 'AE',
    replace: true,
    scope: false,
    link: function (scope, element) {
      var taskElements;

      function enableDisableItems() {
        if (!scope.updating && scope.gist.user &&
            scope.gist.user.login === scope.getCurrentLogin()) {
          taskElements.removeAttr('disabled');
        } else {
          taskElements.attr('disabled', true);
        }
      }

      function parse(val) {
        element.html(marked(val, {
          breaks: false
        }));

        taskElements = element.find('.task-list-item input');
        taskElements.bind('change', function () {
          var taskListItems = [];
          taskElements.each(function () {
            taskListItems.push(this.checked);
          });
          scope.$apply(function () {
            scope.$parent.taskListItems = taskListItems;
          });
        });
        enableDisableItems();
      }

      parse(scope.file.content);

      scope.$watch('file.content', parse);
      scope.$watch('currentUser', enableDisableItems);
      scope.$watch('updating', enableDisableItems);
    }
  };
});
