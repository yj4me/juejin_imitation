angular.module('articleApp', [])


.controller('articleCtrl', ['$scope','$http', function($scope,$http){
	$scope.categories = [
        {id:1,name:'Android',onSw:false},
        {id:2,name:'前端',onSw:false},
        {id:3,name:'ios',onSw:false},
        {id:4,name:'产品',onSw:false},
        {id:5,name:'设计',onSw:false},
        {id:6,name:'工具资源',onSw:false},
        {id:7,name:'阅读',onSw:false},
        {id:8,name:'后端',onSw:false},
        {id:9,name:'人工智能',onSw:false}
    ];
    var oldIndex = -1;
    var category = '';
    $scope.myChoice = function(id){

    	// 清除上一次选择的
    	if(oldIndex >= 0){
    		$scope.categories[oldIndex].onSw = false;
    	};
    	
    	var index = id-1;
		$scope.categories[index].onSw=true;
		category = $scope.categories[index].name;
		oldIndex = index;
	};

	$scope.lists = [
  "Angular.js","React.js","Ruby","Facebook","Microsoft","JavaScript",
  "Android","ios","前端框架","后端","MongoDB","Github","Sublime Text",
  "Debug","CSS","命令行","Node.js","DOM","设计","代码规范","全栈"
  ];
  $scope.articleData = {};
  $scope.uploadArticle = function() {

       //判断输入是否合法
       // alert($scope.formData.content);
       if($scope.articleData.title == undefined){
          alert("标题不能为空");
       }else if($scope.articleData.content == undefined){
          alert("内容不能为空");
       }else{
       	// 发表文章
         doPublic();
       }
    };

    var doPublic = function(){
    $http({

        method  : 'POST',

        url     : 'http://127.0.0.1:3000/dopublic',

        // data    : $.param($scope.articleData),  // 利用jquery的$.param()方法 pass in data as strings
        // data    : $.param({"title":$scope.articleData.title,"content":$scope.articleData.content,"category":category,"label":$scope.articleData.label}),
        data    :{"author":$scope.articleData.author,"title":$scope.articleData.title,"content":$scope.articleData.content,"category":category,"label":$scope.articleData.label},

        headers : { 'Content-Type': 'application/x-www-form-urlencoded' } , // set the headers so angular passing info as form data (not request payload)
        transformRequest: function(obj) {    
            var str = [];    
            for (var p in obj) {    
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));    
            }    
            return str.join("&");    
        }  
    }).success(function(result) {

            console.log(result);
            if(result == "1"){   
                // 发表成功，回到个人主页
                 alert("发表成功");
                 // window.location = "temp/timeline.html";
              }else if(result == "-3"){
                // 服务器发生错误
                alert("服务器发生错误，请刷新重试！");
              }
 

            

        });
  };

}])