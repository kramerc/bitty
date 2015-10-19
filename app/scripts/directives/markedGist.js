/* jshint maxlen:false */

'use strict';

angular.module('bitty').directive('markedGist', function ($sanitize, $sce, marked) {
  return {
    restrict: 'AE',
    replace: true,
    scope: false,
    template: '<div ng-bind-html="markedContent"></div>',
    link: function (scope, element) {
      var taskElements;

      function enableDisableItems() {
        if (!scope.updating && scope.gist && scope.gist.user &&
            scope.gist.user.login === scope.getCurrentLogin()) {
          taskElements.removeAttr('disabled');
        } else {
          taskElements.attr('disabled', true);
        }
      }

      function parse(val) {
        var taskListItemRegex = /<li class="task-list-item">.*<\/li>/g;

        scope.markedContent = $sanitize(marked(val, {
          breaks: false
        }));

        // Add inputs to task list items
        var items = scope.markedContent.match(taskListItemRegex);
        if (items !== null) {
          items.forEach(function (item) {
            var replacedItem;
            replacedItem = item
              .replace(/\[ \]/g, '<input type="checkbox" disabled> ')
              .replace(/\[x\]/g, '<input type="checkbox" checked disabled> ')
              .replace(/\[X\]/g, '<input type="checkbox" checked disabled> ');
            scope.markedContent = scope.markedContent.replace(item, replacedItem);
          });
        }

        scope.markedContent = $sce.trustAsHtml(scope.markedContent);

        taskElements = element.find('.task-list-item input');
        taskElements.on('change', function () {
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
      scope.$watch('updating', function () {
        taskElements = element.find('.task-list-item input');
        enableDisableItems();
      });
    }
  };
});
