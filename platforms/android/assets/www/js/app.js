// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

function showPlayStore(url) {
  window.open(url);
}

function onNotificationGCM(e) {
  switch( e.event )
  {
    case 'registered':
    if ( e.regid.length > 0 )
    {
      localStorage.setItem('regid', e.regid); // Storing it in local storage
    }
    break;

    case 'message':
    // doRefresh depending on status of device
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

var flyrapp = angular.module('flyr', ['ionic']);

flyrapp
.run(function($ionicPlatform, $ionicLoading, $ionicPopup) {
	$ionicPlatform.ready(function() {
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
    /*
    Push Notification Registration.
    TODO: Do not show push notification pop up again even if the app is killed.
    Needs Login in the device and associate with user model
    */

    function successHandler(result) {
      pushnotifyloading.hide();
    }

    function errorHandler (error) {
      alert('Error Setting Push Notifications : ' + error);
      pushnotifyloading.hide();
    }

    function registerPushNotification() {
      pushnotifyloading = $ionicLoading.show({
        content: 'Registering device for Push Notifications...',
        showBackdrop: false
      });

      var pushNotification = window.plugins.pushNotification;
      if (device.platform == 'android' || device.platform == 'Android' )
      {
        pushNotification.register(successHandler, errorHandler, 
          {"senderID":"44227676919","ecb":"onNotificationGCM"});
      }
      else {
        alert("Error. Cannot set Push Notifications.");
        pushnotifyloading.hide();
      }
    }

    if(localStorage.getItem('regid') == null) {
      $ionicPopup.confirm({
        title: 'Allow Push Notifications',
        content: 'Do you want to allow push notifications?'
        }).then(function(res) {
        if(res) {
          registerPushNotification();
        } else {
          console.log('Dont push');
        }
      });
      showPushNotificationDialog = false;
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