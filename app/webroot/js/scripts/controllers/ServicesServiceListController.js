angular.module('openITCOCKPIT')
    .controller('ServicesServiceListController', function($scope, $http, SortService, MassChangeService, QueryStringService){

        SortService.setSort('Servicestatus.current_state');
        SortService.setDirection('desc');
        $scope.currentPage = 1;

        $scope.hostId = QueryStringService.getCakeId();

        $scope.massChange = {};
        $scope.selectedElements = 0;
        $scope.deleteUrl = '/services/delete/';
        $scope.deactivateUrl = '/services/deactivate/';
        $scope.activateUrl = '/services/enable/';

        $scope.activeTab = 'active';

        //There is no service status for not monitored services :)
        $scope.fakeServicestatus = {
            Servicestatus: {
                currentState: 5
            }
        };

        var graphStart = 0;
        var graphEnd = 0;

        $scope.changeTab = function(tab){
            if(tab !== $scope.activeTab){
                $scope.services = [];
                $scope.activeTab = tab;
                $scope.undoSelection();

                SortService.setSort('Service.servicename');
                SortService.setDirection('asc');
                $scope.currentPage = 1;

                if($scope.activeTab === 'deleted'){
                    SortService.setSort('DeletedService.name');
                }

                $scope.load();
            }

        };

        $scope.load = function(){
            switch($scope.activeTab){
                case 'active':
                    $scope.loadActiveServices();
                    break;

                case 'notMonitored':
                    $scope.loadNotMonitoredServices();
                    break;

                case 'disabled':
                    $scope.loadDisabledServices();
                    break;

                case 'deleted':
                    $scope.loadDeletedServices();
                    break;
            }
        };

        $scope.loadTimezone = function(){
            $http.get("/angular/user_timezone.json", {
                params: {
                    'angular': true
                }
            }).then(function(result){
                $scope.timezone = result.data.timezone;
            });
        };

        $scope.loadHost = function(){
            $http.get("/hosts/loadHostById/" + $scope.hostId + ".json", {
                params: {
                    'angular': true
                }
            }).then(function(result){
                $scope.host = result.data.host;
            });
        };

        $scope.loadActiveServices = function(){
            var params = {
                'angular': true,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Host.id]': $scope.hostId
            };

            $http.get("/services/index.json", {
                params: params
            }).then(function(result){
                $scope.services = [];
                $scope.services = result.data.all_services;

                $scope.paging = result.data.paging;
                $scope.init = false;
            });
        };

        $scope.loadNotMonitoredServices = function(){
            var params = {
                'angular': true,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Host.id]': $scope.hostId
            };

            $http.get("/services/notMonitored.json", {
                params: params
            }).then(function(result){
                $scope.services = [];
                $scope.services = result.data.all_services;

                $scope.paging = result.data.paging;
                $scope.init = false;
            });
        };

        $scope.loadDisabledServices = function(){
            var params = {
                'angular': true,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Host.id]': $scope.hostId
            };

            $http.get("/services/disabled.json", {
                params: params
            }).then(function(result){
                $scope.services = [];
                $scope.services = result.data.all_services;

                $scope.paging = result.data.paging;
                $scope.init = false;
            });
        };

        $scope.loadDeletedServices = function(){
            var params = {
                'angular': true,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[DeletedService.host_id]': $scope.hostId
            };

            $http.get("/services/deleted.json", {
                params: params
            }).then(function(result){
                $scope.deletedServices = [];
                $scope.deletedServices = result.data.all_services;

                $scope.paging = result.data.paging;
                $scope.init = false;
            });
        };

        $scope.loadHosts = function(searchString){
            $http.get("/hosts/loadHostsByString.json", {
                params: {
                    'angular': true,
                    'filter[Host.name]': searchString,
                    'selected[]': $scope.hostId
                }
            }).then(function(result){
                $scope.hosts = result.data.hosts;
            });
        };

        $scope.changepage = function(page){
            $scope.undoSelection();
            if(page !== $scope.currentPage){
                $scope.currentPage = page;
                $scope.load();
            }
        };

        $scope.selectAll = function(){
            if($scope.services){
                for(var key in $scope.services){
                    if($scope.services[key].Service.allow_edit){
                        var id = $scope.services[key].Service.id;
                        $scope.massChange[id] = true;
                    }
                }
            }
        };

        $scope.undoSelection = function(){
            MassChangeService.clearSelection();
            $scope.massChange = MassChangeService.getSelected();
            $scope.selectedElements = MassChangeService.getCount();
        };

        $scope.getObjectForDelete = function(host, service){
            var object = {};
            object[service.Service.id] = host.Host.name + '/' + service.Service.servicename;
            return object;
        };

        $scope.getObjectsForDelete = function(){
            var objects = {};
            var selectedObjects = MassChangeService.getSelected();
            for(var key in $scope.services){
                for(var id in selectedObjects){
                    if(id == $scope.services[key].Service.id){
                        objects[id] =
                            $scope.services[key].Host.hostname + '/' +
                            $scope.services[key].Service.servicename;
                    }

                }
            }
            return objects;
        };

        $scope.getObjectsForExternalCommand = function(){
            var objects = {};
            var selectedObjects = MassChangeService.getSelected();
            for(var key in $scope.services){
                for(var id in selectedObjects){
                    if(id == $scope.services[key].Service.id){
                        objects[id] = $scope.services[key];
                    }

                }
            }
            return objects;
        };

        $scope.linkForCopy = function(){
            var baseUrl = '/services/copy/';
            var ids = Object.keys(MassChangeService.getSelected());
            return baseUrl + ids.join('/');
        };

        $scope.linkForAddToServicegroup = function(){
            var baseUrl = '/servicegroups/mass_add/';
            var ids = Object.keys(MassChangeService.getSelected());
            return baseUrl + ids.join('/');
        };

        $scope.mouseenter = function($event, host, service){
            $scope.isLoadingGraph = true;
            var offset = {
                top: $event.relatedTarget.offsetTop + 40,
                left: $event.relatedTarget.offsetLeft + 40
            };

            offset.top += $event.relatedTarget.offsetParent.offsetTop;

            var currentScrollPosition = $(window).scrollTop();

            var margin = 15;
            var $popupGraphContainer = $('#serviceGraphContainer');


            if((offset.top - currentScrollPosition + margin + $popupGraphContainer.height()) > $(window).innerHeight()){
                //There is no space in the window for the popup, we need to set it to an higher point
                $popupGraphContainer.css({
                    'top': parseInt(offset.top - $popupGraphContainer.height() - margin + 10),
                    'left': parseInt(offset.left + margin),
                    'padding': '6px'
                });
            }else{
                //Default Popup
                $popupGraphContainer.css({
                    'top': parseInt(offset.top + margin),
                    'left': parseInt(offset.left + margin),
                    'padding': '6px'
                });
            }

            $popupGraphContainer.show();
            loadGraph(host, service);
        };

        $scope.mouseleave = function(){
            $('#serviceGraphContainer').hide();
            $('#serviceGraphFlot').html('');
        };

        var loadGraph = function(host, service){
            graphEnd = Math.floor(Date.now() / 1000);
            graphStart = graphEnd - (3600 * 4);

            $http.get('/Graphgenerators/getPerfdataByUuid.json', {
                params: {
                    angular: true,
                    host_uuid: host.Host.uuid,
                    service_uuid: service.Service.uuid,
                    start: graphStart,
                    end: graphEnd,
                    jsTimestamp: 1
                }
            }).then(function(result){
                $scope.isLoadingGraph = false;
                renderGraph(result.data.performance_data);
            });
        };

        var renderGraph = function(performance_data){
            var graph_data = [];
            for(var dsCount in performance_data){
                graph_data[dsCount] = [];
                for(var timestamp in performance_data[dsCount].data){
                    var frontEndTimestamp = (parseInt(timestamp, 10) + ($scope.timezone.user_offset * 1000));
                    graph_data[dsCount].push([frontEndTimestamp, performance_data[dsCount].data[timestamp]]);
                }
            }
            var GraphDefaultsObj = new GraphDefaults();
            var color_amount = performance_data.length < 3 ? 3 : performance_data.length;
            var colors = GraphDefaultsObj.getColors(color_amount);
            var options = GraphDefaultsObj.getDefaultOptions();
            options.colors = colors.border;
            options.xaxis.tickFormatter = function(val, axis){
                var fooJS = new Date(val + ($scope.timezone.user_offset * 1000));
                var fixTime = function(value){
                    if(value < 10){
                        return '0' + value;
                    }
                    return value;
                };
                return fixTime(fooJS.getUTCDate()) + '.' + fixTime(fooJS.getUTCMonth() + 1) + '.' + fooJS.getUTCFullYear() + ' ' + fixTime(fooJS.getUTCHours()) + ':' + fixTime(fooJS.getUTCMinutes());
            };
            options.xaxis.min = graphStart * 1000;
            options.xaxis.max = graphEnd * 1000;

            self.plot = $.plot('#serviceGraphFlot', graph_data, options);
        };

        $scope.$watch('hostId', function(){
            $scope.loadHost();
            $scope.load();
        });

        $scope.$watch('massChange', function(){
            MassChangeService.setSelected($scope.massChange);
            $scope.selectedElements = MassChangeService.getCount();
        }, true);

        $scope.loadTimezone();
        SortService.setCallback($scope.load);

        $scope.loadHosts('');

    });