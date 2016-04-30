/* jshint maxlen:false */

'use strict';

angular.module('bitty').directive('markedContent', function ($rootScope, $sanitize, $sce, marked) {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      content: '=markedContent',
      contentOwner: '=contentOwner',
      taskListUpdated: '&'
    },
    template: '<div ng-bind-html="markedContent"></div>',
    link: function (scope, element) {
      var taskElements = null;

      function enableDisableItems() {
        if (taskElements === null) {
          return;
        }

        if (scope.contentOwner && scope.contentOwner.user && !scope.contentOwner.$updating &&
            scope.contentOwner.user.login === $rootScope.getCurrentLogin()) {
          taskElements.removeAttr('disabled');
        } else {
          taskElements.attr('disabled', true);
        }
      }

      function parse(val) {
        if (typeof val === 'undefined' || val === null) {
          return;
        }

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

        requestAnimationFrame(function () {
          taskElements = element.find('.task-list-item input');
          taskElements.on('change', function () {
            scope.$apply(function () {
              scope.contentOwner.$taskListItems = [];
              taskElements.each(function () {
                scope.contentOwner.$taskListItems.push(this.checked);
              });
              scope.taskListUpdated({
                taskListItems: scope.contentOwner.$taskListItems
              });
            });
          });
          enableDisableItems();
        });
      }

      scope.$watch('content', parse);
      scope.$watch('contentOwner.$updating', function () {
        requestAnimationFrame(function () {
          taskElements = element.find('.task-list-item input');
          enableDisableItems();
        });
      });
      $rootScope.$watch('currentUser', enableDisableItems);
    }
  };
});
