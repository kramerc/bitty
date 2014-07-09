'use strict';

angular.module('bitty').directive('markedComment', function (marked) {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      markedComment: '='
    },
    link: function (scope, element, attrs) {
      var lexer = new marked.Lexer();
      lexer.rules.heading = /^ *(#{1,6} ) *([^\n]+?) *#* *(?:\n+|$)/;

      function parse(val) {
        element.html(marked.parser(lexer.lex(val)));
      }

      parse(scope.markedComment || element.text() || '');

      if (attrs.markedComment) {
        scope.$watch('markedComment', parse);
      }
    }
  };
});
