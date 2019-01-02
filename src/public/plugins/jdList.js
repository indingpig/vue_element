angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('jdList', {
        title: 'jdList',
        template: 'formio/components/jdList.html',
        settings: {
            input: true,
            tableView: true,
            label: '',
            key: 'jdList',
            placeholder: '',
            protected: false,
            persistent: true,
            clearOnHide: true,
            validate: {
                required: false,
                custom: ''
            },
            lookupType: 'applyList'
        },
        controller: ['$scope', '$uibModal', 'messService', '$timeout','$stateParams', 'BaseService','BaseTools', function ($scope, $uibModal, messService, $timeout,$stateParams,BaseService,BaseTools ) {
            if ($scope.builder) return;
            var maxWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            $scope.key = $scope.component.lookupType;
            webix.ready(function() {
                var componentId = $scope.component.key;
                // 通过路由获取订单号;
                var orderCode = $stateParams.pid;
                // 提交表单后，返回申请单先查看表单是否有数据
                if (!$scope.data[componentId]) {
                    // 若没有，检测缓存
                    // 在狗东慧采后台界面跳转后获取信息
                    var gdData = JSON.parse(sessionStorage.getItem('jdOrder_data'));
                    if ($stateParams.module == 'newTask' && gdData) {
                        $scope.data[componentId] = [];
                        BaseService._getArray({_service: 'jdTempOrderService', _method: 'getDetilByOrderCode', _id:orderCode},function(_data){
                            var orderTotalPrice = 0;
                            _.each(_data, function (_e, _i) {
                                var dataTemp = {
                                    serialNum: _i + 1,
                                    orderCode: _e.orderCode,
                                    description: _e.description,
                                    quantity: _e.quantity,
                                    unit: '个',
                                    price: _e.price,
                                    totalPrice: (_e.price * _e.quantity).toFixed(2),
                                    costDept: gdData.branch,
                                    itemCode: _e.itemCode // 物品编码
                                };
                                // Number()
                                orderTotalPrice += Number(dataTemp.totalPrice);
                                $scope.data[componentId].push(dataTemp);
                            });
                            $scope.data.orderTotalPrice = orderTotalPrice;
                        });
                    }
                }
                // 用户编辑完，将数据绑定到表单;
                $scope.bandData = function() {
                    var tabTemp = [];
                    $$(componentId).eachRow(function(_row) {
                        var rowItem = this.getItem(_row);
                        tabTemp.push(rowItem);
                    });
                    $scope.data[componentId] = tabTemp;
                    // console.log(tabTemp);
                };
                var component = {
                    view: 'datatable',
                    id: componentId,
                    autoheight: true,
                    width:maxWidth-355,
                    scroll:true,
                    scrollY:true,
                    tooltip:true,
                    resizeColumn:true,
                    multiselect: true,
                    editable:!$scope.isdisabled,
                    checkboxRefresh:true, 
                    select: "cell",
                    data:[],
                    on: {
                        onAfterLoad:function(){
                            $('#'+ $scope.key +'_placeholder').css('display','none');
                            this.hideOverlay();
                            if (!this.count()){
                                this.showOverlay("没有符合条件的数据");
                            }
                        },
                        onAfterEditStop: function(_state, _editor) {
                            if (_state.old != _state.value) {
                                // 用户编辑完，将数据绑定到表单;
                                $scope.bandData();
                            }
                        }
                    }
                };
                switch ($scope.key) {
                    case 'applyList':
                        renderTab($scope.key);
                        break;
                    case 'assetIncome': 
                        renderAssetIncome($scope.key);
                        break;
                    case 'purchaseTab': 
                        renderPurchaseTab($scope.key);
                        break;
                    default:
                        // sessionStorage.setItem('jdOrder_data', JSON.stringify({orderCode: 77980585546}));
                        renderSignList();
                        break;
                }
                function renderSignList() {
                    if (!$scope.data[componentId]) {
                        var orderCode = $scope.data.orderCode;
                        BaseService._get({_method:'getJdConfirmOrderInfo', _id: orderCode, _service:'jdConfirmOrderService'},function(_data){
                            $scope.arrayFlag = _.isArray(_data.data);
                            if ($scope.arrayFlag) {
                                _.each(_data.data, function(_e, _i) {
                                    delete _e.signState;
                                });
                            } else {
                                delete _data.data.signState;
                            }
                            $scope.data[componentId] = _data.data;
                        });
                    }
                    $scope.arrayFlag = _.isArray($scope.data[componentId]);
                    $timeout(function() {
                        $('#'+ $scope.key +'_placeholder').css('display','none');
                    },200);
                }
                function webixDateFilter(_data) {
                    _.each(_data, function(_e, _i){
                        if (_e.date) {
                            _e.date = new Date(_e.date);
                        }
                    });
                }
                $scope.receive = function(_status, _item) {
                    // _status 为1接受，0 拒收
                    $scope.signState = _status;
                    $scope.item = _item;
                    $uibModal.open({
                        templateUrl : 'signForConfirmDialog.html',
                        controller : signForCtrl,
                        size: 'lg',
                        resolve : {
                            parent : function() {return $scope;},
                        }
                    });
                };
                function renderPurchaseTab(_container) {
                    var purchaseTab = $.extend(true, {}, component);
                    purchaseTab.columns = [
                        {id:'serialNum',header: messService.getMess('com.hytera.serialNumber'), sort: 'string',width:50},
                        {id:'description',header: messService.getMess('物品名称'), sort: 'string'},
                        {id:'itemType',header: messService.getMess('规格型号'), sort: 'string'},
                        {id:'quantity',header: messService.getMess('申请数量'), sort: 'string'},
                        {id:'price',header: messService.getMess('申请单价'), sort: 'string'},
                        {id:'suggestPrice',header: messService.getMess('采购建议单价'), sort: 'string', editor:'text', numberFormat:'1.00'},
                        {id:'totalPrice',header: messService.getMess('申请总价'), sort: 'string'},
                        {id:'suggestTotalPrice',header: messService.getMess('采购建议总价'), sort: 'string'},
                        {id:'remarks',header: messService.getMess('com.hytera.remarks'), sort: 'string',fillspace:true, editor:'popup'},
                    ];
                    purchaseTab.on.onAfterEditStop = function(_state, _editor) {
                        var rowItem = this.getItem(_editor.row);
                        if (_editor.column == 'suggestPrice') {
                            rowItem.suggestPrice = BaseTools.numberCheck(_state.value, 2);
                            rowItem.suggestTotalPrice = (rowItem.quantity * rowItem.suggestPrice).toFixed(2);
                        }
                    };
                    renderWebixTab(_container, purchaseTab);
                }
                function custom_checkbox(obj, common, value) {
                    $scope.bandData();
                    if (value) {
                        // webix_table_checkbox 这个类名是必须的
                        return "<div class='webix_table_checkbox switch toggle-on checked'><div></div></div>";
                    } else {
                        return "<div class='webix_table_checkbox switch toogle-off notchecked'><div></div></div>";
                    }
                }
                function renderWebixTab( _container, _component) {
                    $timeout(function() {
                        webix.ui({
                            container: _container,
                            id: _container,
                            rows: []
                        });
                        dyData(_container,_component);
                    }, 200);
                }
                // 重新绑定webix的数据;
                function dyData(_container, _component) {
                    var list = $$(_container);
                    list.addView(_component, 0);
                    webixDateFilter($scope.data[componentId]);
                    $$(componentId).define('data', $scope.data[componentId]);
                    $$(componentId).refresh();
                }
                function renderAssetIncome(_container) {
                    // 深克隆
                    var assectIncomeTab = $.extend(true, {}, component);
                    assectIncomeTab.columns = [
                        // com.hytera.serialNumber
                        {id:'serialNum',header: messService.getMess('com.hytera.serialNumber'), sort: 'string',width:50},
                        {id: 'check', header:{ content:"masterCheckbox" },template:custom_checkbox,},
                        {id:'description',header: messService.getMess('com.hytera.asset.AssetName'), sort: 'string'},
                        {id:'itemType',header: messService.getMess('资产型号'), sort: 'string'},
                        {id:'assetLargeClassName',header: messService.getMess('资产大类'), sort: 'string'},
                        {id:'assetSmallClassName',header: messService.getMess('资产小类'), sort: 'string'},
                        {id:'branch',header: messService.getMess('公司名称'), sort: 'string'},
                        {id:'price',header: messService.getMess('原始成本'), sort: 'string'},
                        {id:'startDate',header: messService.getMess('启动日期'), sort: 'string',format: webix.Date.dateToStr("%Y-%m-%d")},
                        {id:'keeper',header: messService.getMess('保管人'), sort: 'string'},
                        {id:'keeperId',header: messService.getMess('保管人ID'), sort: 'string'},
                        {id:'keeperEmployeeNum',header: messService.getMess('保管人工号'), sort: 'string'},
                        {id:'costDept',header: messService.getMess('使用部门'), sort: 'string'},
                        {id:'savePlace',header: messService.getMess('存放地点'), sort: 'string'},
                        {id:'assetStatus',header: messService.getMess('com.hytera.assetStateassets'), sort: 'string'},
                        {id:'supplierName',header: messService.getMess('com.hytera.si.VendorName'), sort: 'string'},
                    ];
                    renderWebixTab(_container, assectIncomeTab);
                }
                $scope.assetIncomeBtn = function(_assectIncomeData) {
                    BaseService._post({_service:'jdPurchaseMGTService', _method:'getAssetNum'}, _assectIncomeData, function(_data) {
                        console.log(_data);
                    })
                };
                function renderTab(_container) {
                    // var tabComponent = _.clone(component);
                    var tabComponent = $.extend(true, {}, component);
                    tabComponent.columns = [
                        {id:'serialNum',header: messService.getMess('com.hytera.serialNumber'), sort: 'string',width:50},
                        {id:'orderCode',header: messService.getMess('订单号'), sort: 'string'},
                        {id:'description',header: messService.getMess('申购物品名称'), sort: 'string'},
                        {id:'itemType',header: messService.getMess('规格型号'), sort: 'string', editor: 'popup'},
                        {id:'quantity',header: messService.getMess('数量'), sort: 'string'},
                        // {id:'unit',header: messService.getMess('单位'), sort: 'string'},
                        {id:'price',header: messService.getMess('实时单价'), sort: 'string'},
                        {id:'totalPrice',header: messService.getMess('申请总价'), sort: 'string'},
                        {id:'date',header: messService.getMess('期望到位时间'), sort: 'string', editor: 'date',format: webix.Date.dateToStr("%Y-%m-%d")},
                        {id:'keeper',header: messService.getMess('保管人'), sort: 'string'},
                        {id:'keeperId',header: messService.getMess('保管人ID'), sort: 'string'},
                        {id:'keeperEmployeeNum',header: messService.getMess('保管人工号'), sort: 'string'},
                        {id:'costDept',header: messService.getMess('费用挂靠部门'), sort: 'string'},
                        {id:'savePlace',header: messService.getMess('存放地点'), sort: 'string', editor: 'popup'},
                        {id:'applyReason',header: messService.getMess('申请事由'), sort: 'string', editor: 'popup'},
                        {id:'projectCode',header: messService.getMess('项目编码'), sort: 'string'}
                    ];
                    tabComponent.on.onItemDblClick = function(_id) {
                        var reg = /^(keeper|projectCode)$/;
                        if(reg.test(_id.column) && !$scope.isdisabled){
                            $scope.view = this;
                            $scope.columnId = _id;
                            $uibModal.open({
                                templateUrl : 'keeperDialog.html',
                                controller : ctrl,
                                size: 'lg',
                                resolve : {
                                    parent : function() {return $scope;},
                                }
                            });
                        }
                    };
                    tabComponent.ready = function() {
                        var self = this;
                        webix.ui({
                            id: 'cell-dropdown',
                            view: 'contextmenu',
                            css:'fix-webix-dropdown',
                            data:[{id: 'copy', value: messService.getMess('com.hytera.copyDown')}],
                            on:{
                                onItemClick:function(_id){
                                    var colId = this.getContext().id.column;
                                    var reg = /^(keeper)$/;
                                    if (reg.test(colId)) {
                                        var item = self.getItem(this.getContext().id);
                                        var tableItemList =  $$(componentId).getSelectedItem();
                                        _.each(tableItemList, function(_e, _i) {
                                            _e[colId] = item[colId];
                                            _e.keeperId = item.keeperId;
                                            _e.keeperEmployeeNum =item.keeperEmployeeNum;
                                        });
                                        self.refresh();
                                        $scope.bandData();
                                    } else {
                                        webix.message({type: 'error', text: messService.getMess('只能操作保管人')});
                                    }
                                }
                            }
                        }).attachTo(this);
                    };
                    renderWebixTab(_container, tabComponent);
                }
                var signForCtrl = ['$scope', '$uibModalInstance', 'toaster', 'parent', 'BaseService', function($scope, $uibModalInstance, toaster, parent, BaseService) {
                    $scope.dialogTitle = '确认签收';
                    $scope.jdOrderId = parent.item.jdOrderId;
                    $scope.dialogBody = '你签收的是 ' + $scope.jdOrderId + ' 订单，一旦确认无法修改状态。';
                    if (!parent.signState) {
                        $scope.dialogTitle = '确认未签收';
                        // $scope.orderCode = parent.item.jdOrderId;
                        $scope.dialogBody = '你未签收的是 ' + $scope.jdOrderId + ' 订单，一旦确认无法修改状态。';
                    }
                    $scope.ok = function () {
                        BaseService._post({_service:'jdConfirmOrderService', _method:'updateJDConfirmOrder'},
                        {jdOrderId: $scope.jdOrderId, signState: parent.signState},
                        function(_data) {
                            if (_data.message == 'success') {
                                parent.item.signState = parent.signState;
                            }
                        })
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }];
                // 保管人弹框和项目编码弹框；
                var ctrl = ['$scope', '$uibModalInstance', 'toaster', 'parent', 'BaseService', function ($scope, $uibModalInstance, toaster, parent, BaseService) {

                    var view = parent.view;
                    var id = parent.columnId;
                    var data = view.getItem(id);
                    if (id.column == 'keeper') {
                        $scope.method = 'selectList';
                        $scope.service = 'accountService';
                        $scope.columns = [
                            { field: 'userName', displayName: messService.getMess("com.hytera.userName"), width: 80 },
                            { field: 'realName', displayName: messService.getMess("com.hytera.fullName") },
                            { field: 'empNo', displayName: messService.getMess("com.hytera.jobNumber"), width: 100 },
                            { field: 'fullName', displayName: messService.getMess("com.hytera.fullName") },
                            { field: 'fullPath', displayName: messService.getMess("com.hytera.rip.Department"), cellTemplate: '<div ng-bind=\' row.getProperty("fullPath") \' style="line-height:30px;height:30px;" title=\' {{row.getProperty("fullPath") }}\'></div>' },
                            { field: 'email', displayName: messService.getMess("com.hytera.mailBox") },
                        ];
                    } else {
                        $scope.method = 'getProjectCode';
                        $scope.service = 'jdPurchaseMGTService';
                        $scope.columns = [
                            { field: 'DESCRIPTION', displayName: messService.getMess("描述") },
                            { field: 'FLEX_VALUE', displayName: messService.getMess("编码") }
                        ];
                    }
                    $scope.title = '选择用户';
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
                        $scope.myData = _data.dataList || _data.data;
                        $scope.totalServerItems = _data.total;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    };
                    $scope.getPagedDataAsync = function (_pageSize, _page, _searchText) {
                        setTimeout(function () {
                            BaseService._queryPage({
                                _service: $scope.service,
                                _method: $scope.method
                            }, {
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
                            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                        }
                    }, true);

                    $scope.gridOptions = {
                        data: 'myData', // myData 为 $scope.myData
                        enablePaging: true, // 是否分页
                        showFooter: true, // 是否展示列表脚部部分
                        multiSelect: false, // 是否多选
                        selectedItems: [], // 选择的行存放成一个数组
                        enableColumnResize: true, // 自由调整列宽度
                        totalServerItems: 'totalServerItems', // 数据条目总数
                        pagingOptions: $scope.pagingOptions, // 绑定分页
                        filterOptions: $scope.filterOptions, // 绑定搜索
                        columnDefs: $scope.columns
                    };
                    $scope.keeperDo = function(_item, _roleData) {
                        data[_item] = _roleData[0].userName;
                        data.keeper = _roleData[0].realName;
                        data.keeperEmployeeNum = _roleData[0].empNo;
                        data.keeperId = _roleData[0].userName;
                    };
                    $scope.projectCodeDo = function(_item, _roleData) {
                        data.DESCRIPTION = _roleData[0].DESCRIPTION;
                        data.projectCode = _roleData[0].FLEX_VALUE;
                    }
                    $scope.ok = function () {
                        if ($scope.gridOptions.selectedItems.length <= 0) { // 判断用户有没有选择条目
                            toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
                            return;
                        }
                        var item = id.column;
                        var roleData = $scope.gridOptions.selectedItems;
                        if (id.column == 'keeper') {
                            $scope.keeperDo(item, roleData);
                        } else {
                            $scope.projectCodeDo(item, roleData);
                        }
                        view.updateItem(id.row, data);
                        view.refresh();
                        $uibModalInstance.close();
                        // 数据绑定到表单
                        parent.bandData();
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }];
            });
        }],
        viewTemplate: 'formio/componentsView/jdList.html',
        icon: 'fa fa-search',
        views: [{
                name: 'Display',
                template: 'formio/components/jdList/display.html'
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
            }
        ],
        documentation: '',
        onEdit: ['$scope', function ($scope) {
            $scope.lookupTypes = [
                {name: 'applyList', title:'JD慧采申请'},
                {name: 'purchaseTab', title:'JD慧采采购指导'},
                {name: 'signForList', title:'JD慧采签收'},
                {name: 'assetIncome', title:'资产入库'},
            ];
        }]
    });
}]);


angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
    var promise = $http({
        method: 'GET',
        url: "admin/vendor/angular/ng-formio/plugins/jdList.html"
    });
    promise.then(function (resp) {
        $templateCache.put('formio/components/jdList.html', FormioUtils.fieldWrap(resp.data));
        $templateCache.put('formio/componentsView/jdList.html', FormioUtils.fieldWrap(resp.data));
    }, function (resp) {

    });
}]);

angular.module('ngFormBuilder').run(['$templateCache', function ($templateCache) {
    // Create the settings markup.
    $templateCache.put('formio/components/jdList/display.html',
        '<ng-form>' +
        '<form-builder-option property="label"></form-builder-option>' +
        '<div class="form-group">' +
		'<label for="lookupType" form-builder-tooltip="">{{\'Lookup Type\' | formioTranslate}}</label>' +
		'<select class="form-control" id="lookupType" name="lookupType" ng-options="type.name as type.title for type in lookupTypes" ng-model="component.lookupType"></select>' +
		'</div>' +
        '<form-builder-option property="customClass"></form-builder-option>' +
        '<form-builder-option property="customDisabled"></form-builder-option>' +
        '<form-builder-option property="tabindex"></form-builder-option>' +
        '</ng-form>');
}]);