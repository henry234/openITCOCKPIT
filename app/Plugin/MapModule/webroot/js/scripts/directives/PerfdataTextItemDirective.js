angular.module('openITCOCKPIT').directive('perfdataTextItem', function($http){
    return {
        restrict: 'E',
        templateUrl: '/map_module/mapeditors_new/perfdatatext.html',
        scope: {
            'item': '='
        },
        controller: function($scope){

            $scope.showLabel = parseInt($scope.item.show_label, 10) === 1;

            $scope.fontSize = 13;
            if($scope.item.size_y > 0){
                $scope.fontSize = $scope.item.size_y;
            }

            $scope.load = function(){
                $http.get("/map_module/mapeditors_new/mapitem/.json", {
                    params: {
                        'angular': true,
                        'objectId': $scope.item.object_id,
                        'type': $scope.item.type
                    }
                }).then(function(result){
                    $scope.color = result.data.data.color;
                    var perfdata = result.data.data.Perfdata;


                    if(perfdata !== null){
                        if(Object.keys(perfdata).length > 0){
                            $scope.perfdataName = Object.keys(perfdata)[0];
                            $scope.perfdata = perfdata[$scope.perfdataName];
                        }
                    }

                    $scope.init = false;
                });
            };

            $scope.load();
        },

        link: function(scope, element, attr){

        }
    };
});
