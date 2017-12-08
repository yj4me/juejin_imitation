var page = 1;
var currentSub = '';
 // 本地存储
var store = window.localStorage;
// Make sure to include the `ui.router` module as a dependency
angular.module('myApp', ['ui.router'])

// 路由
.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider,   $urlRouterProvider) {
      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider.otherwise('/');

      $stateProvider

        .state("home", {
          // Use a url of "/" to set a state as the "index".
          url: "/",
          views:{
            '':{templateUrl:'temp/home.html'},
            'content@home':{
              templateUrl:'temp/content.html',
              controller:'mainCtrl'
            },
            'aside@home':{templateUrl:'temp/aside.html'},
            'form@home':{templateUrl:'temp/regist.html',controller:'formCtrl'}
          },
          
        })

        .state("article_detail", {
          url: "/list-detail/:articleName",
          views:{
            '':{templateUrl:'temp/article_detail.html',
                controller:'detailCtrl'
              },
            'content@article_detail':{
              templateUrl:'temp/detail_content.html',
              controller:'mainCtrl'
            },
            'aside@article_detail':{templateUrl:'temp/detail_aside.html'}
          },
          
        })

        .state("column",{
          url:'/column',
          template:'<h2>我是专栏</h2>'
        })
        .state("collect",{
          url:'/collect',
          template:'<h2>我是收藏集</h2>'
        })
        .state("find",{
          url:'/find',
          template:'<h2>我是发现</h2>'
        })
        .state("opensource",{
          url:'/opensource',
          template:'<h2>我是开源库</h2>'
        })
      
    }
])

// 自定义返回顶部指令(驼峰命名法)
.directive("goToTop",function(dataList){
  return {

    restrict:'E',
    replace:true,
    scope:{
      datas:'=',
      minHeight:'@'
    },
    templateUrl:'temp/back.html',
    link:function(scope,elem,attrs){
      elem.click(function(){
        jQuery('html,body').animate({scrollTop:0},700);
      })
      .hover(function(){
        jQuery(this).addClass("hover");
      },function(){
        jQuery(this).removeClass("hover");
      });

      scope.minHeight = scope.minHeight?scope.minHeight:840;
      jQuery(window).scroll(function(){
        var s = jQuery(window).scrollTop();
        var c = jQuery(window).height();
        var d = jQuery(document).height();
        if(s+c>=d){
          // loadMore
          dataList.getData(currentSub,2).then(function(res){
            var oldDatas = scope.datas;
           // var newDatas =oldDatas.concat(res.data.result);
           // console.log(res.data.result);
           console.log(oldDatas);
           
           return;
          });
        }
        if(s> scope.minHeight){
          jQuery("#gotoTop").fadeIn(100);
          // 加载更多数据
        }else{
          jQuery("#gotoTop").fadeOut(200);
        }
      })
    }
   
  }
})


// 自定义获取数据的工厂
.factory('dataList', ['$http', function($http){
  var baseUrl = 'http://127.0.0.1:3000';
  return {
    getData:function(titleName,page){
      return $http.get(baseUrl+'/home/'+titleName+"?page="+(page-1));
    }
  }
}])


// 控制器
.controller('myCtrl', ['$scope', function($scope){
  $scope.nav = "首页";
  $scope.click = function(param){
    $scope.nav = param;
  };

}])

// home页
.controller('mainCtrl', ['$scope','$http','dataList','$state', function($scope,$http,dataList,$state){
  // 推荐
  $scope.currentSub = "recommend";
  currentSub = $scope.currentSub;
  $scope.click = function(param){
    $scope.currentSub = param;
    currentSub = $scope.currentSub;
    dataList.getData($scope.currentSub,page).then(function(res){
      
      $scope.datas = res.data.result;
    });
  };
   // 推荐列表
  dataList.getData($scope.currentSub,page).then(function(res){

    $scope.datas = res.data.result;
    // console.log(res.data.result);
  });

  

  // 跳转到详情页面
  $scope.gotoDetail = function(param){
    //此时param要转成字符串
    // console.log("param======="+JSON.stringify(param));
    store.setItem("detail",JSON.stringify(param));
    $state.go('article_detail',{articleName:param.title});
  }

}])
// 详情页
.controller('detailCtrl', ['$scope','$state','$stateParams','$window',function($scope,$state,$stateParams,$window){
  // $window.alert($stateParams.articleName);
  // $stateParams中只会存放一对键值对
  $scope.title = $stateParams.articleName;
  console.log(JSON.parse(store.getItem('detail')||'{}'));
  $scope.content = JSON.parse(store.getItem('detail')||'{}').content;
  
  // console.log($stateParams.articleContent);
   // 详情内容
  // dataList.getData($scope.title).then(function(res){
  //   $scope.datas = res.data
  // });
}])

// 注册表单
.controller('formCtrl', ['$scope','$http', function($scope,$http){
  $scope.formData = {};

  var doregist = function(){
    $http({

        method  : 'POST',

        url     : 'http://127.0.0.1:3000/doregist',

        data    : $.param($scope.formData),  // pass in data as strings

        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)

    }).success(function(result) {

            console.log(result);
            if(result == "1"){   
                // 注册成功
                 alert("注册成功,将返回首页");
                 window.location = "temp/timeline.html";
              }else if(result == "-1"){
                // 用户名被占用
                $scope.errorNike = true;
              }else if(result == "-3"){
                // 服务器发生错误
                alert("服务器发生错误，请刷新重试！");
              }
 

            

        });
  };

// 添加动态监听
  $scope.$watch('formData.mail',function(newValue,oldValue){
    if(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(newValue)){
      $scope.isVitify = true;
    }else{
      $scope.isVitify = false;
    }
  })
 
    $scope.processForm = function() {
       //判断输入是否合法
       // alert($scope.formData.mail);
       if($scope.formData.nike == undefined){
          $scope.nullNike = true;
       }else if($scope.formData.mail == undefined){
          $scope.nullNike = false;
          $scope.nullMail = true;
       }else if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($scope.formData.mail) && !/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test($scope.formData.mail)){
          $scope.nullMail = false;    
          $scope.errorMail = true;

       }else if($scope.formData.password == undefined || $scope.formData.password.toString().length < 6){
        
          $scope.nullMail = false;
          $scope.errorMail = false;
          $scope.nullPwd = true;
       }else{
         $scope.nullPwd = false;
         doregist();
       }
    };

}]);






