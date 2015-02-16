angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('sessions', function($http, $q) {
  var sessions = {};
  sessions.list = [];
  sessions.all = function() {
    return $http.get('https://devnexus.com/s/presentations.json')
      .then(function(response) {
        sessions.list.push(response.data.presentationList.presentation);
      });
  };
  sessions.ready = $q.all([
    sessions.all()
  ]);
  return sessions;
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('sessions', {
      url: '/sessions',
      templateUrl: 'templates/sessions.html',
      controller: 'SessionsCtrl'
    })
    .state('session', {
      url: '/sessions/:index',
      controller: 'SessionCtrl',
      templateUrl: 'templates/presentation.html'
    });
  $urlRouterProvider.otherwise('/sessions');
})


.controller('SessionsCtrl', function($scope, sessions, $ionicLoading) {
  $ionicLoading.show({
    template: '<ion-spinner class="spinner-light"></ion-spinner>'
  });

  $scope.sessions = sessions.list;

  sessions.ready.then(function() {
    $ionicLoading.hide();
  });



})

.controller('SessionCtrl', function($scope, Sessions, $stateParams) {
  //  $scope.session = Sessions.get($stateParams.index);
});
