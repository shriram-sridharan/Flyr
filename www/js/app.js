// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

function showPlayStore(url) {
  window.open(url);
}

var flyrapp = angular.module('flyr', ['ionic']);

flyrapp
.run(function($rootScope, $state, $ionicPlatform, $ionicLoading, $ionicPopup, $ionicSideMenuDelegate) {
	$ionicPlatform.ready(function() {
		if(window.StatusBar) {
			StatusBar.styleDefault();
		};

    $rootScope.togglemenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $rootScope.go = function(path) {
     console.log('go',path);
      $state.go(path);
    };
	});
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $stateProvider
  .state('filtermenu', {
      url: "/filter",
      abstract: true,
      templateUrl: "filter-menu.html"
  })
  .state('filtermenu.home', {
    url: "/home",
    views: {
      'menuContent' :{
       templateUrl: "home.html"
      }
    }
  })
  .state('filtermenu.information', {
    url: "/information",
    views: {
      'menuContent' :{
       templateUrl: "information.html"
      }
    }
  })
  .state('filtermenu.studentsale', {
    url: "/studentsale",
    views: {
      'menuContent' :{
       templateUrl: "studentsale.html"
      }
    }
  })
  .state('filtermenu.studentpromotion', {
    url: "/studentpromotion",
    views: {
      'menuContent' :{
       templateUrl: "studentpromotion.html"
      }
    }
  })
  .state('filtermenu.generalpromotion', {
    url: "/generalpromotion",
    views: {
      'menuContent' :{
       templateUrl: "generalpromotion.html"
      }
    }
  })
  .state('filtermenu.infoflyer', {
    url: "/GENINFO/:flyerid",
    views: {
      'menuContent' :{
       templateUrl: "infoflyer.html"
     }
    }
  })
  .state('filtermenu.stpromoflyer', {
    url: "/STPROMO/:flyerid",
    views: {
      'menuContent' :{
       templateUrl: "infoflyer.html"
     }
    }
  })
  .state('filtermenu.stsaleflyer', {
    url: "/STUSALE/:flyerid",
    views: {
      'menuContent' :{
       templateUrl: "stusale.html"
     }
    }
  })

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise("/filter/home");

    $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.headers.common = 'Content-Type: application/json';
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

.controller('ModalCtrl', function($scope, $ionicPlatform) {
  $ionicPlatform.ready(function(){
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
    //TODO: Allow push notifications
    // localStorage.setItem('flyr-pushnotificationsettings', $scope.pushnotificationsettings);
    $scope.modal.hide();
  };
});