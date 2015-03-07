angular.module('devnexus.factory', [])
  .factory('Sessions', function($http) {
    // create an empty array
    var sessions = [];

    return {
      //Sessions.all()
      //will make an http get request
      //return the data, and make that data the value of sessions array
      all: function() {
        // Lets cache the data
        if (!winddow.localStorage.localSessions) {
          ///Lets fetch data
          return $http.get("https://devnexus.com/s/presentations.json")
            .then(function(responce) {
              sessions = responce.data.presentationList.presentation;
              window.localStorage.localSessions = sessions;
              return sessions;
            });
        } else {
          ///lets set sessions to local storage
          sessions = window.localStorage.localSessions;
          return sessions;
        }
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

.factory('Speakers', function($http) {
  // create an empty array
  var speakers = [];

  return {
    all: function() {
      return $http.get('https://devnexus.com/s/speakers.json')
        .then(function(responce) {
          console.log(responce);
          speakers = responce.data.speakerList.speaker;
          return speakers;
        });
    },
    get: function(speakerId) {
      for (i = 0; i < speakers.length; i++) {
        if (speakers[i].id == parseInt(speakerId)) {
          return speakers[i];
        }
      }
      return null;
    }
  };
});
