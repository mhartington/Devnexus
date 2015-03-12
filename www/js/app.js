angular.module('devnexus', [
  'ionic',
  'ngCordova',
  'devnexus.factory',
  'devnexus.controllers',
  'uiGmapgoogle-maps'
])

.run(function($ionicPlatform, $timeout) {
  // This is an ionic wrapper for cordova's
  // device ready event.
  $ionicPlatform.ready(function() {
    // if we have the keyboard plugin, let use it
    if (window.cordova && window.cordova.plugins.Keyboard) {
      //Lets hide the accessory bar fo the keyboard (ios)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // also, lets disable the native overflow scroll
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      if (ionic.Platform.isAndroid()) {
        StatusBar.backgroundColorByHexString("#608628");
      } else {
        StatusBar.styleLightContent();
      }
    }
    $timeout(function() {
      navigator.splashscreen.hide();
    }, 500);
  });
})


.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    v: '3.17',
    libraries: 'places'
  });

  $stateProvider

    .state('menu', {
    url: '/menu',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('menu.sessions', {
    url: "/sessions",
    views: {
      'menuContent': {
        templateUrl: "templates/sessions.html",
        controller: 'SessionsCtrl'
      }
    }
  })

  .state('menu.session', {
    url: '/sessions/:sessionId',
    views: {
      'menuContent': {
        templateUrl: 'templates/session.html',
        controller: 'SessionCtrl',
      }
    }
  })

  .state('menu.speakers', {
    url: '/speakers',
    views: {
      'menuContent': {
        templateUrl: 'templates/speakers.html',
        controller: 'SpeakersCtrl',
      }
    }
  })

  .state('menu.speaker', {
    url: '/speakers/:speakerId',
    views: {
      'menuContent': {
        templateUrl: 'templates/speaker-detail.html',
        controller: 'SpeakerCtrl',
      }
    }
  })

  .state('menu.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('menu.venue', {
    url: '/venue',
    views: {
      'menuContent': {
        templateUrl: 'templates/venue.html'
      }
    }
  });

  $urlRouterProvider.otherwise('/menu/sessions');
});
