//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' + "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('commonLookup', {
		title: 'Common Lookup',
		template: 'formio/components/commonLookup.html',
		settings: {
			input: true,
			tableView: true,
			label: '',
			key: 'commonLookup',
			placeholder: '',
			protected: false,
			persistent: true,
			clearOnHide: true,
			data: {
				columns:[],
				params: []
			},
			api:{
				_service: '',
				_method: '',
				_id: '',
				_pid: '',
				_cid: ''
			},
			validate: {
				required: false,
				custom: ''
			},
			btnText: '',
			showDetail: false
		},
		controller: ['$scope', '$timeout', '$uibModal', 'messService', '$localStorage', function ($scope, $timeout, $uibModal, messService, $localStorage) {
			if ($scope.builder) return;
			var isMulti = $scope.isMulti =  $scope.component.isMulti || false;
			// 是否勾选默认;
			var isDefaultValue = $scope.component.isDefaultValue || false;
			// 自定义关键字段，这里指的是从后台获取的数据中，你想从中获取的相关数据并返回给后台的相关字段;
			var valueKey = $scope.component.defaultCustomValue;
			// 默认值的数据处理
			var defaultValueOperation = $scope.component.defaultValueOperation;
			// 需要在组件input展示的字段
			var inputDisplayName = $scope.component.inputDisplay;
			var clearValue = $scope.component.clearValue;
			var ctrl = null;
			// 初始化dialog表格的列数
			var richselectColumns = [];
			if (_.isUndefined($scope.data) || _.isUndefined($scope.data[$scope.component.key])) {
				// 单选时供给ng渲染input框的
				$scope.fullName = [];
			} else {
				// 表单提交后，组件显示的数据
				try {
					if (!valueKey) {
						throw $scope.component.key + '关键值字段必填'
					}
					$scope.fullName = $scope.data[$scope.component.key + '_desc'].split(',');
				} catch (error) {
					console.log(error)
				}
			}
			if(isDefaultValue && (_.isUndefined($scope.data) || _.isUndefined($scope.data[$scope.component.key])) ) {
				// 组件勾选默认时的逻辑处理
				var selectedItem = $localStorage.user; 
				try {
					if (!valueKey) {
						throw $scope.component.key + '关键值字段必填'
					}
					if (!defaultValueOperation) {
						throw $scope.component.key + '默认值相关处理必须填写'
					}
					$scope.data[$scope.component.key] = selectedItem[valueKey];
					$scope.data[$scope.component.key + '_desc'] = $scope.$eval('(function(data){var value = "";'+ defaultValueOperation +';return value})($scope.data)')
				} catch (error) {
					console.log(error)
				}
				$scope.data[$scope.component.key + '_data'] = selectedItem;
			  }
			// 获取表单配置器中对dialog表格需要的列数处理并且国际化
			_.each($scope.component.data.columns, function(_e, _i) {
				var obj = {
					field: _e.id,
					displayName: messService.getMess(_e.label),
					width: _e.width
				}
				richselectColumns.push(obj)
			});
			var watchStr = 'data.'+ clearValue;
			if ($scope.component.isClearValue) {
				$scope.$watch(watchStr, function (_newVal, _oldVal) {
					if (_newVal != _oldVal && _newVal != '' && _oldVal != '') {
						$scope.data[$scope.component.key] = null;
						$scope.data[$scope.component.key + '_desc'] = null;
						$scope.data[$scope.component.key +'_data'] = null;
					}
				});
			}
			ctrl = ['$scope', '$uibModalInstance', 'toaster', 'component', 'parent', 'messService', 'BaseService', function ($scope, $uibModalInstance, toaster, component, parent, messService, BaseService) {
				// dialog标题
				$scope.title = messService.getMess(component.lookupTitle);
				$scope.lookupType = 'common';
				$scope.node = {};
				$scope.formConfigKey = parent.component.formConfigKey;
				$scope.showDetail = parent.component.showDetail;
				// 表单配置的key
				$scope.componentKey = parent.component.key;
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
					// 初始化ng-grid数据
					$scope.myData = [];
					_.each(_data.dataList, function(_e, _i) {
						// 数据去重，将已选的在dialog的ng-grid中剔除
						if (!checkRepetition(parent.data[component.key + '_data'], _e)) {
							$scope.myData.push(_e);
						}
					})
					$scope.totalServerItems = _data.total;
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				};
				function checkRepetition(_targetList, _item) {
					var flag = false;
					_.each(_targetList, function(_e, _i) {
						// 从表单配置器获取，以达到足够的灵活性
						if (_e[valueKey] == _item[valueKey]) {
							flag = true
						}
					})
					return flag
				}
				// 获取form 表单配置
				function getFormConfig(_formConfigKey) {
					BaseService._post(
						{_service: 'formMgrtService', _method: 'formConfigData'},
						{formConfigKey:_formConfigKey},
						function (_data) {
							$scope.node = _data;
						}
					)
				}
				// 监听表单其他字段，需要在表单配置器设置监听的字段
				function paramFn(_pageSize, _page, _searchText) {
					// 基础数据
					var obj = {
						currentPage: _page,
						showCount: _pageSize,
						pd: {
							filter: _searchText,
						}
					}
					// 将表单配置器设置好的字段推入obj.pd
					_.each(component.data.params, function(_e, _i) {
						obj['pd'][_e.id] = parent.data[_e.id]
					})
					return obj
				}
				$scope.getPagedDataAsync = function (_pageSize, _page, _searchText) {
					setTimeout(function () {
						var params = paramFn(_pageSize, _page, _searchText);
						BaseService._post(component.api, params, function (_data) {
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
				// ng-grid设置
				$scope.gridOptions = {
					data: 'myData',
					enablePaging: true,
					showFooter: true,
					multiSelect: isMulti,
					selectedItems: [],
					totalServerItems: 'totalServerItems',
					pagingOptions: $scope.pagingOptions,
					filterOptions: $scope.filterOptions,
					columnDefs: richselectColumns
				};
				// 展示详情
				if ($scope.showDetail) {
					try {
						if (!$scope.formConfigKey) {
							throw '组件如果勾选展示详情，formConfigKey为必填项';
						}
						getFormConfig($scope.formConfigKey);
					} catch (error) {
						console.warn(error)
					}
					$scope.gridOptions.rowTemplate = '<div ng-style=\'{ "cursor": "pointer" } \' ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}">' +
					'<div ng-cell ng-click="showTheDatail(row)">' +
					'</div>' + 
					'</div>'
					$scope.showTheDatail = function(_rowItem) {
						console.log(_rowItem)
					}
				}
				// 确定按钮
				$scope.ok = function () {
					if ($scope.gridOptions.selectedItems.length <= 0) {
						toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOneRecord'));
						return;
					};
					$uibModalInstance.close();
					if (isMulti) {
						// 多选
						parent.fullName = [];
						if (parent.data[component.key + '_desc']) {
							// 如果组件已有值，重置parent.fullName
							parent.fullName = parent.data[component.key + '_desc'].split(',')
						} else {
							// 必要数据的初始化
							parent.data[component.key + '_data'] = [];
							parent.data[component.key] = [];
							parent.data[component.key + '_desc'] = '';
						}
						try {
							if (!inputDisplayName) {
								// 检测表单配置器input框显示字段是否填写，并抛出相关错误信息
								throw  component.key +'组件inputDisplayName必填';
							}
							// 将选择的数据push到相关的字段中
							_.each($scope.gridOptions.selectedItems, function (_e, _i) {
								parent.data[component.key + '_data'].push(_e);
								parent.fullName.push(_e[inputDisplayName]);
								parent.data[component.key].push(_e[valueKey])
							});
						} catch (error) {
							console.log(error)
						}
						parent.data[component.key + '_desc']= parent.fullName.join(',');
					} else {
						// 单选
						var selectedItem = $scope.gridOptions.selectedItems[0];
						try {
							if (!inputDisplayName) {
								// 检测表单配置器input框显示字段是否填写，并抛出相关错误信息
								throw  component.key +'组件inputDisplayName必填';
							}
							parent.data[component.key + '_desc'] = selectedItem[inputDisplayName];
						} catch (error) {
							console.log(error)
						}
						parent.data[component.key + '_data'] = selectedItem;
						parent.data[component.key] = selectedItem[valueKey];
					}
				}
				// 取消按钮
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
			}]
			function onClick() {
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
				})
			};
			$scope.$on('buttonClick', function (event, component, componentId) {
				// Ensure the componentId's
				// match (even though they
				// always should).
				if (componentId !== $scope.componentId) {
					return;
				}
				onClick();
			});
			// 清空组件的值
			$scope.remove = function () {
				$scope.data[$scope.component.key +'_data'] = null;
				$scope.data[$scope.component.key +'_desc'] = null;
				$scope.data[$scope.component.key] = null;
				$scope.tempArry = [];
				$scope.fullName = [];
			}
			// 多选一个一个删除
			$scope.removeItem = function(itemId) {
				var descArry = $scope.data[$scope.component.key +'_desc'].split(',');
				$scope.data[$scope.component.key +'_data'].splice(itemId, 1);
				$scope.fullName.splice(itemId, 1);
				descArry.splice(itemId, 1);
				$scope.data[$scope.component.key].splice(itemId, 1);
				$scope.data[$scope.component.key +'_desc'] = descArry.join(',');
				if ($scope.data[$scope.component.key +'_data'].length == 0 || $scope.fullName.length == 0) {
					// 将组件的值清空，赋值为null，触发表单的校验功能;
					$scope.remove();
				}
			}
		}],
		viewTemplate: 'formio/componentsView/commonLookup.html'
	});
}
])
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
	var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/commonLookup.html" });
	promise.then(function (resp) {
		$templateCache.put('formio/components/commonLookup.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/commonLookup.html', FormioUtils.fieldWrap(resp.data));
	}, function (resp) {

	});
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('commonLookup', {
		onEdit: ['$scope', function ($scope) {
			
		}],
		icon: 'fa fa-tumblr',
		views: [
			{
				name: 'Display',
				template: 'formio/components/commonLookup/display.html'
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
	$templateCache.put('formio/components/commonLookup/display.html',
		'<ng-form>' +
		'<form-builder-option property="label"></form-builder-option>' +
		'<div class="form-group">' +
		'<label for="lookupTitle">弹出框标题</label>' +
		'<input class="form-control" id="lookupTitle" type="text" name="lookupTitle" ng-model="component.lookupTitle">' +
		'<div class="form-group">' +
		'<label for="isMulti" form-builder-tooltip="">{{\'Multi Select\' | formioTranslate}}</label>' +
		'<input type="checkbox" class="form-control" id="isMulti" name="isMulti" ng-model="component.isMulti">' + 
		'</div>' +
		'<div class="form-group">' +
		'<label for="isDefaultValue" form-builder-tooltip="">{{\'Default Value\' | formioTranslate}}</label>' +
		'<input type="checkbox" class="form-control" id="isDefaultValue" name="isDefaultValue" ng-model="component.isDefaultValue">' + 
		'<label for="defaultCustomValue" form-builder-tooltip="">关键值字段</label>' +
		'<input type="text" class="form-control" name="defaultCustomValue" id="defaultCustomValue" ng-model="component.defaultCustomValue">' +
		'<label for="defaultValueOperation" form-builder-tooltip="">默认值相关处理</label>' +
		'<textarea class="form-control" rows="5" name="defaultValueOperation" id="defaultValueOperation" ng-model="component.defaultValueOperation" placeholder="/*** Example Code And Explain ***/ \n value = \' xxx \' "></textarea>' +
		'</div>' +
		'<div class="form-group">' +
		'<label for="input-display" form-builder-tooltip="">{{\'需要在输入框显示的字段\' | formioTranslate}}</label>' +
		'<input type="text" class="form-control" name="input-display" id="input-display" ng-model="component.inputDisplay">' +
		'</div>' +
		'<div class="form-group">' +
		'<label>后台API设置</label>' +
		'<table class="table table-condensed">' +
		'<tr>' +
		'<td class="col-xs-6"><input type="text" class="form-control" ng-model="component.api._service" placeholder=":_service"></td>' +
		'<td class="col-xs-6"><input type="text" class="form-control" ng-model="component.api._method" placeholder=":_method"></td>' +
		'</tr>' +
		'<tr>' +
		'<td class="col-xs-6"><input type="text" class="form-control" ng-model="component.api._id" placeholder=":_id"></td>' +
		'<td class="col-xs-6"><input type="text" class="form-control" ng-model="component.api._pid" placeholder=":_pid"></td>' +
		'</tr>' +
		'<tr>' +
		'<td class="col-xs-6"><input type="text" class="form-control" ng-model="component.api._cid" placeholder=":_cid"></td>' +
		'</tr>' +
		'</table>' +
		'</div>' +
		'<columns-config data="component.data.columns" label="lookup中ng-grid的列配置" value-label="列的ID" label-label="列名，支持国际化" width-label="width"></columns-config>' +
		'<columns-config data="component.data.params" label="监听表单中的字段" value-label="ID" label-label="不需要填写" width-label="不需要填写"></columns-config>' +
		'<div class="form-group">' +
		'<label for="isClearValue" form-builder-tooltip="">是否根据联动清空值</label>' +
		'<input type="checkbox" ng-model="component.isClearValue" id="isClearValue" class="form-control">' +
		'<label ng-if="component.isClearValue" for="clearValue" form-builder-tooltip="">请填写监听的字段</label>' +
		'<input type="text" ng-model="component.clearValue" class="form-control" ng-if="component.isClearValue" id="clearValue">' +
		'</div>' +
		'<div>' +
		'<label for="showDetail" form-builder-tooltip="">是否展示待选的详情</label>' +
		'<input type="checkbox" ng-model="component.showDetail" id="showDetail" class="form-control">' +
		'<div ng-if="component.showDetail">' +
		'<label for="formConfigKey" form-builder-tooltip="">填写详情的表单号</label>' +
		'<input type="text" ng-model="component.formConfigKey" id="formConfigKey" class="form-control" required>' +
		'</div>' +
		'</div>' +
		'<div class="form-group">' +
		'<label for="btnText" form-builder-tooltip="">按钮文字(支持国际化,使用默认样式则不需填写)</label>' +
		'<input type="text" ng-model="component.btnText" class="form-control" id="btnText">' +
		'</div>' +
		'<form-builder-option property="disabled"></form-builder-option>' +
		'<form-builder-option property="customClass"></form-builder-option>' +
		'<form-builder-option property="tabindex"></form-builder-option>' +
		'<form-builder-option property="clearOnHide"></form-builder-option>' +
		'</ng-form>');
}])
.directive('columnsConfig', [function () {
	return {
		scope: {
			data: '=',
			label: '@',
			tooltipText: '@',
			valueLabel: '@',
			labelLabel: '@',
			widthLabel: '@',
			valueProperty: '@',
			labelProperty: '@',
			widthProperty: '@'
		},
		restrict: 'E',
		template: '<div class="form-group">' +
			'<label form-builder-tooltip="{{ tooltipText | formioTranslate }}">{{ label | formioTranslate }}</label>' +
			'<table class="table table-condensed">' +
			'<thead>' +
			'<tr>' +
			'<th class="col-xs-4">{{ labelLabel | formioTranslate }}</th>' +
			'<th class="col-xs-3">{{ valueLabel | formioTranslate }}</th>' +
			'<th class="col-xs-3">{{ widthLabel | formioTranslate }}</th>' +
			'<th class="col-xs-2"></th>' +
			'</tr>' +
			'</thead>' +
			'<tbody>' +
			'<tr ng-repeat="v in data track by $index">' +
			// 标识
			'<td class="col-xs-4"><input type="text" class="form-control" ng-model="v[labelProperty]" placeholder="{{ labelLabel | formioTranslate }}"/></td>' +
			'<td class="col-xs-3"><input type="text" class="form-control" ng-model="v[valueProperty]" placeholder="{{ valueLabel | formioTranslate }}"/></td>' +
			'<td class="col-xs-3"><input type="text" class="form-control" ng-model="v[widthProperty]" placeholder="{{ widthLabel | formioTranslate }}"/></td>' +
			'<td class="col-xs-2"><button type="button" class="btn btn-danger btn-xs" ng-click="removeValue($index)" tabindex="-1"><span class="fa-times-circle-o"></span></button></td>'+
			'</tr>' +
			'</tbody>' +
			'</table>'+
			'<button type="button" class="btn" ng-click="addValue()">{{ \'Add Value\' | formioTranslate }}</button>' + +
			'</div>',
		replace: true,
		link: function ($scope, el, attrs) {
			$scope.valueProperty = $scope.valueProperty || 'id';
			$scope.labelProperty = $scope.labelProperty || 'label';
			$scope.widthProperty = $scope.widthProperty || 'width';
			$scope.valueLabel = $scope.valueLabel || '列的ID'; // 可修改成其他的placeholder
			$scope.labelLabel = $scope.labelLabel || '列名，支持国际化';
			$scope.widthLabel = $scope.widthLabel || 'width';

			$scope.addValue = function () {
				var obj = {};
				obj[$scope.valueProperty] = '';
				obj[$scope.labelProperty] = '';
				obj[$scope.widthProperty] = '';
				$scope.data.push(obj);
			};

			$scope.removeValue = function (index) {
				$scope.data.splice(index, 1);
			};

			if ($scope.data.length === 0) {
				$scope.addValue();
			}
		}
	};
}])

