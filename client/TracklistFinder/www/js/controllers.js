angular.module('starter.controllers', [])

.config(function($httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.factory('tracklistFactory', function($http, $q) {
    return {
        apiPath: 'http://tf-server.rafael-santos.com/',
        getTracklists: function() {
            var deferred = $q.defer();

            //Calling Web API to fetch search results
            $http.get(this.apiPath).success(function(data) {
                //Passing data to deferred's resolve function on successful completion
                deferred.resolve(data);

            }).error(function() {
                //Sending a friendly error message in case of failure
                deferred.reject('An error occured while fetching items');
            });

            //Returning the promise object
            return deferred.promise;
        },
        searchTracklists: function(term) {
            var deferred = $q.defer();

            //Calling Web API to fetch search results
            $http.get(this.apiPath + "search/" + term).success(function(data) {
                //Passing data to deferred's resolve function on successful completion
                deferred.resolve(data);

            }).error(function() {
                //Sending a friendly error message in case of failure
                deferred.reject('An error occured while fetching items');
            });

            //Returning the promise object
            return deferred.promise;
        },
        getFullTracklist: function(slug) {
            var deferred = $q.defer();

            //Calling Web API to fetch search results
            $http.get(this.apiPath + "tracklist/" + slug).success(function(data) {
                //Passing data to deferred's resolve function on successful completion
                deferred.resolve(data);

            }).error(function() {
                //Sending a friendly error message in case of failure
                deferred.reject('An error occured while fetching items');
            });

            //Returning the promise object
            return deferred.promise;
        }
    };
})

.controller('AppCtrl', function($scope) {
})

.controller('TracklistsCtrl', function($scope, tracklistFactory) {
    $scope.tracklists = [];

    function refreshItems(){
        tracklistFactory
        .getTracklists()
        .then(function(data) {
            $scope.tracklists = data;
        },
        function(errorMessage) {
            $scope.error = errorMessage;
        });
    }
     
    refreshItems();
})

.controller('TracklistCtrl', function($scope, tracklistFactory, $stateParams) {
    $scope.fullTracklist = [];

    function loadTracklist(){
        tracklistFactory
        .getFullTracklist($stateParams.slug)
        .then(function(data) {
            $scope.fullTracklist = data;
        },
        function(errorMessage) {
            $scope.error = errorMessage;
        });
    }
     
    loadTracklist();
})

.controller('SearchCtrl', function($scope, tracklistFactory, $stateParams) {
    $scope.tracklists = [];

    function makeSearch(term){
        tracklistFactory
        .searchTracklists(term)
        .then(function(data) {
            $scope.tracklists = data;
        },
        function(errorMessage) {
            $scope.error = errorMessage;
        });
    }

    if ($stateParams.term) {
        $scope.term = $stateParams.term;
        makeSearch($stateParams.term);
    }
    
    $scope.doSearch = function() {
        window.location.href += "/" + this.term;
    }
});
