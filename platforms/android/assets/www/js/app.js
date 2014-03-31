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

.controller('ModalCtrl', function($scope, $ionicPlatform) {
  $ionicPlatform.ready(function(){
    console.log("called");
    $scope.settingsList = [
      { text: "Information", checked: false },
      { text: "Student Promotions", checked: false },
      { text: "General Promotions", checked: false }
    ];

    console.log(localStorage.getItem('flyr-infosettings'));
    console.log(localStorage.getItem('flyr-studentpromosettings'));
    console.log(localStorage.getItem('flyr-generalpromosettings'));

    if(localStorage.getItem('flyr-infosettings') != null)
      $scope.settingsList[0].checked = localStorage.getItem('flyr-infosettings') === 'true'; // JS Quirks
    if(localStorage.getItem('flyr-studentpromosettings') != null)
      $scope.settingsList[1].checked = localStorage.getItem('flyr-studentpromosettings') === 'true';
    if(localStorage.getItem('flyr-generalpromosettings') != null)
      $scope.settingsList[2].checked = localStorage.getItem('flyr-generalpromosettings') === 'true';
  });

  $scope.closeModal = function() {
    localStorage.setItem('flyr-infosettings', $scope.settingsList[0].checked);
    localStorage.setItem('flyr-studentpromosettings', $scope.settingsList[1].checked);
    localStorage.setItem('flyr-generalpromosettings', $scope.settingsList[2].checked);
    $scope.modal.hide();
  };
});