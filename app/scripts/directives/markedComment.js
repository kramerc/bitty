'use strict';

angular.module('bitty').directive('markedComment', function (marked) {
  return {
    restrict: 'AE',
    replace: true,
    scope: false,
    link: function (scope, element) {
      var taskElements;
      var lexer = new marked.Lexer();
      lexer.rules.heading = /^ *(#{1,6} ) *([^\n]+?) *#* *(?:\n+|$)/;

      function enableDisableItems() {
        if (!scope.updating && scope.comment.user &&
            scope.comment.user.login === scope.getCurrentLogin()) {
          taskElements.removeAttr('disabled');
        } else {
          taskElements.attr('disabled', true);
        }
      }

      function parse(val) {
        element.html(marked.parser(lexer.lex(val)));

        taskElements = element.find('.task-list-item input');
        taskElements.bind('change', function () {
          var taskListItems = [];
          taskElements.each(function () {
            taskListItems.push(this.checked);
          });
          scope.$apply(function () {
            scope.comment.taskListItems = taskListItems;
            scope.updateComment(scope.comment);
          });
        });
        enableDisableItems();
      }

      parse(scope.comment.body);

      scope.$watch('comment.body', parse);
      scope.$watch('currentUser', enableDisableItems);
      scope.$watch('updating', enableDisableItems);
    }
  };
});
