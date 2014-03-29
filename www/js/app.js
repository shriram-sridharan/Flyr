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
      url: "/infoflyer",
      templateUrl: "infoflyer.html",
      controller: 'InfoFlyerCtrl'
    })

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise("/home");
})

.controller('InfoFlyerCtrl', function($scope) {

})

.controller('MainCtrl', function($scope) {
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
  	$scope.items.push({name:"new1"}); // Refresher problematic in ionic beta version. Use old version?
  	$scope.$broadcast('scroll.refreshComplete');
  };

  $scope.itemButtons = [
  {
  	text: 'Edit',
  	type: 'Button',
  	onTap: function(item) {
  		alert('Edit Item: ' + item.id);
  	}
  },
  {
  	text: 'Share',
  	type: 'Button',
  	onTap: function(item) {
  		alert('Share Item: ' + item.id);
  	}
  }
  ];
})