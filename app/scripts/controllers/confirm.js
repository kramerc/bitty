'use strict';

angular.module('bitty')
  .controller('ConfirmCtrl', function ($scope, $modalInstance, confirm) {
    $scope.confirm = angular.extend({
      title: 'Are you sure?',
      body: 'Please confirm that you want to this.',
      cancel: 'Cancel',
      ok: 'OK',
      okClass: 'btn-primary'
    }, confirm);

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
      $modalInstance.close();
    };
  });
