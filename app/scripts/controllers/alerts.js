'use strict';

angular.module('bitty')
  .controller('AlertsCtrl', function ($scope, $rootScope, $timeout) {
    $scope.alerts = [];

    $rootScope.$on('newAlert', function (event, alert) {
      $scope.alerts.push(alert);
      if (alert.timeout) {
        $timeout(function () {
          $scope.closeAlert($scope.alerts.indexOf(alert));
        }, alert.timeout);
      }
    });

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };
  });
