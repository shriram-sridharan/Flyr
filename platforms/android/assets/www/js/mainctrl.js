var scopeItems = []; // TODO: Hack here to preserve items across page switches.
var stopPolling;

flyrapp
.controller('MainCtrl', function($scope, $timeout, $interval, $ionicModal, $ionicLoading, 
  $http, $ionicPlatform) {
  $ionicPlatform.ready(function(){
      $scope.items = scopeItems;
      $scope.informationItems = [];
      $scope.studentsaleItems =[];
      $scope.studentpromotionItems = [];
      $scope.generalpromotionItems = [];
      $scope.getLocAndFlyers();
  });

  $scope.toggleLeft = function(){
  	$ionicSideMenuDelegate.toggleLeft();
  };

  $scope.locationGetOnError = function(error) {
    //TODO: Put this in pop up later or remove it or retry
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    alert('Please kill and restart app \n');
    $scope.loading.hide();
  }

  $scope.getLocAndFlyers = function() {
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
    $scope.currentLocation = "Getting Current Location";

    navigator.geolocation.getCurrentPosition(function(position) 
      {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        $http.post('http://ec2-54-201-190-159.us-west-2.compute.amazonaws.com:8000/get-current-location',
        {'lat':''+latitude,'lng':''+longitude})
        .success(function(data, status, headers, config) {
          $scope.currentLocation = data[0].loc;
          console.log(data);
          $scope.loading.hide();

          /*
          TODO: Get Flyers only if location changes.
          If app is running in background, then don't get flyers, just get count for pushNotifications.
          */
          $scope.getFlyers();

          /* TODO:
          Is this place correct?
          Make it call more when the app is not running and less when the app is using device events
          Check the distance before calling the server/ Poll server for new promotions by just sending 
          latest promo id.
          can use $scope.stopPolling to cancel -> Read Angular JS
          */

          /*
          stopPolling will become undefined when the app is killed.  
          TODO: Hacked->Will refresh everytime. So more intervals will keep adding.
          Change before launch. Try singleTop android launch mode.
          Also if back button is pressed, this goes away!
          */
            if(stopPolling == undefined) { 
                stopPolling = $interval($scope.pollFlyers, 10000); // called?
            }
          }
        )

        .error(function(data, status) {
        //TODO: Change to pop up
          alert("Error Getting Location. Check if Internet and GPS are turned on (or) try again later");
          $scope.loading.hide();
        });
      }, $scope.locationGetOnError, 
      { maximumAge: 3000, timeout: 50000, enableHighAccuracy: false }
    );
  }
  
  $scope.pollFlyers = function() 
  {
    navigator.geolocation.getCurrentPosition(function(position) 
    {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      $timeout( function() {
        $http.post('http://ec2-54-201-190-159.us-west-2.compute.amazonaws.com:8000/poll-flyers',
          {'lat':''+latitude,
          'lng':''+longitude, 
          'regid':''+localStorage.getItem('flyr-regid'),
          'infosettings': ''+localStorage.getItem('flyr-infosettings'),
          'spsettings': ''+localStorage.getItem('flyr-studentpromosettings'),
          'gpsettings': ''+localStorage.getItem('flyr-generalpromosettings')
          })
        .success(function(data, status, headers, config) {
        //$scope.currentLocation = data[0].loc;
          console.log(data);
        })
        .error(function(data, status) {
          //TODO: Change to pop up
          // alert("Error Getting Location. Please try again later");
        });
      });
    });
  }

  var data = [
  {
    id: 1,
    publisher : "Shriram Sridharan",
    type: 'information',
    title: 'PhD Prelim - CS1240 - 4/21/2014 - 10:00 AM',
    date: 'Yesterday'
  },
  {
    id: 2,
    publisher : "Sathya Kumaran",
    type : 'studentsale',
    title: 'Apartment Sublet - 2125 Univ Ave, Madison - $340',
    date : '2/22/2014'
  },
   {
    id: 3,
    publisher : "Sathya Kumaran2",
    type : 'studentpromotion',
    title: 'Apartment Sublet - 2125 Univ Ave, Madison - $340',
    date : '2/22/2014'
  },
  {
    id: 4,
    publisher : "Sathya Kumaran3",
    type : 'generalpromotion',
    title: 'Apartment Sublet - 2125 Univ Ave, Madison - $340',
    date : '2/22/2014'
  }];

  $scope.getFlyers = function() {
    // $scope.refreshloading = $ionicLoading.show({
    //   content: 'Refreshing Flyer List...',
    //   showBackdrop: false
    // });

    // $timeout( function() {
    //   $http.post('http://ec2-54-201-190-159.us-west-2.compute.amazonaws.com:8000/get-flyers',
    //     {'lat':''+latitude,
    //     'lng':''+longitude,
    //     'infosettings': ''+localStorage.getItem('flyr-infosettings'),
    //     'spsettings': ''+localStorage.getItem('flyr-studentpromosettings'),
    //     'gpsettings': ''+localStorage.getItem('flyr-generalpromosettings')
    //     })
    //   .success(function(data, status, headers, config) {
    //     //$scope.currentLocation = data[0].loc;
    //     $scope.items = data;
    //     scopeItems = data;
    //     console.log(data);
    //     $scope.refreshloading.hide();
    //   })
    //   .error(function(data, status) {
    //   //TODO: Change to pop up
    //   alert("Error Getting Location. Please try again later");
    //   $scope.refreshloading.hide();
    //   });
    // });
    $scope.items = data;
    $scope.informationItems = [];
    $scope.studentsaleItems = [];
    $scope.studentpromotionItems = [];
    $scope.generalpromotionItems = [];

    scopeItems = data;
    for(i=0;i<$scope.items.length;i++) {
      var item = $scope.items[i];
      console.log(item);
      console.log("type=" + item.type);
      if("information" == item.type) {
        $scope.informationItems.push(item);
      }
      else if("studentsale" == item.type){
        $scope.studentsaleItems.push(item);
      }
      else if("studentpromotion" == item.type) {
        $scope.studentpromotionItems.push(item);
      }
      else if("generalpromotion" == item.type){
        $scope.generalpromotionItems.push(item);
      }
    }

    console.log($scope.informationItems);
  };

  //$scope.items = []

  $scope.doRefresh = function() {
    $scope.getLocAndFlyers(); //Get current location on refresh
    //alert('lat:' + latitude + ',long:' + longitude);
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.itemButtons = [
  {
    text: 'Save',
    type: 'button-assertive',
    onTap: function(item) {
      alert('Save Item: ' + item.id);
    }
  },
  {
    text: 'Delete',
    type: 'button-calm',
    onTap: function(item) {
      alert('Delete Item: ' + item.id);
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
});
