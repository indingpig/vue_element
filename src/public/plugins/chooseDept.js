angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('chooseDept', {
        title: 'ChooseDept',
        template: 'formio/components/chooseDept.html',
        settings: {
            input: true,
            tableView: true,
            label: '',
            key: 'chooseDept',
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
            if ($scope.builder) { return };
            var lookupType = $scope.component.lookupType;
            var user = $scope.data.proposerName;
            var isMulti = $scope.component.isMulti || false;
            var isDefaultValue = $scope.component.isDefaultValue || false;
            var component = $scope.component.key;
            if ($scope.data[component + "_deptList"]) {
                $scope.temp = {
                    regCurrency: $scope.data[component + "_deptList"].regCurrency || null,
                    independentAccount: $scope.data[component + "_deptList"].independentAccount || null,
                    entityType: $scope.data.entityType || null,
                    investmentMode: $scope.data[component + "_deptList"].investmentMode || null,
                    ownedContinent: $scope.data[component + "_deptList"].ownedContinent || null,
                    ownedCountry: $scope.data[component + "_deptList"].ownedCountry || null,
                    ownedProvince: $scope.data[component + "_deptList"].ownedProvince || null,
                    ownedCity: $scope.data[component + "_deptList"].ownedCity || null,
                    annualReport: $scope.data[component + "_deptList"].annualReport || null,
                };
                // 流程实例化后，表单数据的请求
                try {
                    var ownedContinentCode = $scope.data.chooseDeptChangeInfo.ownedContinent.Update || null;
                    var ownedCountryCode = $scope.data.chooseDeptChangeInfo.ownedCountry.Update || null;
                    var ownedProvinceCode = $scope.data.chooseDeptChangeInfo.ownedProvince.Update || null;
                }
                catch (erro){
                    // console.log(erro)
                }
                $scope.tempOwnedCountry = getRegionData($scope.temp.ownedContinent, "getCountries");
                $scope.tempOwnedProvinces = getRegionData($scope.temp.ownedCountry, "getProvinces");
                $scope.tempOwnedCities = getCityData($scope.temp.ownedProvince, $scope.temp.ownedCountry);
                $scope.ownedCountry = getRegionData(ownedContinentCode, "getCountries");
                $scope.ownedProvinces = getRegionData(ownedCountryCode, "getProvinces");
                $scope.ownedCities = getCityData(ownedProvinceCode, ownedCountryCode);
            } else {
                $scope.temp = {};
            }

            var ctrl = null;
            //获取币种下拉框信息
            LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'CURRENCY' }, function (_data) {
                $scope.regCurrency = _data
            });
            //获取是否独立核算下拉框
            LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'COUNTERSIGN_STATUS' }, function (_data) {
                $scope.independentAccount = _data
            });
            //获取实体类型下拉框
            LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'ENTITY_TYPE' }, function (_data) {
                $scope.entityType = _data
            });
            // 获取状态
            LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'state' }, function (_data) {
                $scope.state = _data
            });
            //获取投资方式
            LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'INVESTMENT_MODEL' }, function (_data) {
                $scope.investmentMode = _data
            });
            // 获取是否披露年报
            LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'annualReport' }, function (_data) {
                $scope.annualReport = _data
            });
            // 获取大洲
            BaseService._getArray({ _method: 'getRegions', _service: 'areaMgrtService' }, function (_data) {
                $scope.ownedContinent = _data
            });

            // 4级联动
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
                var countryCode = $scope.data['chooseDeptChangeInfo']['ownedCountry']['Update'];
                $scope.ownedCities = getCityData(_code, countryCode)
            }
            

            //获取国家，省份
            function getRegionData(_code, _region) {
                var data = {}
                $.ajax({
                    type: 'GET',
                    url: '/oms/services/rest/areaMgrtService/'+ _region +'/' + _code,
                    cache: false,
                    processData: false,
                    async: false
                }).success(function (_data) {
                    data =  _data;
                }).fail(function (jqXHR, textStatus, errorThrown) {
                });
                return data
            }
            
            //获取城市
            function getCityData(_code, _countryCode){
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
            //当用户选择“信息展示”的时候，不用打开模态框
            if (lookupType == 'exhibitInfo') {
                $scope.Required = function (_com) {
                    return $scope.data['proposer_data'].fullName ==JSON.parse(localStorage['ngStorage-user']).fullName
                }
                // var flag = $scope.data['proposer_desc'] ==JSON.parse(localStorage['ngStorage-user']).fullName ? true: false
            } else {
                //当用户选择其他展示的时候，打开模态框
                switch (lookupType) {
                    // 主信息调整
                    case 'mainInfo':
                        ctrl = ['$scope', '$uibModalInstance', '$localStorage', 'BaseService', 'toaster', 'component', 'parent', 'messService', 'LookUpMgrtService', function ($scope, $uibModalInstance, $localStorage, BaseService, toaster, component, parent, messService, LookUpMgrtService) {
                            $scope.isHide = parent.data.adjustType;
                            $scope.title = '请选择机构';
                            $scope.type = lookupType;
                            $scope.filterOptions = {
                                filterText: "",
                                useExternalFilter: true
                            };
                            $scope.totalServerItems = 1000;

                            $scope.pagingOptions = {
                                pageSizes: [10, 20, 50],
                                pageSize: 10,
                                currentPage: 1
                            };

                            $scope.setPagingData = function (_data) {
                                $scope.myData = _data;
                                if (!$scope.$$phase) {
                                    $scope.$apply();
                                }
                            };

                            $scope.getPagedDataAsync = function (_pageSize, _page, _searchText) {
                                setTimeout(function () {
                                    BaseService._postArray({ _service: 'branchOperateService', _method: 'queryMainUpdateData' },
                                        { 
                                            filter: _searchText
                                        }, function (_data) {
                                            // _.each(_data, function(e) {
                                            //     delete e.cgs
                                            // })
                                            $scope.setPagingData(_data);
                                        }
                                    )
                                }, 100);
                            };

                            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);

                            $scope.$watch('pagingOptions', function (_newVal, _oldVal) {
                                if (_newVal !== _oldVal) {
                                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                                }
                            }, true);

                            $scope.$watch('filterOptions', function (_newVal, _oldVal) {
                                if (_newVal !== _oldVal) {
                                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                                }
                            }, true);

                            if ($scope.isHide == 0) {
                                // 注销机构
                                $scope.gridOptions = {
                                    data: 'myData',
                                    enablePaging: false,
                                    showFooter: false,
                                    multiSelect: isMulti,
                                    selectedItems: [],
                                    columnDefs: [
                                        { field: 'name', displayName: messService.getMess("com.hytera.OrganizationNames")},
                                    ]
                                };

                                //获取左边选取机构的id;
                                $scope.$watch('gridOptions.selectedItems', function (_newVal, _oldVal) {
                                    if (_newVal !== _oldVal) {
                                        $scope.deptMsgList = {};
                                        $scope.selectedItems = _newVal[0];
                                        $scope.haveSubOrganization = haveSubOrganization(_newVal[0].branchCode);
                                    }
                                }, true);

                                function haveSubOrganization(code) {
                                    var result = $.ajax({
                                        type: 'GET',
                                        url: '/oms/services/rest/branchOperateService/haveSubOrganization/' + code,
                                        cache: false,
                                        processData: false,
                                        async: false
                                    });
                                    return result.responseText === 'true' ? true: false
                                }

                                $scope.ok = function () {
                                    if ($scope.gridOptions.selectedItems.length <= 0) {
                                        toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
                                        return;
                                    } else if (!$scope.haveSubOrganization) {
                                        toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.NotAllowCancelled'));
                                        return
                                    }
                                    $uibModalInstance.close();
                                    //绑定所选择的信息；
                                    parent.data[component.key + "_deptList"] = $scope.deptMsgList;
                                    var selectedItem = $scope.gridOptions.selectedItems[0];
                                    parent.data.entityType = selectedItem.entityType;
                                    parent.data[component.key] = selectedItem.branchCode;
                                    parent.data[component.key + '_data'] = selectedItem;
                                    parent.data[component.key + 'ChangeInfo'] = $scope.deptMsgList;
    
                                };
                            } else {
                                //获取左边选取机构的id;
                                $scope.$watch('gridOptions.selectedItems', function (_newVal, _oldVal) {
                                    if (_newVal !== _oldVal) {
                                        var branchCode = _newVal[0].branchCode;
                                        if (_newVal[0].ownedCountry == "CN") {
                                            $scope.country = 'CN'
                                        } else {
                                            $scope.country = 'others'
                                        }
                                        setTimeout(function () {
                                            BaseService._postArray({ _service: 'branchOperateService', _method: 'queryMainUpdateData' },
                                                { ownedCountry: $scope.country, branchCode:branchCode }, function (_data) {
                                                    $scope.deptMsgList = {};
                                                    $scope.selectedItems = [];
                                                    for (var o in _data[0]) {
                                                        var msg1 = {};
                                                        msg1[o] = _data[0][o];
                                                        $scope.selectedItems.push(msg1);
                                                    }
                                                    $scope.selectedItems.splice(-13, 13);
                                                }
                                            )
                                        }, 100);
                                    }
                                }, true)

                                $scope.gridOptions = {
                                    data: 'myData',
                                    enablePaging: false,
                                    showFooter: false,
                                    multiSelect: isMulti,
                                    selectedItems: [],
                                    columnDefs: [
                                        { field: 'name', displayName: messService.getMess("com.hytera.OrganizationNames"),'width':'200%'},
                                    ]
                                };

                                $scope.selectDept = function (_item, _value) {
                                    checkItems(_item) ? delete $scope.deptMsgList[_item] : $scope.deptMsgList[_item] = _value;
                                };

                                function checkItems(_item) {
                                    var arr = [];
                                    for (var o in $scope.deptMsgList) {
                                        arr.push(o)
                                    };
                                    return arr.indexOf(_item) != -1 ? true : false;
                                }
                                $scope.ok = function () {
                                    if ($scope.gridOptions.selectedItems.length <= 0 || _.isEmpty($scope.deptMsgList)) {
                                        toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
                                        return;
                                    }
                                    $uibModalInstance.close();
    
                                    //绑定所选择的信息；
                                    parent.data[component.key + "_deptList"] = $scope.deptMsgList;
                                    var selectedItem = $scope.gridOptions.selectedItems[0];
                                    parent.data.entityType = selectedItem.entityType;
                                    parent.data[component.key + '_data'] = selectedItem;
                                    parent.data[component.key] = selectedItem.branchCode;
                                    parent.data[component.key + 'ChangeInfo'] = $scope.deptMsgList;
                                    parent.temp.regCurrency = $scope.deptMsgList.regCurrency;
                                    parent.temp.independentAccount = $scope.deptMsgList.independentAccount;
                                    parent.temp.entityType = $scope.deptMsgList.entityType;
                                    var changeInfo = {};
    
                                    for (var j in $scope.deptMsgList) {
                                        if (changeInfo[j] == null) {
                                            changeInfo[j] = {};
    
                                        }
                                        changeInfo[j].Original = $scope.deptMsgList[j];
                                    }
    
                                    parent.data[component.key + 'ChangeInfo'] = changeInfo;
    
                                    if (changeInfo.shareholderInfos != undefined) 　{
                                        for (var i = 0; i < changeInfo.shareholderInfos.Original.length; i++) {
                                            changeInfo.shareholderInfos.Original[i].proposerName = user
                                        }
                                        parent.data['shareholderInfos'] = changeInfo.shareholderInfos.Original;
                                    } else {
                                        parent.data['shareholderInfos'] = undefined
                                    }
    
                                };
                            }

                            //取消
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };

                        }];
                        break;
                    // 次信息调整
                    case 'minorInfo':
                        ctrl = ['$scope', '$uibModalInstance', '$localStorage', 'BaseService', 'toaster', 'component', 'parent', 'messService', function ($scope, $uibModalInstance, $localStorage, BaseService, toaster, component, parent, messService) {
                            $scope.isHide = parent.data.adjustType;
                            $scope.title = '请选择机构';
                            $scope.type = lookupType;
                            $scope.filterOptions = {
                                filterText: "",
                                useExternalFilter: true
                            };
                            
                            $scope.totalServerItems = 1000;

                            $scope.pagingOptions = {
                                pageSizes: [10, 20, 50],
                                pageSize: 10,
                                currentPage: 1
                            };

                            $scope.setPagingData = function (_data) {
                                $scope.myData = _data;
                                if (!$scope.$$phase) {
                                    $scope.$apply();
                                }
                            };

                            $scope.getPagedDataAsync = function (_pageSize, _page, _searchText) {
                                setTimeout(function () {
                                    BaseService._postArray({ _service: 'branchOperateService', _method: 'queryOtherUpdateData' },
                                        { branchName: '' }, function (_data) {
                                            _.each(_data, function(e) {
                                                delete e.superMode
                                            })
                                            $scope.setPagingData(_data);
                                        }
                                    )
                                }, 100);
                            };

                            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

                            $scope.$watch('pagingOptions', function (_newVal, _oldVal) {
                                if (_newVal !== _oldVal) {
                                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                                }
                            }, true);

                            $scope.$watch('filterOptions', function (_newVal, _oldVal) {
                                if (_newVal !== _oldVal) {
                                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                                }
                            }, true);

                            //获取左边选取机构的id;
                            $scope.$watch('gridOptions.selectedItems', function (_newVal, _oldVal) {
                                if (_newVal !== _oldVal) {
                                    $scope.deptMsgList = {};
                                    $scope.selectedItems = [];
                                    for (var o in _newVal[0]) {
                                        var msg1 = {};
                                        msg1[o] = _newVal[0][o];
                                        $scope.selectedItems.push(msg1);
                                    }
                                    $scope.selectedItems.splice(-13, 13);
                                }
                            }, true)

                            //表格的信息的绑定
                            $scope.gridOptions = {
                                data: 'myData',
                                enablePaging: false,
                                showFooter: false,
                                multiSelect: isMulti,
                                selectedItems: [],
                                columnDefs: [
                                    { field: 'name', displayName: messService.getMess("com.hytera.OrganizationNames"),'width':'200%'},
                                ]
                            };

                            $scope.selectDept = function (_item, _value) {
                                if (checkItems(_item)) {
                                    delete $scope.deptMsgList[_item]
                                } else {
                                    $scope.deptMsgList[_item] = _value;
                                }
                            };

                            function checkItems(_item) {
                                var arr = [];
                                for (var o in $scope.deptMsgList) {
                                    arr.push(o)
                                };
                                return arr.indexOf(_item) != -1 ? true : false;
                            }

                            $scope.ok = function () {
                                if ($scope.gridOptions.selectedItems.length <= 0 || _.isEmpty($scope.deptMsgList)) {
                                    toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
                                    return;
                                }
                                $uibModalInstance.close();

                                //绑定所选择的信息；
                                parent.data[component.key + "_deptList"] = $scope.deptMsgList;
                                var selectedItem = $scope.gridOptions.selectedItems[0];
                                parent.data.entityType = selectedItem.entityType;
                                parent.data[component.key] = selectedItem.branchCode;
                                parent.data[component.key + '_data'] = selectedItem;
                                parent.data[component.key + 'ChangeInfo'] = $scope.deptMsgList;
                                var changeInfo = {};
                                for (var j in $scope.deptMsgList) {
                                    if (changeInfo[j] == null) {
                                        changeInfo[j] = {}
                                    }
                                    changeInfo[j].Original = $scope.deptMsgList[j];
                                }

                                parent.data[component.key + 'ChangeInfo'] = changeInfo;

                                if (changeInfo.shareholderInfos != undefined) 　{
                                    parent.data['shareholderInfos'] = changeInfo.shareholderInfos.Original;
                                }

                                //获取branchCode
                                BaseService._post({ _service: 'branchOperateService', _method: 'getFormDataByCondition' },
                                    { branchId: selectedItem.branchId }, function (_data) {
                                        parent.data[component.key + '_data'].branchCode = _data.branchCode
                                    }
                                );

                                // 请求国家，省份，城市等数据；
                                var regionCode = parent.temp.ownedContinent = selectedItem.ownedContinent;
                                var countryCode = parent.temp.ownedCountry = selectedItem.ownedCountry;
                                var provinceCode = parent.temp.ownedProvince = selectedItem.ownedProvince;
                                parent.temp.ownedCity = selectedItem.ownedCity;
                                parent.temp.annualReport = selectedItem.annualReport;
                                function queryRegionData(_regionCode, _countryCode, _provinceCode){
                                    // 获取国家数据
                                    parent.tempOwnedCountry = getRegionData(_regionCode, "getCountries");
                                    parent.ownedCountry = getRegionData(_regionCode, "getCountries")
                                    // 获取省份数据
                                    parent.tempOwnedProvinces = getRegionData(_countryCode, "getProvinces");
                                    parent.ownedProvinces = getRegionData(_countryCode, "getProvinces");
                                    // 获取城市数据
                                    parent.tempOwnedCities = getCityData(_provinceCode, _countryCode);
                                    parent.ownedCities = getCityData(_provinceCode, _countryCode);
                                };
                                queryRegionData(regionCode, countryCode, provinceCode);
                            };

                            //取消
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }]
                        break;
                }
            }

            var onClick = function () {
                $uibModal.open({
                    templateUrl: 'chooseDeptDialog.html',
                    controller: ctrl,
                    size: 'lg',
                    resolve: {
                        component: function () {
                            return $scope.component;
                        },
                        parent: function () { return $scope; }
                    }
                });
            };

            $scope.$on('buttonClick', function (event, component, componentId) {
                if (componentId !== $scope.componentId) {
                    return;
                }
                onClick();
            });

            //监听股权信息；
            $scope.$watch('data.shareholderInfos', function (_newVal, _oldVal) {
                if (!_.isArray(_newVal)) return
                if (_newVal !== _oldVal) {
                    for (var i = 0; i < _newVal.length; i++) {
                        _newVal[i].proposerName = user;
                    }

                    if (_newVal.length == 0) {
                        $scope.data['shareholderInfos'] = undefined
                        delete $scope.data[component + "_deptList"]['shareholderInfos'];
                        delete $scope.data[component + "ChangeInfo"]['shareholderInfos'];
                        clear()
                    }
                }
            }, true);
            
            //删除已选的
            $scope.del = function(_item){
                delete $scope.data[component + "_deptList"][_item];
                delete $scope.data[component + 'ChangeInfo'][_item];
                clear()
            }
            
            function clear() {
                if (_.isEmpty($scope.data[component + "_deptList"]) && _.isEmpty($scope.data[component + 'ChangeInfo'])) {
                    $scope.data[component+'_data'] = null;
                    $scope.data[component] = null;
                    $scope.data[component+'Data'] = null;
                    //entityType
                    $scope.data.entityType = null;
                    //orgCode
                    $scope.data.orgCode = null;
                }
            }
            //数字，千分位分隔
            $scope.toThousand = function() {
                var toThousandstr = toThousand($scope.data.chooseDeptChangeInfo.regCapital.Update);
                $scope.data.chooseDeptChangeInfo.regCapital.Update = toThousandstr.replace(/^\d+/g, function(m) { 
                   return m.replace(/(?=(?!^)(\d{3})+$)/g, ',')
                });
                if ($scope.data.chooseDeptChangeInfo.regCapital.Final) {
                    var toThousandstr1 = toThousand($scope.data.chooseDeptChangeInfo.regCapital.Final);
                    $scope.data.chooseDeptChangeInfo.regCapital.Final = toThousandstr1.replace(/^\d+/g, function(m) { 
                        return m.replace(/(?=(?!^)(\d{3})+$)/g, ',')
                     });
                }
            }

            function toThousand(numStr) {
                // 去掉获取数字中的逗号,小数超过两位四舍五入
                var toThousandstr = parseFloat(numStr.replace(/,/g, ''));
                var toThousandnum = toThousandstr.toFixed(2);
                return toThousandnum
            }
        }],
        viewTemplate: 'formio/componentsView/chooseDept.html'
    });

}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
    var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/chooseDept.html" });
    promise.then(function (resp) {
        $templateCache.put('formio/components/chooseDept.html', FormioUtils.fieldWrap(resp.data));
        $templateCache.put('formio/componentsView/chooseDept.html', FormioUtils.fieldWrap(resp.data));
    }, function (resp) {

    });
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('chooseDept', {
        onEdit: ['$scope', function ($scope) {
            // $scope.isHide = ['true','false'];
            $scope.lookupTypes = [{ name: 'mainInfo', title: '主信息调整' }, { name: 'minorInfo', title: '次信息调整' }, { name: 'exhibitInfo', title: '信息展示' }];
        }],
        icon: 'fa fa-pencil',
        views: [
            {
                name: 'Display',
                template: 'formio/components/chooseDept/display.html'
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
    $templateCache.put('formio/components/chooseDept/display.html',
        '<ng-form>'
        + '<form-builder-option property="label"></form-builder-option>'
        // + '<div class="form-group">'
        // + '<label for="isHide" form-builder-tooltip="">{{\'Lookup Type\' | formioTranslate}}</label>'
        // + '<select class="form-control" id="isHide" name="isHide" ng-options="type.name as type.title for type in isHide" ng-model="component.isHide"></select>' 
        // + '</div>'
        + '<div class="form-group">'
        + '<label for="lookupType" form-builder-tooltip="">{{\'Lookup Type\' | formioTranslate}}</label>'
        + '<select class="form-control" id="lookupType" name="lookupType" ng-options="type.name as type.title for type in lookupTypes" ng-model="component.lookupType"></select>'
        + '</div>'
        + '<div class="form-group">'
        + '<label for="isMulti" form-builder-tooltip="">{{\'Multi Select\' | formioTranslate}}</label>'
        + '<input type="checkbox" class="form-control" id="isMulti" name="isMulti" ng-model="component.isMulti"></input>'
        + '</div>'
        + '<div class="form-group">'
        + '<label for="isDefaultValue" form-builder-tooltip="">{{\'Default Value\' | formioTranslate}}</label>'
        + '<input type="checkbox" class="form-control" id="isDefaultValue" name="isDefaultValue" ng-model="component.isDefaultValue"></input>'
        + '</div>'
        + '<form-builder-option property="customClass"></form-builder-option>'
        + '<form-builder-option property="customDisabled"></form-builder-option>'
        + '<form-builder-option property="tabindex"></form-builder-option>'
        + '</ng-form>');
}]);