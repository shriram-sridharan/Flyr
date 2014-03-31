// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

function showPlayStore(url) {
  window.open(url);
}

var flyrapp = angular.module('flyr', ['ionic']);

flyrapp
.run(function($ionicPlatform, $ionicLoading, $ionicPopup) {
	$ionicPlatform.ready(function() {
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $stateProvider
  .state('home', {
    url: "/home",
    templateUrl: "home.html"
  })
  .state('infoflyer', {
    url: "/infoflyer/:flyerid",
    templateUrl: "infoflyer.html"
  })
  .state('promoflyer', {
    url: "/promoflyer/:flyerid",
    templateUrl: "infoflyer.html"
  })

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise("/home");

    $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.headers.common = 'Content-Type: application/json';
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

.controller('ModalCtrl', function($scope) {

});