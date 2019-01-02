
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('confirmOrgInfo', {
        title: 'Confirm Org Info',
        template: 'formio/components/confirmOrgInfo.html',
        settings: {
            input: true,
            tableView: true,
            label: '',
            key: 'confirmOrgInfo',
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
                $scope.record = parent.data.final || {};
                // if ($scope.record.establishmentTime) {
                //     var datetime = $scope.record.establishmentTime.split('T')[0];
                //     $scope.record.establishmentTime = new Date(datetime);
                // }
                try {
                    var datetime = $scope.record.establishmentTime.split('T')[0];
                    $scope.record.establishmentTime = new Date(datetime);
                } catch (error) {
                    // console.log(error)
                }
                // 流程实例的表单数据
                $scope.temp = {}
                var data = parent.submission.data;
                _.each(data, function(_e, _i, _list) {
                    $scope.temp[_i] = _e;
                })
                //权限控制和临时保存
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
                        if (_i == 'establishmentTime') {
                            parent.data['final'][_i] = _e.toISOString();
                        } else {
                            parent.data['final'][_i] = _e;
                        }
                    })
                };
                //加载流程实例中的下拉框内容；
                function loadingData() {
                    // 获取国家数据
                    $scope.tempOwnedCountry = [];
                    $scope.tempOwnedProvinces = [];
                    $scope.tempOwnedCities = [];
                    if (localStorage.getItem('language' == 'zh-CN')) {
                        $scope.temp.ownedCountry.name = $scope.temp.ownedCountry.zhName;
                        $scope.temp.ownedProvince.name = $scope.temp.ownedProvince.zhName;
                        $scope.temp.ownedCity.name = $scope.temp.ownedCity.zhName;
                    } else {
                        $scope.temp.ownedCountry.name = $scope.temp.ownedCountry.usName;
                        $scope.temp.ownedProvince.name = $scope.temp.ownedProvince.usName;
                        $scope.temp.ownedCity.name = $scope.temp.ownedCity.usName;
                    }
                    $scope.tempOwnedCountry.push($scope.temp.ownedCountry)
                    // 获取省份数据
                    $scope.tempOwnedProvinces.push($scope.temp.ownedProvince);
                    // 获取城市数据
                    $scope.tempOwnedCities.push($scope.temp.ownedCity)
                }
                loadingData();

                //获取币种下拉框信息
                LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'CURRENCY' }, function (_data) {
                    $scope.regCurrency = _data
                });
                //获取实体类型下拉框
                LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'ENTITY_TYPE' }, function (_data) {
                    $scope.entityType = _data
                });
                //获取投资方式
                LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'INVESTMENT_MODEL' }, function (_data) {
                    $scope.investmentMode = _data
                });
                // 获取状态
                LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'state' }, function (_data) {
                    $scope.state = _data
                });
                // 获取大洲
                BaseService._getArray({ _method: 'getRegions', _service: 'areaMgrtService' }, function (_data) {
                    $scope.ownedContinent = _data
                });

                // 4级联动(表单信息懒加载)
                // 获取国家信息
                $scope.getCountry = function (_code) {
                    $scope.ownedCountry = getRegionData(_code, "getCountries");
                    $scope.ownedProvinces = $scope.ownedCities = {}
                };

                // 获取省份信息
                $scope.getProvince = function (_code) {
                    $scope.ownedProvinces = getRegionData(_code, "getProvinces");
                }

                // 获取城市信息
                $scope.getCities = function (_code) {
                    var countryCode = $scope.record.ownedCountry;
                    $scope.ownedCities = getCityData(_code, countryCode)
                }

                //获取国家，省份
                function getRegionData(_code, _region) {
                    var data = {}
                    $.ajax({
                        type: 'GET',
                        url: '/oms/services/rest/areaMgrtService/' + _region + '/' + _code,
                        cache: false,
                        processData: false,
                        async: false
                    }).success(function (_data) {
                        data = _data;
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                    });
                    return data
                }

                //获取城市
                function getCityData(_code, _countryCode) {
                    var data = {};
                    $.ajax({
                        type: 'POST',
                        url: '/oms/services/rest/areaMgrtService/getCities',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify({ 'countryCode': _countryCode, 'provinceCode': _code }),
                        cache: false,
                        processData: false
                    }).success(function (_data) {
                        data = _data
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                    })
                    return data
                }
                //数字，千分位分隔
                $scope.toThousand = function() {
                    if (!$scope.record.regCapital) return
                    var toThousandstr = toThousand($scope.record.regCapital);
                    $scope.record.regCapital = toThousandstr.replace(/^\d+/g, function(m) { 
                    return m.replace(/(?=(?!^)(\d{3})+$)/g, ',')
                    });
                }

                function toThousand(numStr) {
                    // 去掉获取数字中的逗号,小数超过两位四舍五入
                    var toThousandstr = parseFloat(numStr.replace(/,/g, ''));
                    var toThousandnum = toThousandstr.toFixed(2);
                    return toThousandnum
                }
                $scope.confirm = function() {
                    //clearInterval(timer);
                    parent.data[component.key + "_data"] = $scope.record;
                    parent.data.final = {};
                    _.each($scope.record, function(_e, _i, _list) {
                        if (_i == 'establishmentTime') {
                            parent.data['final'][_i] = _e.toISOString();
                        } else {
                            parent.data['final'][_i] = _e;
                        }
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
                    templateUrl: 'confirmOrg.html',
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
        viewTemplate: 'formio/componentsView/confirmOrgInfo.html'
    });
}
]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
    var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/confirmOrgInfo.html" });
    promise.then(function (resp) {
        $templateCache.put('formio/components/confirmOrgInfo.html', FormioUtils.fieldWrap(resp.data));
        $templateCache.put('formio/componentsView/confirmOrgInfo.html', FormioUtils.fieldWrap(resp.data));
    }, function (resp) {

    });
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('confirmOrgInfo', {
        icon: 'fa fa-search',
        views: [
            {
                name: 'Display',
                template: 'formio/components/confirmOrgInfo/display.html'
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
    $templateCache.put('formio/components/confirmOrgInfo/display.html',
        '<ng-form>'
        + '<form-builder-option property="placeholder"></form-builder-option>'
        + '<form-builder-option property="description"></form-builder-option>'
        + '<form-builder-option property="customClass"></form-builder-option>'
        + '<form-builder-option property="customDisabled"></form-builder-option>'
        + '<form-builder-option property="tabindex"></form-builder-option>'
        +'<div class="form-group">'
		+ '<label for="DefaultAPI" form-builder-tooltip="">{{\'DefaultAPI\' | formioTranslate}}</label>'
		+ '<input type="text" class="form-control" id="DefaultAPI" name="DefaultAPI" ng-model="component.DefaultAPI"></input>' 
		+ '</div>'
        + '</ng-form>');
}]);