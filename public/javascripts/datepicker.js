
var DatePicker = angular.module('simpleDatePicker',[]);

DatePicker.controller('datepickerCtrl',['$scope','$attrs',
    function($scope, $attrs){
 
  $scope.showWeekendBtn = 'false';
  $scope.weekendOffFlag = 'false';
  $scope.getMonthId;
  $scope.isLeapYear;
  $scope.setDate;
  $scope.setWeekendOffOn;
  $scope.getDayOfWeek;
  $scope.isWeekendOff;
  if($attrs.weekendbtn != undefined)
  {
    $scope.showWeekendBtn = $attrs.weekendbtn;
  }
  $scope.years = [];
  $scope.months = [{'Name':'Jan','id':01},
  {'Name':'Feb', 'id':02},
  {'Name':'Mar', 'id':03},
  {'Name':'Apr', 'id':04},
  {'Name':'May', 'id':05},
  {'Name':'Jun', 'id':06},
  {'Name':'Jul', 'id':07},
  {'Name':'Aug', 'id':08},
  {'Name':'Sep', 'id':09},
  {'Name':'Oct', 'id':10},
  {'Name':'Nov', 'id':11},
  {'Name':'Dec', 'id':12},];
  $scope.days = ['31','28','31','30','31','30','31','31','30','31','30','31'];
  $scope.daysOfWeek = ['S','M','T','W','Th','F','St'];
  //set current date
  var today  = new Date();
  $scope.currentYear = today.getFullYear();
  $scope.currentMonth = $scope.months[today.getMonth()].Name;
  $scope.currentDay = today.getDate();
  

  $scope.showDatepicker = false;
  var start = 2000;
  var end = 3000;
  //create array of all the years
  while(start<=end)
  {
    $scope.years.push(start);
    start=start+1;
  }

  //function definations below
  
  $scope.$watch('currentMonth', function(newVal, oldVal){
    $scope.dateSelected=$scope.currentDay+"/"+$scope.getMonthId()+"/"+$scope.currentYear;
  });
  $scope.$watch('currentYear', function(newVal, oldVal){
    $scope.dateSelected=newVal+"/"+$scope.getMonthId()+"/"+newVal;
  });
  $scope.$watch('currentDay', function(newVal, oldVal){
    $scope.dateSelected=newVal+"/"+$scope.getMonthId()+"/"+$scope.currentYear;
  });


  $scope.$watch('weekendOffFlag', function(){   
    $scope.shiftCurrentDate();
  });

  $scope.getMonthId = function()
  {
    for(var i=0;i<$scope.months.length; i++)
    {
      if($scope.currentMonth == $scope.months[i].Name)
        return $scope.months[i].id;
    }
  }

  $scope.isLeapYear = function() {
    var year = $scope.currentYear;
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
    {
      if($scope.currentMonth == $scope.months[1].Name && $scope.currentDay > 29)
        $scope.currentDay = 29;
      $scope.days[1]='29';
    }
    else
    {
      if($scope.currentMonth == $scope.months[1].Name && $scope.currentDay >= 29)
        $scope.currentDay = 28;
      $scope.days[1]='28';
    }
  }

  $scope.setDate = function(currentDay)
  {
    $scope.currentDay = currentDay;
    $scope.showDatepicker = !$scope.showDatepicker;
  }

  $scope.shiftCurrentDate = function()
  {
    var dayOfWeek = $scope.getDayOfWeek($scope.currentDay);
    if(dayOfWeek == 0)
    {
      if($scope.currentDay <= 2)
      {
        $scope.currentDay += 1;
      }
      else
      {
        $scope.currentDay -= 2;
      }
    }
    else if(dayOfWeek == 6)
    {
      if($scope.currentDay == 1)
      {
        $scope.currentDay += 2;
      }
      else
      {
        $scope.currentDay -= 1;
      }
    }
  }

  $scope.setWeekendOffOn = function()
  {
    if($scope.weekendOffFlag=='false')
    {
      $scope.weekendOffFlag = 'true';
    }
    else
    {
      $scope.weekendOffFlag = 'false';
    }
    if($scope.weekendOffFlag == "true" || $scope.weekendOffFlag == true)
    {
      $scope.shiftCurrentDate();
    }
  }
  
  $scope.getDayOfWeek = function(day)
  {
    var month =  $scope.getMonthId($scope.currentMonth);
    var dateString = month+"/"+day+"/"+$scope.currentYear;
    var currentDate = new Date(dateString);
    var dayOfWeek = currentDate.getDay();
    return dayOfWeek;
  }

  $scope.isWeekendOff = function(day)
  {
    var dayOfWeek = $scope.getDayOfWeek(day);
//    alert(day+"  "+dayOfWeek);
    if($scope.weekendOffFlag ==true || $scope.weekendOffFlag == "true")
    {
      if(dayOfWeek == 0 || dayOfWeek == 6)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
    else
    {
      return false;
    }
  }
//function definations over

  $scope.isLeapYear();
}]);

DatePicker.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  }
});

DatePicker.directive('simpleDatepicker',function(){

    return{
      restrict: 'AE',
      scope:{
        dateSelected: '=?date',
        weekendOffFlag: '=?weekendoff',
        showWeekendBtn: '@weekendbtn',
      },
      controller: 'datepickerCtrl',
      template: '<div class="datepicker-container">'+
  '<div>'+
    '<input type="text" value="{{currentDay}}/{{currentMonth}}/{{currentYear}}" ng-click="showDatepicker=!showDatepicker" readonly>'+
    '<span id="calendarIcon" class="glyphicon glyphicon-calendar" ng-click="showDatepicker=!showDatepicker"></span></input>'+
    '<button ng-show="weekendOffFlag==\'true\' && showWeekendBtn==\'true\'" class="btn btn-sm btn-primary" ng-click="showDatepicker=true;setWeekendOffOn()">Show Weekend</button>'+
    '<button ng-show="weekendOffFlag==\'false\' && showWeekendBtn==\'true\'" class="btn btn-sm btn-primary" ng-click="showDatepicker=true;setWeekendOffOn()">Weekend Off</button>'+
  '</div>'+

  '<div class="picker" ng-show="showDatepicker">'+
    '<select class="month" ng-model="currentMonth" ng-options="month.Name as (month.Name) for month in months" ng-change="isLeapYear()">'+
    '</select>'+

    '<select class="year" ng-model="currentYear" ng-change="isLeapYear()" ng-options="year as (year) for year in years">'+
    '</select>'+
    '<p class="daysOfWeek" ng-repeat="day in daysOfWeek">{{day}}</p>'+
    
    '<!-- add extra blocks to shift the date to the correct day of week -->'+
    '<p class="dateunlive" ng-repeat="n in [] | range:getDayOfWeek(1)"></p>'+
    '<a href="" class="datelive" '+
      'ng-repeat="n in [] | range:days[getMonthId()-1]"'+
      'ng-click="setDate(n+1)" '+
      'ng-class="{datedisabled:isWeekendOff(n+1), selected:n+1==currentDay, animateDate: showDatepicker}"> '+
      '{{n+1}} '+
    '</a>'+
  '</div>'+
'</div>'
//      templateUrl: 'templates/calendar.ejs'
    };

});
