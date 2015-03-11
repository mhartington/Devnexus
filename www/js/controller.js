angular.module('devnexus.controllers', [])

.controller('SessionsCtrl', function($scope, Sessions, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs) {
  $scope.doSearch = function() {
    cordova.plugins.Keyboard.close();
  };
  $scope.sessions = [];
  $scope.load = function() {
    $ionicLoading.show({
      template: '<ion-spinner class="spinner-light"></ion-spinner>',
      noBackdrop: true
    });

    Sessions.all().then(function(data) {
      $scope.sessions = data;
      $scope.hasError = false;
      $ionicLoading.hide();
    }, function(err) {
      $cordovaDialogs.alert('Ugh-oh, there was an error', 'Try Again?')
        .then(function() {
          $scope.hasError = true;
        });
      $ionicLoading.hide();

    });
  };
  $scope.load();
  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop(false);
  };

  $scope.resize = function() {
    $ionicScrollDelegate.resize();
  };
  $scope.clearSearch = function() {
    $scope.searchSessions = '';
    cordova.plugins.Keyboard.close();

  };
})

.controller('SessionCtrl', function($scope, Sessions, $stateParams, $cordovaSocialSharing, $cordovaCamera) {
  $scope.session = Sessions.get($stateParams.sessionId);

  $scope.share = function(session) {
    // Message var that grabs the session title and speaker info
    var message = "Attending " + session.title + " by " + session.speakers[0].firstName + " " + session.speakers[0].lastName + ". #DevNexus2015";

    // Variables that we pass into the camera api
    var options = {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: true
    };
    //Lets call the camper api
    $cordovaCamera.getPicture(options).then(function(imageURI) {
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
      alert("Something went wrong, please try again");
    });
  };
})

.controller('SpeakersCtrl', function($scope, Speakers, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs) {
  $scope.doSearch = function() {
    cordova.plugins.Keyboard.close();
  };

  $scope.speakers = [];
  $scope.load = function() {

    $ionicLoading.show({
      template: '<ion-spinner class="spinner-light"></ion-spinner>',
      noBackdrop: true
    });
    Speakers.all().then(function(data) {
      $scope.speakers = data;
      $scope.hasError = false;
      $ionicLoading.hide();
    }, function(err) {
      $cordovaDialogs.alert('Ugh-oh, there was an error', 'Try Again?')
        .then(function() {
          $scope.hasError = true;
        });

      $ionicLoading.hide();
    });
  };
  $scope.load();
  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop(false);
  };

  $scope.resize = function() {
    $ionicScrollDelegate.resize();
  };
  $scope.clearSearch = function() {
    $scope.searchSessions = '';
    cordova.plugins.Keyboard.close();

  };
})

.controller('SpeakerCtrl', function($scope, Speakers, $stateParams) {
  $scope.speaker = Speakers.get($stateParams.speakerId);

})

.controller('WindowCtrl', function($scope) {
  $scope.place = {};
  $scope.showPlaceDetails = function(param) {
    $scope.place = param;
  }
})

.controller("MapCtrl", function($scope, $timeout, $log, $http, uiGmapGoogleMapApi) {
$scope.doSearch = function() {
    cordova.plugins.Keyboard.close();
  };
  $log.doLog = true

  $scope.$watch('searchModel.searchTerm', function(newValue, oldValue) {
    if (newValue == oldValue) {
      return null;
    } else {
      //console.log("the value changed to " + newValue);
    }

  });


  uiGmapGoogleMapApi.then(function(maps) {
    maps.visualRefresh = true;
    $scope.defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(33.8932314, -84.66450),
      new google.maps.LatLng(33.8832314, -84.31715));


    $scope.map.bounds = {
      northeast: {
        latitude: $scope.defaultBounds.getNorthEast().lat(),
        longitude: $scope.defaultBounds.getNorthEast().lng()
      },
      southwest: {
        latitude: $scope.defaultBounds.getSouthWest().lat(),
        longitude: -$scope.defaultBounds.getSouthWest().lng()

      }
    }
    $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
  });

  $scope.map = {
    control: {},
    center: {
      latitude: 33.8832314,
      longitude: -84.4664714
    },
    zoom: 12,
    dragging: false,
    bounds: {},
    markers: [],
    idkey: 'place_id',
    events: {
      idle: function(map) {

      },
      dragend: function(map) {
        //update the search box bounds after dragging the map
        var bounds = map.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
      }
    }
  }


  $scope.selected = {
    options: {
      visible: false

    },
    templateurl: 'window.tpl.html',
    templateparameter: {}
  };


  $scope.searchbox = {
    template: 'searchbox.tpl.html',
    options: {
      bounds: {}
    },
    parentdiv: 'searchBoxParent',
    events: {
      places_changed: function(searchBox) {

        places = searchBox.getPlaces()

        if (places.length === 0) {
          return;
        }
        // For each place, get the icon, place name, and location.
        newMarkers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          // Create a marker for each place.
          var marker = {
            id: i,
            place_id: place.place_id,
            name: place.name,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            options: {
              visible: false
            },
            templateurl: 'window.tpl.html',
            templateparameter: place
          };
          newMarkers.push(marker);

          bounds.extend(place.geometry.location);
        }

        $scope.map.bounds = {
          northeast: {
            latitude: bounds.getNorthEast().lat(),
            longitude: bounds.getNorthEast().lng()
          },
          southwest: {
            latitude: bounds.getSouthWest().lat(),
            longitude: bounds.getSouthWest().lng()
          }
        }

        _.each(newMarkers, function(marker) {
          marker.closeClick = function() {
            $scope.selected.options.visible = false;
            marker.options.visble = false;
            return $scope.$apply();
          };
          marker.onClicked = function() {
            $scope.selected.options.visible = false;
            $scope.selected = marker;
            $scope.selected.options.visible = true;
          };
        });

        $scope.map.markers = newMarkers;
      }
    }
  };



});
