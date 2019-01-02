angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('chooseProject', {
        title: 'ChooseProject',
        template: 'formio/components/chooseProject.html',
        settings: {
            input: true,
            tableView: true,
            label: '',
            key: 'chooseProject',
            placeholder: '',
            protected: false,
            persistent: true,
            clearOnHide: true,
            validate: {
                required: false,
                custom: ''
            }
        },
        controller: ['$scope', '$uibModal', '$localStorage', 'LookUpMgrtService', 'BaseService', '$compile', function ($scope, $uibModal, $localStorage, LookUpMgrtService, BaseService, $compile) {
            if ($scope.builder) { return };
            var lookupType = $scope.component.lookupType;
            var user = $scope.data.proposerName;
            var isMulti = $scope.component.isMulti || false;
            var isDefaultValue = $scope.component.isDefaultValue || false;
            var component = $scope.component.key;
            if ($scope.data[component + "_deptList"]) {
                $scope.temp = {
                    endTime: $scope.data[component + "_deptList"].endTime || null,
                    processInstanceId: $scope.data[component + "_deptList"].processInstanceId || null,
                    projectBudget: $scope.data[component + "_deptList"].projectBudget || null,
                    projectLeader: $scope.data[component + "_deptList"].projectLeader || null,
                    projectLeaderNumber: $scope.data[component + "_deptList"].projectLeaderNumber || null,
                    projectName: $scope.data[component + "_deptList"].projectName || null,
                    projectStatus: $scope.data[component + "_deptList"].projectStatus || null,
                    projectCoding: $scope.data[component + "_deptList"].projectCoding || null
                };
                if($scope.data.chooseProjectChangeInfo.endTime){
                    // $scope.temp.changeEndTime = formatTime($scope.data.chooseProjectChangeInfo.endTime.Update);
                    $scope.data.chooseProjectChangeInfo.endTime.Update = new Date($scope.data.chooseProjectChangeInfo.endTime.Update);
                }
                // 流程实例化后，表单数据的请求
                /* try {
                    var ownedContinentCode = $scope.data.chooseDeptChangeInfo.ownedContinent.Update || null;
                    var ownedCountryCode = $scope.data.chooseDeptChangeInfo.ownedCountry.Update || null;
                    var ownedProvinceCode = $scope.data.chooseDeptChangeInfo.ownedProvince.Update || null;
                }
                catch (erro){
                    // console.log(erro)
                } */
            } else {
                $scope.temp = {};
            }

            // 处理时间格式
            function formatTime(_time){
                var date = new Date(_time);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = month < 10 ? "0" + month : month;
                var day = date.getDate();
                day = day < 10 ? "0" + day : day;
                var formatDate = year + "-" + month + "-" + day;
                return formatDate;
            }

            // 项目状态
            LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'PROJECT-STATUS' }, function (_data) {
                $scope.projectStatus = _data
            });
            
            var ctrl = null;

            switch(lookupType){
                //项目变更
                case 'projChange':
                    // 打开模态框
                    ctrl = ['$scope', '$uibModalInstance', '$localStorage', 'BaseService', 'toaster', 'component', 'parent', 'messService', 'LookUpMgrtService', function ($scope, $uibModalInstance, $localStorage, BaseService, toaster, component, parent, messService, LookUpMgrtService) {
                        // $scope.isHide = parent.data.adjustType;
                        $scope.title = '请选择项目';
                        $scope.type = lookupType;
                        $scope.projectCategory = {
                            itemValue: null
                        };
                        $scope.filterOptions = {
                            filterText: null,
                            useExternalFilter: true
                        };
                        $scope.totalServerItems = 1000;

                        $scope.pagingOptions = {
                            pageSizes: [10, 20, 50],
                            pageSize: 10,
                            currentPage: 1
                        };

                        // 获取项目类别
                        LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'PROJECT-CATEGORY' }, function (_data) {
                            $scope.projectCategoryList = _data
                        });

                        $scope.setPagingData = function (_data) {
                            $scope.myData = _data;
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        };

                        $scope.getPagedDataAsync = function (_pageSize, _page, _projectCategory, _searchText) {
                            setTimeout(function () {
                                BaseService._postArray({ _service: 'proMasterDataMGRTService', _method: 'queryUpdateDataList' },
                                    { 
                                        projectCategory: _projectCategory,
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

                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.projectCategory.itemValue, $scope.filterOptions.filterText);

                        // 监听项目类型
                        $scope.$watch('projectCategory', function (_newVal, _oldVal) {
                            if (_newVal !== _oldVal) {
                                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.projectCategory.itemValue, $scope.filterOptions.filterText);
                            }
                        }, true);

                        // 监听搜索
                        $scope.$watch('filterOptions', function (_newVal, _oldVal) {
                            if (_newVal !== _oldVal) {
                                if(_newVal == ""){
                                    $scope.filterOptions.filterText = null; 
                                }
                                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.projectCategory.itemValue, $scope.filterOptions.filterText);
                            }
                        }, true);

                        //获取左边选取机构的id;
                        $scope.$watch('gridOptions.selectedItems', function (_newVal, _oldVal) {
                            if (_newVal !== _oldVal) {
                                var processInstanceId = _newVal[0].processInstanceId;
                                /* if (_newVal[0].ownedCountry == "CN") {
                                    $scope.country = 'CN'
                                } else {
                                    $scope.country = 'others'
                                } */
                                setTimeout(function () {
                                    BaseService._postArray({ _service: 'proMasterDataMGRTService', _method: 'queryUpdateDataList' },
                                        { processInstanceId:processInstanceId }, function (_data) {
                                            $scope.deptMsgList = {};
                                            $scope.selectedItems = [];
                                            for (var o in _data[0]) {
                                                var msg1 = {};
                                                msg1[o] = _data[0][o];
                                                $scope.selectedItems.push(msg1);
                                            }
                                            $scope.selectedItems.splice(-13, 13);   //切掉后面不需要的值
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
                                { field: 'projectName', displayName: messService.getMess("com.hytera.rip.ProjectName"),'width':'200%'},
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

                            //处理时间格式
                            if($scope.deptMsgList.endTime){
                                $scope.deptMsgList.endTime = $scope.deptMsgList.endTime.substring(0,10);
                            }

                            //绑定所选择的信息；
                            parent.data[component.key + "_deptList"] = $scope.deptMsgList;
                            var selectedItem = $scope.gridOptions.selectedItems[0];
                            parent.data.projectStatus = selectedItem.projectStatus;
                            parent.data[component.key + '_data'] = selectedItem;
                            parent.data[component.key] = selectedItem.processInstanceId;
                            parent.data[component.key + 'ChangeInfo'] = $scope.deptMsgList;
                            parent.temp.projectStatus = $scope.deptMsgList.projectStatus;
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

                        //取消
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        
                    }];
                break;
                //项目状态批量变更
                case 'projStatusChange':
                    // 打开模态框
                    ctrl = ['$scope', '$uibModalInstance', '$localStorage', 'BaseService', 'toaster', 'component', 'parent', 'messService', 'LookUpMgrtService', function ($scope, $uibModalInstance, $localStorage, BaseService, toaster, component, parent, messService, LookUpMgrtService) {
                        // $scope.isHide = parent.data.adjustType;
                        $scope.title = '请选择项目';
                        $scope.type = lookupType;
                        $scope.projectCategory = {
                            itemValue: null
                        };
                        $scope.filterOptions = {
                            filterText: null,
                            useExternalFilter: true
                        };
                        $scope.totalServerItems = 1000;

                        $scope.pagingOptions = {
                            pageSizes: [10, 20, 50],
                            pageSize: 10,
                            currentPage: 1
                        };

                        // 获取项目类别
                        LookUpMgrtService._getArray({ _method: 'getLookUpItemByKL', _id: 'PROJECT-CATEGORY' }, function (_data) {
                            $scope.projectCategoryList = _data
                        });

                        $scope.setPagingData = function (_data) {
                            $scope.myData = _data;
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        };

                        $scope.getPagedDataAsync = function (_pageSize, _page, _projectCategory, _searchText) {
                            setTimeout(function () {
                                BaseService._postArray({ _service: 'proMasterDataMGRTService', _method: 'queryUpdateDataList' },
                                    { 
                                        projectCategory: _projectCategory,
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

                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.projectCategory.itemValue, $scope.filterOptions.filterText);

                        // 监听项目类型
                        $scope.$watch('projectCategory', function (_newVal, _oldVal) {
                            if (_newVal !== _oldVal) {
                                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.projectCategory.itemValue, $scope.filterOptions.filterText);
                            }
                        }, true);

                        // 监听搜索
                        $scope.$watch('filterOptions', function (_newVal, _oldVal) {
                            if (_newVal !== _oldVal) {
                                if(_newVal == ""){
                                    $scope.filterOptions.filterText = null; 
                                }
                                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.projectCategory.itemValue, $scope.filterOptions.filterText);
                            }
                        }, true);

                        $scope.gridOptions = {
                            data: 'myData',
                            enablePaging: false,
                            showFooter: false,
                            multiSelect: isMulti,
                            selectedItems: [],
                            columnDefs: [
                                { field: 'projectName', displayName: messService.getMess("com.hytera.rip.ProjectName")},
                            ]
                        };

                        /* $scope.selectDept = function (_item, _value) {
                            checkItems(_item) ? delete $scope.deptMsgList[_item] : $scope.deptMsgList[_item] = _value;
                        };

                        function checkItems(_item) {
                            var arr = [];
                            for (var o in $scope.deptMsgList) {
                                arr.push(o)
                            };
                            return arr.indexOf(_item) != -1 ? true : false;
                        } */

                        $scope.ok = function () {
                            var selectOptions = $scope.gridOptions.selectedItems;
                            if (selectOptions.length <= 0) {
                                toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
                                return;
                            }
                            //绑定所选择的信息;
                            $scope.selectedItems = [];
                            $scope.deptMsgList = [];
                            _.each(selectOptions, function(_e,_i){
                                $scope.selectedItems.push(_e);
                            });
                            // parent.data[component.key + "_deptList"] = $scope.selectedItems;
                            // var selectedItem = $scope.gridOptions.selectedItems[0];
                            parent.data.projectStatus = $scope.selectedItems.projectStatus;
                            if(!parent.data[component.key + '_data']){
                                parent.data[component.key + '_data'] = $scope.selectedItems;
                            }else{
                                _.each($scope.selectedItems, function(_e, _i){
                                    parent.data[component.key + '_data'].push(_e);
                                })
                            }
                            parent.data[component.key] = $scope.selectedItems.processInstanceId;
                            parent.data[component.key + 'ChangeInfo'] = $scope.deptMsgList;
                            parent.temp.projectStatus = $scope.deptMsgList.projectStatus;
                            
                            /* var changeInfo = {};

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
 */
                            $uibModalInstance.close();
                        };

                        //取消
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };

                    }];
                break;
            }

            var onClick = function () {
                $uibModal.open({
                    templateUrl: 'chooseProjectDialog.html',
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

            // 结束时间组件
            $scope.popup = {
                endTimePopup: false
            };
            $scope.endTimeOpen = function() {
                $scope.popup.endTimePopup = true;
            };
            
            var selectProjectLeaderctrl = null;
            selectProjectLeaderctrl = ['$scope','$uibModalInstance','UserService', 'messService', 'toaster', 'parent', 'view', 'isMulti', function($scope, $uibModalInstance, UserService, messService, toaster, parent, view,  _isMulti) {
                $scope.title = '选择项目负责人';
                $scope.lookupType = 'employee';
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
                    $scope.myData = _data.dataList;
                    $scope.totalServerItems = _data.total;
                    if (!$scope.$$phase) {
                    $scope.$apply();
                    }
                };
                $scope.getPagedDataAsync = function (_pageSize, _page, _searchText) {
                setTimeout(function () {
                    UserService._queryPage({ _method: 'selectList' }, {
                        currentPage: _page,
                        showCount: _pageSize,
                        pd: {
                            filter: _searchText
                        }
                    }, function (_data) {
                        $scope.setPagingData(_data);
                    });
                }, 100);
                };
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
                // 监听分页的变化并请求数据
                $scope.$watch('pagingOptions', function (_newVal, _oldVal) {
                if (_newVal !== _oldVal) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                }
                }, true);
                // 监听搜索的变化并请求数据
                $scope.$watch('filterOptions', function (_newVal, _oldVal) {
                    if (_newVal !== _oldVal) {
                        $scope.pagingOptions.currentPage = 1;   //搜索后重新从第一页展示
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                    }
                }, true);

                $scope.gridOptions = {
                    data: 'myData',                               // myData 为 $scope.myData
                    enablePaging: true,                           // 是否分页
                    showFooter: true,                             // 是否展示列表脚部部分
                    multiSelect: _isMulti,                        // 是否多选
                    selectedItems: [],                            // 选择的行存放成一个数组
                    enableColumnResize:true,                      // 自由调整列宽度
                    totalServerItems: 'totalServerItems',         // 数据条目总数
                    pagingOptions: $scope.pagingOptions,          // 绑定分页
                    filterOptions: $scope.filterOptions,          // 绑定搜索
                    columnDefs: [
                        { field: 'userName', displayName: messService.getMess("com.hytera.userName"), width:80 },
                        { field: 'realName', displayName: messService.getMess("com.hytera.fullName") },
                        { field: 'empNo', displayName: messService.getMess("com.hytera.jobNumber"), width:100 },
                        { field: 'fullName', displayName: messService.getMess("com.hytera.fullName") },
                        { field: 'fullPath', displayName: messService.getMess("com.hytera.rip.Department"),cellTemplate: '<div ng-bind=\' row.getProperty("fullPath") \' style="line-height:30px;height:30px;" title=\' {{row.getProperty("fullPath") }}\'></div>' },
                        { field: 'email', displayName: messService.getMess("com.hytera.mailBox") }
                    ]
                };

                $scope.ok = function () {
                    if ($scope.gridOptions.selectedItems.length <= 0) {       // 判断用户有没有选择条目
                        toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
                        return;
                    }
                    parent.data.chooseProjectChangeInfo.projectLeader.Update = $scope.gridOptions.selectedItems[0];
                    $uibModalInstance.close();
                };
                $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
                };
            }];
            //选择项目负责人
            $scope.selectProjectLeader = function(){
                $uibModal.open({
                    templateUrl : 'lookupDialog.html',
                    controller : selectProjectLeaderctrl,
                    size: 'lg',         
                    resolve : {
                        isMulti: false,     //单选
                        parent : function() {return $scope;},
                        view: function() { return self }
                    }
                });
            }

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

            //状态批量删除已选的
            $scope.statusDel = function(_item){
                $scope.data[component + "_data"].splice(_item,1);
            }
            
            //数字，千分位分隔
            $scope.toThousand = function() {
                var toThousandstr = toThousand($scope.data.chooseProjectChangeInfo.projectBudget.Update);
                $scope.data.chooseProjectChangeInfo.projectBudget.Update = toThousandstr.replace(/^\d+/g, function(m) { 
                   return m.replace(/(?=(?!^)(\d{3})+$)/g, ',')
                });
                if ($scope.data.chooseProjectChangeInfo.projectBudget.Final) {
                    var toThousandstr1 = toThousand($scope.data.chooseProjectChangeInfo.projectBudget.Final);
                    $scope.data.chooseProjectChangeInfo.projectBudget.Final = toThousandstr1.replace(/^\d+/g, function(m) { 
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

            //处理时间格式
            $scope.formatTime = function(_time){
                if(!$scope.data.chooseProjectChangeInfo.endTime.Update) return;
                var date = new Date($scope.data.chooseProjectChangeInfo.endTime.Update);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = month < 10 ? "0" + month : month;
                var day = date.getDate();
                day = day < 10 ? "0" + day : day;
                var formatDate = year + "-" + month + "-" + day;
                $scope.data.chooseProjectChangeInfo.endTime.Update = formatDate;
            }

        }],
        viewTemplate: 'formio/componentsView/chooseProject.html'
    });

}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
    var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/chooseProject.html" });
    promise.then(function (resp) {
        $templateCache.put('formio/components/chooseProject.html', FormioUtils.fieldWrap(resp.data));
        $templateCache.put('formio/componentsView/chooseProject.html', FormioUtils.fieldWrap(resp.data));
    }, function (resp) {

    });
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('chooseProject', {
        onEdit: ['$scope', function ($scope) {
            // $scope.isHide = ['true','false'];
            $scope.lookupTypes = [{ name: 'projChange', title: '项目变更' }, { name: 'projStatusChange', title: '项目状态批量变更' }];
        }],
        icon: 'fa fa-pencil',
        views: [
            {
                name: 'Display',
                template: 'formio/components/chooseProject/display.html'
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
    $templateCache.put('formio/components/chooseProject/display.html',
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