
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('confirmLaw', {
        title: 'Confirm LawInfo',
        template: 'formio/components/confirmLaw.html',
        settings: {
            input: true,
            tableView: true,
            label: '',
            key: 'confirmLaw',
            placeholder: '',
            protected: false,
            persistent: true,
            clearOnHide: true,
            validate: {
                required: false,
                custom: ''
            }
        },
        controller: ['$scope', '$uibModal', '$localStorage', 'LookUpMgrtService', 'BaseService', function ($scope, $uibModal, $localStorage, LookUpMgrtService, BaseService) {
            if ($scope.builder) return;
            var lookupType = $scope.component.lookupType;
            var timer = '';
            $scope.verify = function() {
                return $scope.data[$scope.component.DefaultAPI] == JSON.parse(localStorage['ngStorage-user']).fullName? true: false;
            };
            var ctrl = ['$scope', '$uibModalInstance', '$localStorage', 'BaseService', 'toaster', 'component', 'parent', 'messService', 'LookUpMgrtService', function ($scope, $uibModalInstance, $localStorage, BaseService, toaster, component, parent, messService, LookUpMgrtService) {
                $scope.record = parent.data.final || {}
                // 流程实例的表单数据
                $scope.temp = {}
                var data = parent.submission.data;
                _.each(data, function (_e, _i, _list) {
                    $scope.temp[_i] = _e;
                })
                //权限控制
                $scope.limit = {
                    person: component.DefaultAPI,
                    permission: function() {
                        return data[this.person]!==JSON.parse(localStorage['ngStorage-user']).fullName;
                    },
                    save: function() {
                        if (!this.permission()) {
                            //临时保存
                            timer = setInterval(function () {
                                saveData()
                            }, 60000)
                        }
                    }
                }
                $scope.limit.permission();
                //$scope.limit.save();

                function saveData() {
                    parent.data.final = {}
                    _.each($scope.record, function(_e, _i, _list) {
                        parent.data['final'][_i] = _e
                    })
                }
                $scope.confirm = function() {
                    //clearInterval(timer);
                    parent.data.final = {};
                    parent.data[component.key + "_data"] = $scope.record;
                    _.each($scope.record, function(_e, _i, _list) {
                        parent.data['final'][_i] = _e
                    })
                    $uibModalInstance.close();
                }

                $scope.cancel = function() {
                    //clearInterval(timer);
                    _.each($scope.record, function(_e, _i, _list) {
                        if (!_e) {
                            parent.data[component.key + "_data"] = null;
                        }
                    })
                    $uibModalInstance.dismiss('cancel');
                }
            }];

            //点击事件打开modal层
            var onClick = function () {
                $uibModal.open({
                    templateUrl: 'confirmLaw.html',
                    controller: ctrl,
                    size: 'lg',
                    resolve: {
                        component: function () {
                            return $scope.component;
                        },
                        parent: function () { return $scope; }
                    },
                    backdrop: "static",
                    keyboard: false
                });
            };
            //接受button的绑定事件
            $scope.$on('buttonClick', function (event, component, componentId) {
                if (componentId !== $scope.componentId) {
                    return;
                }
                onClick();
            });

        }],
        viewTemplate: 'formio/componentsView/confirmLaw.html'
    });
}
]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
    var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/confirmLaw.html" });
    promise.then(function (resp) {
        $templateCache.put('formio/components/confirmLaw.html', FormioUtils.fieldWrap(resp.data));
        $templateCache.put('formio/componentsView/confirmLaw.html', FormioUtils.fieldWrap(resp.data));
    }, function (resp) {

    });
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('confirmLaw', {
        icon: 'fa fa-search',
        views: [
            {
                name: 'Display',
                template: 'formio/components/confirmLaw/display.html'
            },
            {
                name: 'Data',
                template: 'formio/components/common/data.html'
            },
            {
                name: 'Validation',
                template: 'formio/components/textfield/validate.html'
            },
            {
                name: 'API',
                template: 'formio/components/common/api.html'
            },
            {
                name: 'Layout',
                template: 'formio/components/common/layout.html'
            },
            {
                name: 'Conditional',
                template: 'formio/components/common/conditional.html'
            }],
        documentation: ''
    });
}]);
angular.module('ngFormBuilder').run(['$templateCache', function ($templateCache) {
    // Create the settings markup.
    $templateCache.put('formio/components/confirmLaw/display.html',
        '<ng-form>'
        + '<form-builder-option property="placeholder"></form-builder-option>'
        + '<form-builder-option property="customClass"></form-builder-option>'
        + '<form-builder-option property="customDisabled"></form-builder-option>'
        + '<form-builder-option property="tabindex"></form-builder-option>'
        + '<div class="form-group">'
		+ '<label for="DefaultAPI" form-builder-tooltip="">{{\'DefaultAPI\' | formioTranslate}}</label>'
		+ '<input type="text" class="form-control" id="DefaultAPI" name="DefaultAPI" ng-model="component.DefaultAPI"></input>' 
		+ '</div>'
        + '</ng-form>');
}]);