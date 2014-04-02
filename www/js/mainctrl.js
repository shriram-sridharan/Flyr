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

    navigator.geolocation.getCurrentPosition(function(position) 
      {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

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

// get-flyers response
// [
// {
// "hotspot": {
// "flyercount": 0,
// "address": "2125, University Ave, Madison 53726, WI",
// "id": 3,
// "name": "Casa de Bro"
// },
// "flyers": [
// {
// "flyer-id": 14,
// "publisher": "System Admin",
// "type": "GENINFO",
// "name": "Information Bro!"
// },
// {
// "flyer-id": 15,
// "publisher": "System Admin",
// "type": "STUSALE",
// "title": "sale sale"
// },
// {
// "flyer-id": 16,
// "publisher": "System Admin",
// "type": "STPROMO",
// "name": "Use our app"
// }
// ]
// }
// ]

  $scope.getFlyers = function() {
    $scope.refreshloading = $ionicLoading.show({
      content: 'Getting current Location and Refreshing Flyer List...',
      showBackdrop: false
    });

    $timeout( function() {
      $http.post('http://ec2-54-201-190-159.us-west-2.compute.amazonaws.com:8000/get-flyers',
        {'lat':''+latitude,
        'lng':''+longitude,
        'infosettings': ''+localStorage.getItem('flyr-infosettings'),
        'spsettings': ''+localStorage.getItem('flyr-studentpromosettings'),
        'gpsettings': ''+localStorage.getItem('flyr-generalpromosettings')
        })
      .success(function(data, status, headers, config) {
        console.log(data);
        $scope.currentLocation = data[0].hotspot.name;
        $scope.items = data[0].flyers;
        scopeItems = data[0].flyers;

        $scope.informationItems = [];
        $scope.studentsaleItems = [];
        $scope.studentpromotionItems = [];
        $scope.generalpromotionItems = [];

        for(i=0;i<$scope.items.length;i++) {
          var item = $scope.items[i];
          console.log(item);
          console.log("id = " + item["flyer-id"]);
          console.log("type=" + item.type);
          if("GENINFO" == item.type) {
            $scope.informationItems.push(item);
            $scope.items[i]['avatarpic']="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6r0rh1rQFXjm0nP8MQ8BZBl3W-XVSvJN_sTSVO4lFFEikkT701Q";
          }
          else if("STUSALE" == item.type){
            $scope.studentsaleItems.push(item);
            $scope.items[i]['avatarpic']="http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/512/sale-icon.png";
            $scope.items[i]['name'] = $scope.items[i]['title'];
          }
          else if("STPROMO" == item.type) {
            $scope.studentpromotionItems.push(item);
            $scope.items[i]['avatarpic']="http://www.clker.com/cliparts/h/z/l/u/l/s/speaker-volume-3-hi.png";
          }
          else if("generalpromotion" == item.type){
            $scope.generalpromotionItems.push(item);
          }
        }

        $scope.refreshloading.hide();
      })
      .error(function(data, status) {
      //TODO: Change to pop up
      alert("Error Getting Location. Please try again later");
      $scope.refreshloading.hide();
      });
    });
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
