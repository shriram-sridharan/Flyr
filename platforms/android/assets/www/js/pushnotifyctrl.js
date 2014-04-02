// NOTE: This has to be a global function

function onNotificationGCM(e) { 
  switch( e.event )
  {
    case 'registered':
    if ( e.regid.length > 0 )
    {
      localStorage.setItem('flyr-regid', e.regid); // Storing it in local storage
    }
    break;

    case 'message':
    /*
    TODO: Just Refreshing the flyer list in all cases -> BACKGROUND, COLDSTART, FOREGROUND.
    Check for COLDSTART??
    http://stackoverflow.com/questions/16709373/angularjs-how-to-call-controller-function-from-outside-of-controller-component
    */
    angular.element(document.getElementById('mainhtml')).scope().getLocAndFlyers();
    break;

    case 'error':
    alert('GCM error = '+e.msg);
    break;

    default:
    alert('An unknown GCM event has occurred');
    break;
  }
}

flyrapp
.controller('PushNotifyCtrl', function($scope, $ionicPlatform, $ionicPopup, $ionicLoading) {
    $ionicPlatform.ready(function(){
      if(localStorage.getItem('flyr-regid') == null)
        registerPushNotification();
    });
    /*
    Push Notification Registration.
    TODO: Do not show push notification pop up again even if the app is killed.
    Needs Login in the device and associate with user model
    */

    function successHandler(result) {
      $scope.pushnotifyloading.hide();
    }

    function errorHandler (error) {
      alert('Error Setting Push Notifications : ' + error);
      $scope.pushnotifyloading.hide();
    }

    function registerPushNotification() {
      $scope.pushnotifyloading = $ionicLoading.show({
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
        $scope.pushnotifyloading.hide();
      }
    }

    // function showPopUp(){
    //  if(localStorage.getItem('flyr-regid') == null) { // TODO ???
    //     $ionicPopup.confirm({
    //       title: 'Allow Push Notifications',
    //       content: 'Do you want to allow push notifications?'
    //       }).then(function(res) {
    //       if(res) {
    //         localStorage.setItem('flyr-pushnotificationsettings', 'true');
    //         registerPushNotification();
    //       } else {
    //         console.log('Dont push');
    //         localStorage.setItem('flyr-pushnotificationsettings', 'false');
    //       }
    //     });
    //   }
    // }
});