flyrapp
.controller('PushNotifyCtrl', function($scope, $ionicPlatform, $ionicPopup, $ionicLoading) {
    $ionicPlatform.ready(function(){
      showPopUp();
    });
    /*
    Push Notification Registration.
    TODO: Do not show push notification pop up again even if the app is killed.
    Needs Login in the device and associate with user model
    */
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
        /*
        TODO: Just Refreshing the flyer list in all cases -> BACKGROUND, COLDSTART, FOREGROUND.
        May need to not refresh for COLDSTART??
        */
        $scope.getLocAndFlyers();
        break;

        case 'error':
        alert('GCM error = '+e.msg);
        break;

        default:
        alert('An unknown GCM event has occurred');
        break;
      }
    }

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

    function showPopUp(){
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
      }
    }
});