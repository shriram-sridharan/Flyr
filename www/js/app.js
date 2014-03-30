// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var scopeItems = [];

function showPlayStore(url) {
  window.open(url);
}

function onNotificationGCM(e) {
  switch( e.event )
  {
    case 'registered':
    if ( e.regid.length > 0 )
    {
      console.log("Regid " + e.regid);
      alert('registration id = '+e.regid);
    }
    break;

    case 'message':
    // this is the actual push notification. its format depends on the data model from the push server
    alert('message = '+e.payload.message+' msgcnt = '+e.payload.msgcnt);
    break;

    case 'error':
    alert('GCM error = '+e.msg);
    break;

    default:
    alert('An unknown GCM event has occurred');
    break;
  }
}

angular.module('flyr', ['ionic'])

.run(function($ionicPlatform, $ionicLoading) {
	$ionicPlatform.ready(function() {
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}

    /*
    Push Notification Registration
    */
    var loading = $ionicLoading.show({
      content: 'Registering device for Push Notifications...',
      showBackdrop: false
    });

    function successHandler(result) {
      alert('Callback Success! Result = '+result);
      loading.hide();
    }

    function errorHandler (error) {
      alert('error = ' + error);
      loading.hide();
    }

    /*
      TODO: Ask here for user about his wish for sending push notifications
    */
    // var pushNotification = window.plugins.pushNotification;
    // if (device.platform == 'android' || device.platform == 'Android' )
    // {
    //   pushNotification.register(successHandler, errorHandler, 
    //     {"senderID":"44227676919","ecb":"onNotificationGCM"});
    // }
    // else {
    //   alert("Error. Cannot set Push Notifications.");
    //   loading.hide();
    // }

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

.controller('InfoFlyerCtrl', function($scope, $stateParams, $ionicPlatform, $http) {

  var exampleflyer = 
  {
    name : "Shriram Sridharan",
    summary: 'PhD Prelim - CS1240 - 4/21/2014 - 10:00 AM',
    content: 'This is the PhD prelim of Mr. Shriram Sridharan advised by Prof. Jignesh Patel',
    img: 'http://flagship.americancouncils.org/russian/sites/flagship.americancouncils.org.russian/files/images/UW-Madison_logo.gif',
    email: 'shrirams@cs.wisc.edu',
    phonenumber: '4087725271',
    playstore: 'details?id=oldcask.ocr.android.activities&feature=search_result',
    appstore: '',
  }

  function lookupFlyer() {

    $scope.flyer = {};
    alert($stateParams.flyerid);
    $http.post('http://ec2-54-201-190-159.us-west-2.compute.amazonaws.com:8000/lookup-flyer',
        {'id':''+$stateParams.flyerid})
      .success(function(data, status, headers, config) {
        //$scope.currentLocation = data[0].loc;
        // TODO: Send only the flyer in server
        $scope.flyer = data[0];
        console.log(data);
        $scope.loading.hide();
      })
      .error(function(data, status) {
      //TODO: Change to pop up
      alert("Error Getting Location. Please try again later");
      $scope.loading.hide();
      });

    //alert("Getting Flyer" + i);
    
    if ($scope.flyer['phonenumber'] != undefined) {
      //alert($scope.flyer['phonenumber']);
      document.getElementById('tabs').innerHTML = document.getElementById('tabs').innerHTML +
      "<a class='tab-item' href='tel:+1"+ $scope.flyer['phonenumber'] +"'> Call " +
      "<i class='icon ion-android-call assertive'></i></button>";
    }
    if ($scope.flyer['email'] != undefined) {
      //alert($scope.flyer['phonenumber']);
      document.getElementById('tabs').innerHTML = document.getElementById('tabs').innerHTML +
      "<a class='tab-item' href='mailto:"+ $scope.flyer['email'] +"'> EMail " +
      "<i class='icon ion-android-mail positive'></i></button>";
    }

    if ($scope.flyer['playstore'] != undefined) {
      //alert($scope.flyer['phonenumber']);
      document.getElementById('tabs').innerHTML = document.getElementById('tabs').innerHTML +
      "<a class='tab-item' href='market://"+ $scope.flyer['playstore'] +"'> " + 
      " Download App " + 
      "<i class='icon ion-android-playstore balanced'></i></button>";
    }
  }


  $ionicPlatform.ready(function(){
    lookupFlyer();
  });
 })


.value('latitute', 0)
.value('longitude', 0)

.controller('GeoLocationCtrl', function($scope, $interval, $ionicPlatform, $ionicLoading, $http) {
  function locationGetOnError(error) {
    //TODO: Put this in pop up later or remove it or retry
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    alert('Please kill and restart app \n');
    $scope.loading.hide();
  }

  function getLoc() {

    navigator.geolocation.getCurrentPosition(function(position) 
      {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        $scope.loading.hide();
      }, locationGetOnError, 
      { maximumAge: 3000, timeout: 50000, enableHighAccuracy: false }
    );
  }
  

  $ionicPlatform.ready(function(){
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
    $scope.currentLocation = "Getting Current Location";
    getLoc();

    /* TODO:
    once every 10 seconds.
    Does call even when the app is not running.
    Make it call more when the app is not running and less when the app is using device events
    Check the distance before calling the server/ Poll server for new promotions by just sending latest promo id.
    */
    //$interval(getLoc, 10000); 
  });
})

.controller('MainCtrl', function($scope, $timeout, $ionicModal, $ionicLoading, $http, $ionicPlatform) {
  // Our controller
  $ionicPlatform.ready(function(){
    //TODO Hack. See if better way to do this!
      $scope.items = scopeItems;
  });

  $scope.toggleLeft = function(){
  	$ionicSideMenuDelegate.toggleLeft();
  };

  // $scope.items = [
  // {
  //   id: 1,
  //   name : "Shriram Sridharan",
  //   type: 'infoflyer',
  //   summary: 'PhD Prelim - CS1240 - 4/21/2014 - 10:00 AM',
  //   date: 'Yesterday'
  // },
  // {
  //   id: 2,
  //   name : "Sathya Kumaran",
  //   type : 'promoflyer',
  //   summary: 'Apartment Sublet - 2125 Univ Ave, Madison - $340',
  //   date : '2/22/2014'
  // }];

  //$scope.items = []

 //TODO: On Refresh - Get Current Location
  $scope.doRefresh = function() {
    
    $scope.loading = $ionicLoading.show({
      content: 'Refreshing Flyer List...',
      showBackdrop: false
    });
    

    alert('lat:' + latitude + ',long:' + longitude);
    $timeout( function() {

      $http.post('http://ec2-54-201-190-159.us-west-2.compute.amazonaws.com:8000/get-flyers',
        {'lat':''+latitude,'lng':''+longitude})
      .success(function(data, status, headers, config) {
        //$scope.currentLocation = data[0].loc;
        $scope.items = data;
        scopeItems = data;
        console.log(data);
        $scope.loading.hide();
      })
      .error(function(data, status) {
      //TODO: Change to pop up
      alert("Error Getting Location. Please try again later");
      $scope.loading.hide();
      });
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

  $scope.rightButtonsMain = [{
    content: 'Settings',
    type: 'button-positive button-clear',
    tap: function(e) {
      $scope.modal.show();
    }
  }];

  $ionicModal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modal = modal;
  }, {
    animation: 'slide-in-up',
    focusFirstInput: true
  });
})

.controller('ModalCtrl', function($scope) {

});