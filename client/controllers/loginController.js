﻿app.controller("loginController", function ($rootScope, $scope, $http, $location, $modal, $state, settings, loading) {

$rootScope.data.logged = false;

$scope.login = function () {
    loading.show();
    if ($scope.email != "" && $scope.password != "" && $scope.email != undefined && $scope.password != undefined) {

      $http({
          method: "POST",
          url: settings.BASE_API_URL + "login",
          headers:{
            'Access-Control-Allow-Origin': "*"
          },
          data: {
            "email":$scope.email,
            "name":$scope.name,
            "password": $scope.password
          }
      }).success(function (data) {
          loading.hide();
          console.log("DATA", data);
          if(data.status ==200){
            loading.hide();
            $rootScope.data.logged = true;
            $rootScope.loggedUser = 'Simona';

            localStorage.setItem("logged", true);
            localStorage.setItem("loggedUser", $rootScope.loggedUser);

            $state.go("/home");
          }
      }).error(function (data) {
          loading.hide();
          console.log("error", data);
          if(data.status == 401){
              $scope.alertModal(data.message, "Error");
          }else{
            loading.hide();
            var message = "Wrong username or password";
            var title = "Authentification error";
            $scope.alertModal(message, title);
          }
      });
    } else {
        var message = "Please fill in both fields";
        var title = "Authentification error";

        $scope.alertModal(message, title);
    }
}

$scope.register = function(){
  $state.go("/register");
}

$scope.submit = function(){
  console.log("dsadas");
  loading.show();

  console.log($scope.name, $scope.email, $scope.phobia);
  $http({
      method: "POST",
      url: settings.BASE_API_URL + "users",
      headers:{
        'Access-Control-Allow-Origin': "*"
      },
      data: {
        "email":$scope.email,
        "name":$scope.name,
        "password": $scope.password
      }
  }).success(function (data) {
      loading.hide();
      //console.log("DATA", data);
      if(data.status ==201){
        $scope.alertModal(data.message, "Sucess");
        $state.go("/");
      }
  }).error(function (data) {
      loading.hide();
    //  console.log("error", data);
      if(data.status == 500){
        $scope.alertModal(data.message, "Error");
      } else{
        $scope.alertModal("An error has occured on the server side.", "Error");
      }
  });
}
$scope.loggout = function () {

    $rootScope.data.admin = false;
    $rootScope.data.logged = false;
    $rootScope.data.response = "";
    localStorage.setItem("logged", false);
    localStorage.setItem("loggedUser", "");
    $state.go("/");
}

$scope.alertModal = function (message, title) {
    $scope.message = message;
    $scope.title = title;

    var myModal = $modal.open({
        templateUrl: '../views/modals/alertModal.html',
        controller: 'alertController',
        //size: "sm",
        backdrop: 'static',
        resolve: {
            info: function () {
                return {
                    message: message,
                    title : title
                }
            }
        }
    });
}

});

app.controller("alertController", function ($scope, $http, $modalInstance, $rootScope, info) {
$scope.message = info.message;
$scope.title = info.title;

$scope.hideMyModal = function () {
    $modalInstance.dismiss();
}

});
