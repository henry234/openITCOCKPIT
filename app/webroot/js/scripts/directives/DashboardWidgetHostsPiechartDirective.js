angular.module('openITCOCKPIT').directive('dashboardWidgetHostsPiechartDirective', function($http, $interval){
    return {
        restrict: 'A',
        templateUrl: '/dashboards/widget_hosts_piechart.html',
        scope: {
            'widget-title': '=',
            'widget-id': '=',
            'updateTitle': '&updateTitle'
        },

        controller: function($scope){

            $scope.widget = null;

            $scope.load = function(){
                $http.get('/dashboards/widget_hosts_piechart.json', {
                    params: {
                        'angular': true
                    }
                }).then(function(result){
                    $scope.widget = result.data.hosts_piechart;
                    let x = [12, 5, 2];
                    let xsum = 0;
                    x.forEach(function(num){
                        xsum = (xsum + num);
                    });
                    $scope.widget = {
                        'up': [x[0], Math.round((x[0] / xsum) * 100)],
                        'down': [x[1], Math.round((x[1] / xsum) * 100)],
                        'unreachable': [x[2], Math.round((x[2] / xsum) * 100)]
                    };


                    angular.element(function(){        //page loading completed
                        if(document.getElementById("myChart" + $scope.id)){
                            $scope.ctx = document.getElementById("myChart" + $scope.id);
                            console.log($scope.widget);


                            let $backgroundColor = [
                                'rgba(68, 157, 68, 1)',
                                'rgba(201, 48, 44, 1)',
                                'rgba(146, 162, 168, 1)'
                            ];

                            if($scope.title === "Pacman"){
                                $backgroundColor = [
                                    'rgba(243, 232, 20, 1)',
                                    'rgba(0, 0, 0, 1)',
                                    'rgba(243, 232, 20, 1)'
                                ];
                                $scope.widget.up[0] = 4;
                                $scope.widget.down[0] = 1;
                                $scope.widget.unreachable[0] = 1;
                            }

                            $scope.myPieChart = new Chart($scope.ctx, {
                                type: 'pie',
                                data: {
                                    labels: ["Up", "Down", "Unreachable"],
                                    datasets: [{
                                        data: [
                                            $scope.widget.up[0],
                                            $scope.widget.down[0],
                                            $scope.widget.unreachable[0]
                                        ],
                                        backgroundColor: $backgroundColor,
                                        borderWidth: 0
                                    }]
                                },
                                options: {
                                    legend: {
                                        display: true,
                                        labels: {
                                            usePointStyle: true,
                                            generateLabels: {
                                                hidden: true
                                            }

                                        }
                                    }
                                }
                            });
                        }
                    });

                });
            };

            $scope.load();
            $('[data-toggle="tooltip"]').tooltip();

        },

        link: function($scope, element, attr){
            $scope.title = decodeURI(attr.widgetTitle);
            $scope.titleOrig = decodeURI(attr.widgetTitle);
            $scope.id = attr.widgetId;

            $scope.$watch('title', function(){
                if(encodeURI($scope.title) != encodeURI($scope.titleOrig) && $scope.title){
                    $scope.updateTitle({id: $scope.id, title: encodeURI($scope.title)});
                    if($scope.title === "Pacman" || ($scope.titleOrig === "Pacman" && $scope.title !== "Pacman")){
                        $scope.load();
                    }
                    $scope.titleOrig = $scope.title;
                }
            });

        }

    };
});
