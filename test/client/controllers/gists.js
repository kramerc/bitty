'use strict';

var expect = chai.expect;

describe('GistCtrl', function () {
  beforeEach(module('bitty'));

  var GistCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GistCtrl = $controller('GistCtrl', {
      $scope: scope
    });
  }));

  it('attaches a default config', function () {
    expect(scope.config.description).to.be.true;
    expect(scope.config.comments).to.not.be.true;
    expect(scope.config.meta).to.be.true;
    expect(scope.config.navbar).to.be.true;
  });
});
