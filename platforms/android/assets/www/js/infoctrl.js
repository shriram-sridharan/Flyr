flyrapp
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