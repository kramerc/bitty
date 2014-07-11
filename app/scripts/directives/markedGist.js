'use strict';

angular.module('bitty').directive('markedGist', function (marked) {
  return {
    restrict: 'AE',
    replace: true,
    scope: false,
    link: function (scope, element) {
      var renderer = new marked.Renderer();
      var taskElements;

      renderer.list = function (body, ordered) {
        var type = ordered ? 'ol' : 'ul';
        var list = '<' + type + '>\n' + body + '</' + type + '>\n';
        if (/<li class="task-list-item">/.test(body)) {
          list = list.replace(
            '<' + type + '>', '<' + type + ' class="task-list">');
        }
        return list;
      };
      renderer.listitem = function (text) {
        if (/^\s*\[[x ]\]\s*/.test(text)) {
          text = text
            .replace(/^\s*\[ \]\s*/, '<input type="checkbox"> ')
            .replace(/^\s*\[x\]\s*/, '<input type="checkbox" checked> ');
          return '<li class="task-list-item">' + text + '</li>';
        }

        return '<li>' + text + '</li>';
      };

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
          breaks: false,
          renderer: renderer
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
