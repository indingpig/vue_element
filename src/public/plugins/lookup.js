
angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('lookup', {
	    title: 'Lookup',
	    template: 'formio/components/lookup.html',
	    settings: {
	          input: true,
	          tableView: true,
	          label: '',
	          key: 'lookupField',
	          placeholder: '',
	          protected: false,
	          persistent: true,
	          clearOnHide: true,
	          validate: {
	            required: false,
	            custom: ''
	          }
	        },
	    controller: ['$scope', '$uibModal', '$localStorage',function($scope, $uibModal, $localStorage) {
	      if ($scope.builder) return;
//	      $scope.data = {};
//	      $scope.data[$scope.component.key] = '';
//	      $scope.data[$scope.component.key + '_desc'] = '';
//	      $scope.data[$scope.component.key + '_data'] = {};
	      var lookupType = $scope.component.lookupType;
	      var isMulti = $scope.component.isMulti || false;
	      var isDefaultValue = $scope.component.isDefaultValue || false;	       
	      var valueKey = $scope.component.valueKey;
	      var ctrl = null;
	      
	      if(isDefaultValue && (_.isUndefined($scope.data) || _.isUndefined($scope.data[$scope.component.key])) ) {
				var selectedItem = $localStorage.user;
				$scope.data[$scope.component.key] = selectedItem[valueKey];
				$scope.data[$scope.component.key + '_desc'] = selectedItem.fullName;
				$scope.data[$scope.component.key + '_data'] = selectedItem;
	      }
	    //   $scope.isDisabled = function(component) {
	    	  
	    //   };
	      $scope.title = '';
		  switch (lookupType) {
				case 'employee':
				  ctrl = ['$scope', '$uibModalInstance', '$localStorage', 'UserService', 'toaster', 'component', 'parent', 'messService', function ($scope, $uibModalInstance, $localStorage, UserService, toaster, component, parent, messService) {
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
						  multiSelect: isMulti,
						  selectedItems: [],
						  totalServerItems: 'totalServerItems',
						  pagingOptions: $scope.pagingOptions,
						  filterOptions: $scope.filterOptions,
						  columnDefs: [
							  //{ field: 'id', displayName: 'ID' },
							  { field: 'userName', displayName: messService.getMess("com.hytera.userName") },
							  { field: 'realName', displayName: messService.getMess("com.hytera.fullName") },
							  { field: 'empNo', displayName: messService.getMess("com.hytera.jobNumber") },
							  { field: 'email', displayName: messService.getMess("com.hytera.mailBox") },
							  { field: 'telephone', displayName: messService.getMess("com.hytera.phoneNumber") },
							  { field: 'officePhone', displayName: messService.getMess("com.hytera.landlineNumber") },
						  ]
					  };


					  $scope.ok = function () {
						  if ($scope.gridOptions.selectedItems.length <= 0) {
							  toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
							  return;
						  }
						  $uibModalInstance.close();
						  if (isMulti) {
							  parent.data[component.key + '_data'] = $scope.gridOptions.selectedItems;
							  parent.data[component.key] = '';
							  parent.data[component.key + '_desc'] = '';
							  _.each($scope.gridOptions.selectedItems, function (_e, _i) {
								  parent.data[component.key] += (_i > 0 ? ',' : '') + _e[valueKey];
								  parent.data[component.key + '_desc'] += (_i > 0 ? ',' : '') + _e.fullName;
							  });
						  } else {
							  var selectedItem = $scope.gridOptions.selectedItems[0];
							  parent.data[component.key] = selectedItem[valueKey];
							  parent.data[component.key + '_desc'] = selectedItem.fullName;
							  parent.data[component.key + 'Tel'] = selectedItem.telephone;
							  parent.data[component.key + '_data'] = selectedItem;
						  }

					  };
					  $scope.cancel = function () {
						  $uibModalInstance.dismiss('cancel');
					  };
				  }];
				break;
			  	case 'department':
					ctrl = ['$scope', '$uibModalInstance', 'DepartmentService', 'toaster', 'component', 'parent', 'messService', function ($scope, $uibModalInstance, DepartmentService, toaster, component, parentScope, messService) {
						$scope.title = '选择部门';
						$scope.lookupType = 'department';
						$scope.dept_tree = [];
						$scope.tree = {};
						$scope.doing_async = true;
						DepartmentService._get({
							_id: '0',
							_method: 'depTree'
						}, function (_data) {
							$scope.dept_tree.push(format(_data));
							$scope.doing_async = false;
						});

						function format(_obj, _node) {
							if (_obj.nodes.length > 0) {
								var parent = {
									label: _obj.zhName,
									data: { id: _obj.id, parentId: _obj.parentId, fullPath: _obj.fullPath },
									children: []
								}
								_obj.nodes = _.reject(_obj.nodes, function (_n) { return _n.id == parentScope.id; });
								_.each(_obj.nodes, function (_element, _index, _list) {
									var child = format(_element, parent);
									parent.children.push(child);
								});
								return parent;
							} else {
								return {
									label: _obj.zhName,
									data: { id: _obj.id, parentId: _obj.parentId, fullPath: _obj.fullPath },
									children: []
								}
							}
						}

						$scope.selectedNode = null;
						$scope.dept_tree_select = function (_node) {
							$scope.selectedNode = _node;
						};

						$scope.ok = function () {
							if ($scope.selectedNode == null) {
								toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneDept'));
								return;
							}
							parentScope.data[component.key] = $scope.selectedNode.data.id;
							parentScope.data[component.key + '_desc'] = $scope.selectedNode.data.fullPath;
							parentScope.data[component.key + '_data'] = $scope.selectedNode.data;
							$uibModalInstance.close();
						};
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};
					}]
				break;
		  }
          var onClick = function() {
        	  $uibModal.open({
      			templateUrl : 'lookupDialog.html',
      			controller : ctrl,
      			size: 'lg',
      			resolve : {
      				component : function() {
      					return $scope.component;
      				},
      				parent : function() {return $scope;}
      			}
      		});
          };

          $scope.$on('buttonClick', function(event, component, componentId) {
            // Ensure the componentId's
			// match (even though they
			// always should).
            if (componentId !== $scope.componentId) {
              return;
            }
            onClick();
          });

        }],
        viewTemplate: 'formio/componentsView/lookup.html'
      });
    }
  ]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/lookup.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/lookup.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/lookup.html', FormioUtils.fieldWrap(resp.data));
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config([ 'formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('lookup', {
		onEdit : [ '$scope', function($scope) {
//			$scope.lookupTypes = [ { name : 'employee', title : '用户' }, { name : 'department', title : '部门'}];
			$scope.lookupTypes = [ { name : 'employee', title : '用户' } ];
			$scope.valueKey = [ { name : 'userName', title : '用户名' }, { name : 'email', title : '邮箱'}];
				} ],
		icon : 'fa fa-search',
		views : [
				{
					name : 'Display',
					template : 'formio/components/lookup/display.html'
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
	$templateCache.put('formio/components/lookup/display.html',
		'<ng-form>'
			+ '<form-builder-option property="label"></form-builder-option>'
			+ '<div class="form-group">'
			+ '<label for="lookupType" form-builder-tooltip="">{{\'Lookup Type\' | formioTranslate}}</label>'
			+ '<select class="form-control" id="lookupType" name="lookupType" ng-options="type.name as type.title for type in lookupTypes" ng-model="component.lookupType"></select>' 
			+ '</div>'
			+ '<div class="form-group">'
			+ '<label for="Key" form-builder-tooltip="">{{\'Key\' | formioTranslate}}</label>'
			+ '<select class="form-control" id="Key" name="Key" ng-options="type.name as type.title for type in valueKey" ng-model="component.valueKey"></select>' 
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
} ]);