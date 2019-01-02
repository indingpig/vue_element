angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
    formioComponentsProvider.register('AssetNumber', {
        title: 'Asset Number',
        template: 'formio/components/AssetNumber.html',
        settings: {
            input: true,
            tableView: true,
            label: '',
            key: 'AssetNumber',
            placeholder: '',
            protected: false,
            persistent: true,
            clearOnHide: true,
            validate: {
                required: false,
                custom: ''
            }
        },
        controller: ['$scope', '$uibModal', 'BaseService', 'toaster', 'messService', '$localStorage', function($scope, $uibModal, BaseService, toaster, messService, $localStorage) {
            if ($scope.builder) return;
            var valueKey = $scope.component.valueKey;
            var isDefaultValue = $scope.component.isDefaultValue || false;	
            if(isDefaultValue && !$scope.data[$scope.component.key + 'Desc'] ) {
				var selectedItem = JSON.parse(sessionStorage.getItem('AssetNumber_data'));
				if(selectedItem == null){
					$scope.data[$scope.component.key + '_data'] = '';
				}else{
					$scope.data[$scope.component.key] = selectedItem[valueKey];
					$scope.data[$scope.component.key + '_data'] = selectedItem;
					$scope.data[$scope.component.key + 'Desc'] = selectedItem.assetNo;
				}
            }
            var ctrl = null;
            var onClick = function() {
					//打开浮动层
					$uibModal.open({						
	    				templateUrl: 'assetDialog.html',
	    				controller: ctrl,
	    				size: 'lg',
	    				resolve: {
	    					component: function() {
	    						return $scope.component;
	    					},
	    					parent: function() { return $scope; }
	    				}
	    			});
				};
				ctrl = ['$scope', '$uibModalInstance', '$localStorage', 'BaseService', 'toaster', 'component', 'parent', 'messService', function ($scope, $uibModalInstance, $localStorage, BaseService, toaster, component, parent, messService) {
					  $scope.title = '请选择资产编号';
					  $scope.filterOptions = {
						  filterText: "",
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
							  //instrumentMGTService/queryInstrumentByAssetNo
							  BaseService._post({_service:'instrumentMGTService', _method: 'queryInstrumentSearchList' }, {
								  currentPage: _page,
								  showCount: _pageSize,
								  pd: {
									  filter: _searchText,
									  assetUseStatus: '0'
								  }
							  }, function (_data) {
								  $scope.setPagingData(_data);
							  });
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

					  $scope.gridOptions = {
						  data: 'myData',
						  enablePaging: true,
						  showFooter: true,
						  multiSelect: false,
						  selectedItems: [],
						  totalServerItems: 'totalServerItems',
						  pagingOptions: $scope.pagingOptions,
						  filterOptions: $scope.filterOptions,
						  columnDefs: [
							  //{ field: 'id', displayName: 'ID' },
							  { field: 'assetNo', displayName: '资产编号' },
							  { field: 'assetName', displayName: '资产名称' },
							  { field: 'itsDept', displayName: '所属部门' }
						  ]
					  };


					  $scope.ok = function () {
						  if ($scope.gridOptions.selectedItems.length <= 0) {
							  toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
							  return;
						  }
						  var selectedItem = $scope.gridOptions.selectedItems[0];
						  parent.data[component.key] = selectedItem[valueKey];
						  parent.data[component.key + 'Desc'] = selectedItem.assetNo;
						  parent.data[component.key + '_data'] = selectedItem;
						  $uibModalInstance.close();
					  };
					  $scope.cancel = function () {
						  $uibModalInstance.dismiss('cancel');
					  };
				  }];           

          //接收button的buttonClick事件
            $scope.$on('buttonClick', function(event, component, componentId) {
                if (componentId !== $scope.componentId) {
                    return;
                }
                //调用事件
                onClick();
            });

        }],
        viewTemplate: 'formio/componentsView/AssetNumber.html'
    });
}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/AssetNumber.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/AssetNumber.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/AssetNumber.html', FormioUtils.fieldWrap(resp.data));
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config([ 'formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('AssetNumber', {
		onEdit : [ '$scope', function($scope) {} ],
		icon : 'fa fa-list-ol',
		views : [
				{
					name : 'Display',
					template : 'formio/components/AssetNumber/display.html'
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
					name : 'API',
					template : 'formio/components/common/api.html'
				},
				{
					name : 'Layout',
					template : 'formio/components/common/layout.html'
				},
				{
					name : 'Conditional',
					template : 'formio/components/common/conditional.html'
				} ],
		documentation : ''
	});
} ]);
angular.module('ngFormBuilder').run(['$templateCache', function($templateCache) {
	// Create the settings markup.
	$templateCache.put('formio/components/AssetNumber/display.html',
			'<ng-form>' +
	        '<form-builder-option property="label"></form-builder-option>' +
	        '<form-builder-option property="defaultValue"></form-builder-option>' +
	        '<form-builder-option property="placeholder"></form-builder-option>' +
	        '<form-builder-option property="description"></form-builder-option>' +
	        '<form-builder-option property="customClass"></form-builder-option>' +
	        '<form-builder-option property="tabindex"></form-builder-option>' +
	        '<form-builder-option property="clearOnHide"></form-builder-option>' +
	        '<form-builder-option property="protected"></form-builder-option>' +
	        '<form-builder-option property="persistent"></form-builder-option>' +
	        '<form-builder-option property="disabled"></form-builder-option>' +
	        /*'<div class="form-group">'
			+ '<label for="isMulti" form-builder-tooltip="">{{\'Multi Select\' | formioTranslate}}</label>'
			+ '<input type="checkbox" class="form-control" id="isMulti" name="isMulti" ng-model="component.isMulti"></input>' 
			+ '</div>'+*/
	        //modify y18407 
	        '<div class="form-group">'
			+ '<label for="isDefaultValue" form-builder-tooltip="">{{\'Default Value\' | formioTranslate}}</label>'
			+ '<input type="checkbox" class="form-control" id="isDefaultValue" name="isDefaultValue" ng-model="component.isDefaultValue"></input>' 
			+ '</div>'+
	        '<form-builder-option property="customDisabled"></form-builder-option>' +
	        //end
	        '<form-builder-option property="tableView"></form-builder-option>' +
	        '</ng-form>');
} ]);