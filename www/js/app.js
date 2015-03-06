angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
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
        StatusBar.backgroundColorByHexString("#28a54c");
      } else {
        StatusBar.styleLightContent();
      }
    }
  });
})

.factory('Sessions', function($http) {
  // create an empty array
  var sessions = [];

  return {
    //Sessions.all()
    //will make an http get request
    //return the data, and make that data the value of sessions array
    all: function() {
      return $http.get("https://devnexus.com/s/presentations.json")
        .then(function(response) {
          sessions = response.data.presentationList.presentation;
          return sessions;
        });
    },
    //Session.get
    //Loop though all the objects in sessions
    //Look up the id in each object.
    get: function(sessionId) {
      for (i = 0; i < sessions.length; i++) {
        if (sessions[i].id == parseInt(sessionId)) {
          return sessions[i];
        }
      }
      return null;
    }
  };
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('menu', {
      url: "/",
      templateUrl: 'templates/menu.html',
      abstract: true
    })
    // Lets create 2 states, a master/detail setup
    .state('sessions', {
      url: '/sessions',
      view: {
        'menu-view': {
          templateUrl: 'templates/sessions.html',
          controller: 'SessionsCtrl'
        }
      }
    })
    .state('session', {
      url: '/sessions/:sessionId',
      view: {
        'menu-view': {
          controller: 'SessionCtrl',
          templateUrl: 'templates/session.html'
        }
      }
    });
  $urlRouterProvider.otherwise('/sessions');
})

.controller('SessionsCtrl', function($scope, Sessions, $ionicLoading, $ionicScrollDelegate) {
  $ionicLoading.show({
    template: '<ion-spinner class="spinner-light"></ion-spinner>',
    noBackdrop: true
  });

  Sessions.all().then(function(data) {
    $scope.sessions = data;
    $ionicLoading.hide();
  });

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop(false);
  };

  $scope.resize = function() {
    $ionicScrollDelegate.resize();
  };
  $scope.clearSearch = function() {
    $scope.searchSessions = '';

    $scope.inputUp = function() {
      if (isIOS) $scope.data.keyboardHeight = 216;
      $timeout(function() {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);
    };

    $scope.inputDown = function() {
      if (isIOS) $scope.data.keyboardHeight = 0;
      $ionicScrollDelegate.resize();
    };
  }
})

.controller('SessionCtrl', function($scope, Sessions, $stateParams, $cordovaSocialSharing, $cordovaCamera) {
  $scope.session = Sessions.get($stateParams.sessionId);

  $scope.share = function(session) {
    // Message var that grabs the session title and speaker info
    var message = "Attending " + session.title + " by " + session.speakers[0].firstName + " " + session.speakers[0].lastName + ". #DevNexus2015";

    //Lets call the camper api
    $cordovaCamera.getPicture().then(function(imageURI) {
      //create a photo var that will grab the image data
      //from the imageURI create by camera plugin
      var photo = imageURI;
      //Lets share that via social sharing plugin
      $cordovaSocialSharing
      //Share via twitter, and pass in the message & photo
        .shareViaTwitter(message, photo)
        .then(function(result) {
          // Success!
          console.log("Success!");
          //Write to console if everything worked
        }, function(err) {
          //If for some reason the app doesn work,
          //Show an alert to inform the user
          alert("Ruh-roh, looks like something went wrong :(");
        });
      //End Social sharing code

    }, function(err) {
      //If there's an error with the camera, lets log that error
      console.log(err);
    }, {
      // Variables that we pass into the camera api
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    });
  };
});
// .directive('input', function($timeout) {
//   return {
//     restrict: 'E',
//     scope: {
//       'returnClose': '=',
//       'onReturn': '&',
//       'onFocus': '&',
//       'onBlur': '&'
//     },
//     link: function(scope, element, attr) {
//       element.bind('focus', function(e) {
//         if (scope.onFocus) {
//           $timeout(function() {
//             scope.onFocus();
//           });
//         }
//       });
//       element.bind('blur', function(e) {
//         if (scope.onBlur) {
//           $timeout(function() {
//             scope.onBlur();
//           });
//         }
//       });
//       element.bind('keydown', function(e) {
//         if (e.which == 13) {
//           if (scope.returnClose) element[0].blur();
//           if (scope.onReturn) {
//             $timeout(function() {
//               scope.onReturn();
//             });
//           }
//         }
//       });
//     }
//   };
// });
