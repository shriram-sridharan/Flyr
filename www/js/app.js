// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('flyr', ['ionic'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "home.html",
      controller: 'MainCtrl'
    })
    .state('infoflyer', {
      url: "/infoflyer/:itemId",
      templateUrl: "infoflyer.html"
    })

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise("/home");
})

.controller('InfoFlyerCtrl', function($scope, $stateParams) {
  var i = 0;
  $scope.getFlyer = function() {
    alert("Getting Flyer" + i);
  }
})

.value('latitute', 0)
.value('longitude', 0)

.controller('GeoLocationCtrl', function($scope, $interval, $ionicPlatform, $ionicLoading) {
  function locationGetOnError(error) {
    //Put this in pop up later
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        alert('Please kill and restart app \n');
  }

  function getLoc() {

    navigator.geolocation.getCurrentPosition(function(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      
      $scope.loading.hide();
                // var R = 6371;
                // // km, haversine formula
                // var x1 = newlatitude - latitude;
                // var dLat = x1 * Math.PI / 180;
                // var x2 = newlongitude - longitude;
                // var dLon = x2 * Math.PI / 180;
                // var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(latitude * Math.PI / 180) * Math.cos(newlatitude * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                // var d = R * c;
                // alert(d);

    }, locationGetOnError, 
    { maximumAge: 3000, timeout: 50000, enableHighAccuracy: true });
  }

  $ionicPlatform.ready(function(){
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
    getLoc();
    $interval(getLoc, 10000);
  });
})

.controller('MainCtrl', function($scope, $timeout) {
  // Our controller

  $scope.toggleLeft = function(){
  	$ionicSideMenuDelegate.toggleLeft();
  };

  $scope.items = [
  {
    id: 1,
    name : "Shriram Sridharan",
    type: 'infoflyer'
  },
  {
    id: 2,
    name : "Sathya Kumaran",
    type : 'infoflyer'
  }];

  $scope.doRefresh = function() {
    alert('lat:' + latitude + ',long:' + longitude);
    $timeout( function() {
  	 $scope.items.push({name:"new1"}); // Refresher problematic in ionic beta version. Use old version?
    });
  	$scope.$broadcast('scroll.refreshComplete');
  };

$scope.itemButtons = [
    {
      text: 'Edit',
      type: 'button-assertive',
      onTap: function(item) {
        alert('Edit Item: ' + item.id);
      }
    },
    {
      text: 'Share',
      type: 'button-calm',
      onTap: function(item) {
        alert('Share Item: ' + item.id);
      }
    }
  ];
})