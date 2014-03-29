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

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  // Our controller
  $scope.toggleLeft = function(){
  	$ionicSideMenuDelegate.toggleLeft();
  };

  $scope.items = [
  {
  	name : "Shriram Sridharan",
  	subject : "PhD prelim"
  },
  {
  	name : "Sathya Kumaran",
  	subject : "PhD prelim"
  }];

  $scope.refresh = function() {
  	$scope.items.push({name:"new1"});
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
});