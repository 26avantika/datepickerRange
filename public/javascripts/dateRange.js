var DateRange = angular.module('dateRange',['simpleDatePicker']);

DateRange.controller('daterangeCtrl',['$scope','$attrs',
    function($scope,$attrs){
  $scope.daysdiff = 0;  
  $scope.fromDay = '';
  $scope.toDay = '';
  $scope.weekendOffFlag = false;
  
  $scope.$watch('toDay', function(newVal, oldVal) {
    var startDate = parseDate($scope.fromDay+'');
    var endDate = parseDate(newVal+'');
    if(endDate < startDate)
    {
      $scope.toDay = oldVal;
      alert('Starting date cannot be less than end date');
    }
    if(newVal && $scope.fromDay)
      $scope.daysdiff = dayDiff(parseDate(newVal+''), parseDate($scope.fromDay+''));
  });


  $scope.$watch('fromDay', function(newVal, oldVal) {
    var endDate = parseDate($scope.toDay+'');
    var startDate = parseDate(newVal+'');
    if(endDate < startDate)
    {
      $scope.fromDay = oldVal;
      alert('Starting date cannot be less than end date');
    }
    if(newVal && $scope.toDay)
      $scope.daysdiff = dayDiff(parseDate($scope.toDay+''), parseDate(newVal+''));
  });

  function parseDate(str) {
    //alert("parsing date: "+str);
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[1]-1, mdy[0]);
  }

  function calcBusinessDays(dDate1, dDate2) { // input given as Date objects
    var iWeeks, iDateDiff, iAdjust = 0;
    if (dDate2 < dDate1)
    {
      alert("start date should not be less than end date");
      return -1; // error code if dates transposed
    }
    var iWeekday1 = dDate1.getDay(); // day of week
    var iWeekday2 = dDate2.getDay();
    iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
    iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
    //if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
    iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
    iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

    // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
    iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)
    if (iWeekday1 <= iWeekday2)
    {
      iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
    }
    else
    {
      iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
    }

    //iDateDiff -= iAdjust // take into account both days on weekend

      return (iDateDiff + 1); // add 1 because dates are inclusive
  }


  function dayDiff(first, second) {
    if($scope.weekendOffFlag == false || $scope.weekendOffFlag == 'false')
    {
      var diff = Math.round((first-second)/(1000*60*60*24));
      //alert(first+"-"+second+"="+diff);
      return diff+1; //both days inclusive
    }
    else
    {
      return calcBusinessDays(second, first);
    }
  }

  $scope.$watch('weekendOffFlag', function()
  {
    $scope.daysdiff = dayDiff(parseDate($scope.toDay+''), parseDate($scope.fromDay+''));
  });

}]);

DateRange.directive('daterangeCalculator',function(){

    return{
      restrict: 'AE',
      scope:{
        daysdiff: '=?daysdiff',
        fromDay: '=?from',
        toDay: '=?to',
      },
      controller: 'daterangeCtrl',
      template: '<div class="row">'+
                  '<div id="startDate" class="col-md-6">'+
                    '<simple-Datepicker date="fromDay" weekendoff="weekendOffFlag" weekendbtn="false">'+
                  '</div>'+
                  '<div id="endDate" class="col-md-6">'+
                    '<simple-Datepicker date="toDay" weekendoff="weekendOffFlag" weekendbtn="true">'+
                  '</div>'+
                '</div>' 
//      templateUrl: 'templates/dateRange.ejs'
    };

});
