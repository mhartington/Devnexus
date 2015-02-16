angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
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
        templateUrl: 'templates/presentation.html',
        resolve: {
          session: function($stateParams, sessions) {
            return sessions.ready.then(function() {
              return sessions.list[+$stateParams.index];
            });
          }
        }
    });
  $urlRouterProvider.otherwise('/sessions');
})

.factory('Sessions', function($http, $q) {
  var sessions = {};
  sessions.list = [];
  sessions.add = function() {
    return $http.get("https://devnexus.com/s/presentations.json")
      .then(function(response) {
        sessions.list.push(response.data.presentationList.presentation);
        console.log(response.data.presentationList.presentation)
      });
  };
  sessions.ready = $q.all([
    sessions.add()
  ]);
  return sessions;
})


.controller('SessionsCtrl', function($scope, Sessions, $ionicLoading) {
  $scope.sessions = Sessions.list;
  $ionicLoading.show({
    template: '<ion-spinner class="spinner-light"></ion-spinner>',
    noBackdrop: true
  });
  Sessions.ready.then(function() {
    $ionicLoading.hide();
  });
})

.controller('SessionCtrl', function($scope, session, Session, $ionicHistory) {
  $scope.session = session;
});
