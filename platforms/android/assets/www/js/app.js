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

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

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
  .state('promoflyer', {
    url: "/promoflyer/:itemId",
    templateUrl: "infoflyer.html"
  })

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise("/home");

    $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.headers.common = 'Content-Type: application/json';
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

.controller('InfoFlyerCtrl', function($scope, $stateParams, $ionicPlatform) {
  var i = 0;
  var flyer = 
  {
    name : "Shriram Sridharan",
    summary: 'PhD Prelim - CS1240 - 4/21/2014 - 10:00 AM',
    content: 'This is the PhD prelim of Mr. Shriram Sridharan advised by Prof. Jignesh Patel',
    email: 'shrirams@cs.wisc.edu',
    phonenumber: '4087725271',
    playstore: 'https://play.google.com/store/apps/details?id=oldcask.ocr.android.activities&feature=search_result',
    appstore: '',
  }
  function call() {
    document.location.href = 'tel:+1' + $scope.flyer['phonenumber'];
  }

  function getFlyer() {
    //alert("Getting Flyer" + i);
    $scope.flyer = flyer;
    if ($scope.flyer['phonenumber']) {
      //alert($scope.flyer['phonenumber']);
      document.getElementById('tabs').innerHTML = document.getElementById('tabs').innerHTML +
      "<a class='tab-item' href='tel:+1"+ $scope.flyer['phonenumber'] +"'> Call " +
      "<i class='icon ion-android-call assertive'></i></button>";
    }
    if ($scope.flyer['phonenumber']) {
      //alert($scope.flyer['phonenumber']);
      document.getElementById('tabs').innerHTML = document.getElementById('tabs').innerHTML +
      "<a class='tab-item' href='mailto:"+ $scope.flyer['email'] +"'> EMail " +
      "<i class='icon ion-android-mail positive'></i></button>";
    }

    if ($scope.flyer['playstore']) {
      //alert($scope.flyer['phonenumber']);
      document.getElementById('tabs').innerHTML = document.getElementById('tabs').innerHTML +
      "<a class='tab-item' href='"+ $scope.flyer['playstore'] +"'> Download App " + 
      "<i class='icon ion-android-playstore balanced'></i></button>";
    }
  }

//img: 'http://flagship.americancouncils.org/russian/sites/flagship.americancouncils.org.russian/files/images/UW-Madison_logo.gif',
  $ionicPlatform.ready(function(){
    getFlyer();
  });
 })


.value('latitute', 0)
.value('longitude', 0)

.controller('GeoLocationCtrl', function($scope, $interval, $ionicPlatform, $ionicLoading, $http) {
  function locationGetOnError(error) {
    //TODO: Put this in pop up later or remove it or retry
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    alert('Please kill and restart app \n');
  }

  function getLoc() {

    navigator.geolocation.getCurrentPosition(function(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      
      $scope.loading.hide();
      $http.post('http://127.0.0.1:8000/getLoc',{'lat':''+latitude,'lng':''+longitude})
      .success(function(data, status, headers, config) {
          // var json = JSON.stringify(eval("(" + data + ")"));
          $scope.currentLocation = data[0].loc;
          // console.log(json);
      })
      .error(function(data, status) {
        //TODO: Change to pop up
          alert("Error Getting Location. Please try again later");
      });

      }, locationGetOnError, 
      { maximumAge: 3000, timeout: 50000, enableHighAccuracy: false });
  }

  $ionicPlatform.ready(function(){
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
    $scope.currentLocation = "Getting Current Location";
    getLoc();
    //$interval(getLoc, 10000);
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
    type: 'infoflyer',
    summary: 'PhD Prelim - CS1240 - 4/21/2014 - 10:00 AM',
    date: 'Yesterday'
  },
  {
    id: 2,
    name : "Sathya Kumaran",
    type : 'promoflyer',
    summary: 'Apartment Sublet - 2125 Univ Ave, Madison - $340',
    date : '2/22/2014'
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