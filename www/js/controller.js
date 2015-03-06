angular.module('devnexus.controllers', [])

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
  };
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
})


.controller('SpeakersCtrl', function($scope, Speakers, $ionicLoading, $ionicScrollDelegate) {
  $ionicLoading.show({
    template: '<ion-spinner class="spinner-light"></ion-spinner>',
    noBackdrop: true
  });
  $scope.speakers = [];
  Speakers.all().then(function(data) {
    $scope.speakers = data;
    $ionicLoading.hide();
  }, function(err) {
    console.log(err);
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
  };
})

.controller('SpeakerCtrl', function($scope, Speakers, $stateParams){
  $scope.speaker= Speakers.get($stateParams.speakerId);

});
