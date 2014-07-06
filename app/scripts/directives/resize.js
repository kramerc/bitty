'use strict';

angular.module('bitty').directive('resize', function ($window) {
  return {
    link: function (scope, element, attrs) {
      var resizeAttrs = scope.$eval(attrs.resize);
      var offset = resizeAttrs.offset;

      scope.onResize = function () {
        scope.height = $window.innerHeight - offset.height;
        scope.width = $window.innerWidth - offset.width;
      };

      scope.onResize();

      angular.element($window).bind('resize', function () {
        scope.onResize();
        scope.$apply();
      });
    }
  };
});
