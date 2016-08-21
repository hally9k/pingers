/**
 * Created by hal.smithstevens on 4/4/2016.
 */
angular.module('pingerApp')
.directive('pingerGrid', function(){
    return {
        scope: {},
        templateUrl: 'pingerGrid.directive.html',
        link: function(scope, elem, attr){},
        controller: function($scope, $http){

            $scope.pingers = [];
            $scope.newUrl = {};


            $scope.getPingers = getPingers;
            $scope.getStatus = getStatus;
            $scope.readonlyEditor = readonlyEditor;
            $scope.saveChanges = saveChanges;
            $scope.toggleStatus = toggleStatus;
            $scope.deleteEntry = deleteEntry;

            $scope.allUrls = {};


            $scope.addNewUrl = function(dataItem){
                var id = dataItem._id;
                $scope.allUrls[id].push($scope.newUrl[id]);
                $scope.newUrl[id] = '';
                saveModel(dataItem, function(){});
            };

            $scope.removeUrl = function(dataItem, urlIndex){
                var id = dataItem._id;
                $scope.allUrls[id].splice(urlIndex, 1);
                saveModel(dataItem, function(){});
            };

            function getPingers(){
                $http.get('/task')
                    .then(
                        function(res){
                            $scope.pingers = res.data;
                            _.each($scope.pingers, function(ping){
                                $scope.allUrls[ping._id] = JSON.parse(JSON.stringify(ping.urls));
                                $scope.newUrl[ping._id] = '';
                            });
                        },
                        function(err){

                        }
                    )
            }

            function getStatus(id, callback) {
                $http.get('/task/' + id + '/status')
                    .then(
                        function(res){
                            callback(res.data);
                        },
                        function(err){

                        }
                    );
            }

            function readonlyEditor(container, options) {
                // dummy to make readonly
            }

            function saveChanges(kendoEvent) {
                saveModel(kendoEvent.model, function(){
                    getPingers();
                });
            }

            function saveModel(model, callback){

                if(!model._id) {
                    model.urls = [];
                } else {
                    model.urls = $scope.allUrls[model._id];
                }


                $http.post('/task', model)
                    .then(
                        function(res){
                            callback(res);
                        },
                        function(err){

                        }
                    )
            }

            function toggleStatus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var action = dataItem.status === 'running' ? 'stop' : 'start';

                $http.get('/task/' + dataItem._id + '/' + action)
                    .then(
                        function(res){
                                dataItem.status = res.data;
                        },
                        function(err){

                        }
                    )

            }


            function deleteEntry(kendoEvent){
                $http.delete('/task/' + kendoEvent.model._id)
                    .then(
                        function(res){
                            getPingers();
                        },
                        function(err){

                        }
                    )
            }



        }
    }
});