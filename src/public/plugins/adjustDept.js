
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('adjustDept', {
		title: 'AdjustDept',
		template: 'formio/components/adjustDept.html',
		settings: {
			input: true,
			tableView: true,
			label: '',
			key: 'adjustDeptField',
			placeholder: '',
			protected: false,
			persistent: true,
			clearOnHide: true,
			validate: {
				required: false,
				custom: ''
			}
		},
		controller: ['$scope', '$uibModal', '$localStorage', 'messService', function ($scope, $uibModal, $localStorage, messService) {
			if ($scope.builder) return;
			var lookupType = $scope.component.lookupType;
			var isMulti = $scope.component.isMulti || false; //是否多选
			var isDefaultValue = $scope.component.isDefaultValue || false;
			var valueKey = $scope.component.valueKey;
			var ctrl = null;
			$scope.deptId ='';
			if (isDefaultValue && (_.isUndefined($scope.data) || _.isUndefined($scope.data[$scope.component.key]))) {
				// var selectedItem = $localStorage.user;
				// $scope.data[$scope.component.key] = selectedItem[valueKey];
				// $scope.data[$scope.component.key + '_desc'] = selectedItem.fullName;
				// $scope.data[$scope.component.key + '_data'] = selectedItem;
			}
			$scope.isDisabled = function (component) {

			};
			if(!!$scope.data[$scope.component.key + 'Dept']){
				$scope.adjustedDepts = $scope.data[$scope.component.key + 'Dept']
			}
			$scope.gridOptions = {
				data: 'adjustedDepts',
				// enablePaging: true,
				showFooter: false,
				multiSelect: false,
				selectedItems: [],
				totalServerItems: 'totalServerItems',
				plugins: [new ngGridFlexibleHeightPlugin()],
				// pagingOptions: $scope.pagingOptions,
				// filterOptions: $scope.filterOptions,
				columnDefs: [
					{ field: 'departmentName', displayName: messService.getMess('com.hytera.branchName')},
					{ field: 'departmentUsName', displayName: messService.getMess('com.hytera.branchNameUs')},
					{ field:'op', displayName:messService.getMess("com.hytera.operation"), cellTemplate:'<button class="icon-notebox btn btn-sm btn-info" style="margin-top:2px" ng-click="view(row)" type="button">{{"com.hytera.org.ViewComparisonStrucutre" | mess}}</button>'}
				]
			}


			$scope.title = '';

			ctrl = ['$scope', '$uibModalInstance', 'toaster', 'component', 'parent', 'messService', 'BaseService', function ($scope, $uibModalInstance, toaster, component, parent, messService, BaseService) {
				$scope.title = '选择已调整部门';
				$scope.lookupType = 'afterAjust';
				$scope.TreeData = {};
				$scope.filterOptions = {
					filterText: "",
					useExternalFilter: true
				};
				// 获取语言;
				$scope.language = localStorage.getItem('language');
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
						BaseService._post({ _method: 'queryOrganizationList', _service: 'orgOperService' }, {
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

				//ng-grid 设置和渲染
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
						{ field: 'departmentName', displayName: messService.getMess('com.hytera.branchName')},
						{ field: 'departmentUsName', displayName: messService.getMess('com.hytera.branchNameUs')}
					]
				}

				//点击OK按钮；
				$scope.ok = function() {
					if ($scope.gridOptions.selectedItems.length <= 0) {
						toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
						return;
					}
					parent.adjustedDepts = $scope.gridOptions.selectedItems;
					parent.data[component.key + 'Dept'] = $scope.gridOptions.selectedItems;
					//改变部门的id名单
					parent.data[component.key + 'DeptIdList'] = [];
					parent.data[component.key + '_desc'] = '';
					var selectedBranchId = [];
					_.each($scope.gridOptions.selectedItems, function(val, index){
						parent.data[component.key + '_desc'] += (index > 0 ? ', ': '') + val.departmentName;
						parent.data[component.key + 'DeptIdList'].push(val.departmentId);
						selectedBranchId.push({departmentId: val.departmentId});
					});

					
					parent.data[component.key + 'data'] = {};
					BaseService._post({ _service: 'orgOperService', _method: 'depTree' }, selectedBranchId, function(_data){
						parent.data[component.key + 'data'].orgdata = _data.data;
					});
					BaseService._post({ _service: 'odsDepMgrtService', _method: 'depTree' }, selectedBranchId, function(_data){
						parent.data[component.key + 'data'].odsdata = _data.data;
					});
					
					$uibModalInstance.close();

				}
				// $scope.removeItem = function (i) {
				// 	$scope.gridOptions.selectedItems.splice(i,1)
				// 	$scope.$apply()
				// }
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
			}]
			;
			var orgTree = ['$scope', '$uibModalInstance', 'toaster', 'parentNode', 'messService', 'BaseService', 'row','component', function ($scope, $uibModalInstance, toaster, parentNode, messService, BaseService, row, component) {
				$scope.show = 'adjust';
				$scope.title = messService.getMess('com.hytera.OrganizationChart'); //Organization Chart				
				$scope.afterAdjust = messService.getMess('com.hytera.org.AdjustedOrganizationStructure');
				$scope.beforeAdjust = messService.getMess('com.hytera.org.OriginalOrganizationStructure');
				var treeData = JSON.parse(JSON.stringify(parentNode.data[component.key + 'data']));
				$scope.orgData = [];
				$scope.odsData = []
				//org
				if (treeData.orgdata) {
					var orgIndex = _.findIndex(treeData.orgdata, function (_data) { return _data.departmentId == row.departmentId });
					$scope.orgData.push(treeData.orgdata[orgIndex]);
				}
				//ods
				if (treeData.odsdata) {
					var odsIndex = _.findIndex(treeData.odsdata, function (_data) { return _data.departmentId == row.departmentId });
					$scope.odsData.push(treeData.odsdata[odsIndex]);
				}
				
				$scope.close = function () {
					$uibModalInstance.dismiss('cancel');
				};
				
			}]

			var onClick = function () {
				$uibModal.open({
					templateUrl: 'adjustDeptlog.html',
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

			$scope.view = function (_id){
				$uibModal.open({
					templateUrl: 'orgImg.html',
					controller: orgTree,
					size: 'lg',
					resolve: {
						row : function (){ return _id.entity},
						component: function () {
							return $scope.component;
						},
						parentNode: function () { return $scope; },
					}
				});
			}

			$scope.$on('buttonClick', function (event, component, componentId) {

				if (componentId !== $scope.componentId) {
					return;
				}
				onClick();
			});

		}],
		viewTemplate: 'formio/componentsView/adjustDept.html'
	});
}])
.directive('adjustDepts', ['messService', '$uibModal','BaseService', function(messService, $uibModal, BaseService){
	return {
		replace: true,
		restrict: 'EAC',
		ngModel:'?',
		scope: {
			orgData: "=",
			odsData: "=",
		},
		link: function(scope, elm, attrs){
			var width = 0;
			webix.ready(function(){
				function replaceValue(node) {
					var children = node.data;
					node.value = node.departmentName;
					if (node.departmentStatus == '1') {
						node.$css = {background: "#ff0a08", "border-color": "#ff0a08", color: "#fff"}
					}
					if (children && children.length) {
						_.each(children, function(_e) {
							replaceValue(_e)
						})
					}
				}
				function replaceValueUs(node) {
					var children = node.data;
					node.value = node.departmentUsName;
					if (node.departmentStatus == '1') {
						node.$css = {background: "#ff0a08", "border-color": "#ff0a08", color: "#fff"}
					}
					if (children && children.length) {
						_.each(children, function(_e) {
							replaceValueUs(_e)
						})
					}
				}
				if (localStorage.getItem('language') == 'zh-CN') {
					// 使用递归遍历数据
					_.each(scope.orgData, function(_e) {
						replaceValue(_e);
					})
					_.each(scope.odsData, function(_e) {
						replaceValue(_e);
					})
					width = 60;
				} else {
					// 使用递归遍历数据
					_.each(scope.orgData, function(_e) {
						replaceValueUs(_e);
					})
					_.each(scope.odsData, function(_e) {
						replaceValueUs(_e);
					})
					width = 110;
				}
				var orgTree = new webix.ui({
					view: "organogram",		//渲染的格式
					container: "orgtree",	//渲染区的容器
					id: "orgtree",			//必须，与渲染的容器的id相对应
					// autoheight: true,
					// autowidth: true,
					select: true,
					data: scope.orgData,
					type: {
						width: width,
						// autoheight: true,
						autowidth: true,
					},
				});
				var odsTree = new webix.ui({
					view: "organogram",		//渲染的格式
					container: "odsTree",	//渲染区的容器
					id: "odsTree",			//必须，与渲染的容器的id相对应
					// autoheight: true,
					// autowidth: true,
					select: true,
					data: scope.odsData,
					type: {
						width: width,
						// autoheight: true,
						autowidth: true,
					},
				});
			})
			
		}
	}
}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
	var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/adjustDept.html" });
	promise.then(function (resp) {
		$templateCache.put('formio/components/adjustDept.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/adjustDept.html', FormioUtils.fieldWrap(resp.data));
	}, function (resp) {

	});
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('adjustDept', {
		onEdit: ['$scope', function ($scope) {
			$scope.lookupTypes = [ {name: 'adjustDept', title: '选择已调整的部门'}];
			// $scope.valueKey = [ { name : 'userName', title : '用户名' }, { name : 'email', title : '邮箱'}];
		}],
		icon: 'fa fa-search',
		views: [
			{
				name: 'Display',
				template: 'formio/components/adjustDept/display.html'
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
	$templateCache.put('formio/components/adjustDept/display.html',
		'<ng-form>'
		+ '<form-builder-option property="label"></form-builder-option>'
		+ '<div class="form-group">'
		+ '<label for="lookupType" form-builder-tooltip="">{{\'Lookup Type\' | formioTranslate}}</label>'
		+ '<select class="form-control" id="lookupType" name="lookupType" ng-options="type.name as type.title for type in lookupTypes" ng-model="component.lookupType"></select>'
		+ '</div>'
		// + '<div class="form-group">'
		// + '<label for="Key" form-builder-tooltip="">{{\'Key\' | formioTranslate}}</label>'
		// + '<select class="form-control" id="Key" name="Key" ng-options="type.name as type.title for type in valueKey" ng-model="component.valueKey"></select>' 
		// + '</div>'
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
