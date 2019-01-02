
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('SelectDept', {
		title: 'Select Dept',
		template: 'formio/components/selectDept.html',
		settings: {
			input: true,
			tableView: true,
			label: '',
			key: 'SelectDept',
			placeholder: '',
			protected: false,
			persistent: true,
			clearOnHide: true,
			validate: {
				required: false,
				custom: ''
			}
		},
		controller: ['$scope', '$uibModal', '$localStorage', function ($scope, $uibModal, $localStorage) {
			if ($scope.builder) return;
			var lookupType = $scope.component.lookupType;
			//绑定组件的多选值
			var isMulti = $scope.component.isMulti || false;
			//绑定组件的默认值
			var isDefaultValue = $scope.component.isDefaultValue || false;
			var valueKey = $scope.component.valueKey;
			var ctrl = null;
			$scope.title = '';
			function scollDown() {
				// scoll-down
				var scollDownEle = document.querySelector('.scoll-down');
				setTimeout(function () {
					scollDownEle.scrollTop = scollDownEle.scrollHeight;
				}, 100);
			};
			switch (lookupType) {
				case 'employee':
					ctrl = ['$scope', '$uibModalInstance', 'BaseService', 'toaster', 'component', 'parent', 'messService', 'toaster', function ($scope, $uibModalInstance, BaseService, toaster, component, parentScope, messService, toaster) {
						$scope.title = '选择用户';
						$scope.lookupType = 'employee';
						$scope.query = { keywords: '' };
						$scope.page = 1;
						$scope.pageSize = 10;
						var setting = {
							view: {
								selectedMulti: false
							},
							async: {
								enable: false
							},
							callback: {
								beforeClick: zTreeOnClick,
								onExpand: onExpand
							},
							data: {
								key: {
									name: 'name',
									children: 'nodes'
								}
							},
							check: {
								enable: false,
								chkStyle: "checkbox",
								chkboxType: { "Y": "", "N": "" }
							}
						};

						function onExpand(event, treeId, treeNode) {
							BaseService._post({ _service: 'accountService', _method: 'queryUserByDepCode' }, { 'currentPage': $scope.page, 'showCount': $scope.pageSize, pd: { 'depCode': treeNode.depCode } }, function (_data) {
								$scope.list = _data.dataList;
							})
							//如果不是父节点，点击之后return；
							if (treeNode.isParent == false || treeNode.nodes.length > 0) {
								return;
							} else {
								//获取当前节点下子节点
								BaseService._postArray({ _service: 'odsDepMgrtService', _method: 'querySubODSTreeList' }, { 'departmentId': treeNode.departmentId }, function (_data) {
									//成功后重新刷新当前树节点
									$scope.zTree.addNodes(treeNode, _data[0].nodes);
									//刷新树节点
									$scope.zTree.updateNode(treeNode);

								})
							}
						}
						//节点点击事件
						function zTreeOnClick(treeId, treeNode) {
							BaseService._post({ _service: 'accountService', _method: 'queryUserByDepCode' }, { 'currentPage': $scope.page, 'showCount': $scope.pageSize, pd: { 'depCode': treeNode.depCode } }, function (_data) {
								$scope.list = _data.dataList;
							})
							//如果不是父节点，点击之后return；
							if (treeNode.isParent == false || treeNode.nodes.length > 0) {
								return;
							} else {
								//获取当前节点下子节点
								BaseService._postArray({ _service: 'odsDepMgrtService', _method: 'querySubODSTreeList' }, { 'departmentId': treeNode.departmentId }, function (_data) {
									//成功后重新刷新当前树节点
									$scope.zTree.addNodes(treeNode, _data[0].nodes);
									//刷新树节点
									$scope.zTree.updateNode(treeNode);

								})
							}

						}

						$(document).ready(function () {
							//获取树节点数据
							setTimeout(function () {
								BaseService._postArray({ _service: 'odsDepMgrtService', _method: 'querySubODSTreeList' }, { 'departmentId': '' }, function (_data) {
									//初始化树节点
									$.fn.zTree.init($("#treeDemo"), setting, _data);
									//绑定树
									$scope.zTree = $.fn.zTree.getZTreeObj("treeDemo");
									//展开树节点
									//$scope.zTree.expandAll(true);
								})
							}, 500)

						});
						$scope.targetList = [];
						if (parentScope.data[component.key + 'Data']) {
							//临时解决需求导入-评估需求选择处理人时出现undefined的问题 By lanhao 2018/5/23
							if(component.key == "RIPERHandledBy" && parentScope.data[component.key + 'Data'][0] && parentScope.data[component.key + 'Data'][0]['Attachment-0-1path']){
								parentScope.data[component.key + 'Data'].length = 0;
							}
							if(angular.isArray(parentScope.data[component.key + 'Data'])){
								$scope.targetList = parentScope.data[component.key + 'Data']
							}else{
								$scope.targetList = [parentScope.data[component.key + 'Data']]
							}
						}
						//单击添加
						$scope.addItem = function () {
							//找到选中的节点添加到targetList
							_.each($scope.list, function (_e) {
								if (_e.show && !_.find($scope.targetList, _e)) {
									$scope.targetList.push(_e);
								}
							});
							scollDown()
						};
						//双击添加
						$scope.addItemdb = function (item) {
							if (!_.find($scope.targetList, item)) {
								$scope.targetList.push(item);
							}
							scollDown()
						};
						//点击选中，改变背景颜色
						$scope.listItemClick = function (_item) {
							_item.show = !_item.show;
						}
						//点击删除选中
						$scope.delItemClick = function (_item) {
							_item.selected = !_item.selected;
						}
						//点击删除
						$scope.deleteItem = function () {
							// _.each($scope.list, function(_e) {
							// 	if(_e.selected) {
							// 		$scope.targetList = _.reject($scope.targetList, _e);
							// 	}
							// });
							_.each($scope.targetList, function (_e) {
								if (_e.selected) {
									$scope.targetList = _.reject($scope.targetList, _e);
								}
							});
						};
						//双击删除
						$scope.deleteItemdb = function (item) {
							$scope.targetList = _.reject($scope.targetList, item);
						};
						//搜索用户
						$scope.queryUser = function () {
							BaseService._post({ _service: 'accountService', _method: 'selectList' }, { 'currentPage': $scope.page, 'showCount': $scope.pageSize, pd: { filter: $scope.query.keywords } }, function (_data) {
								$scope.list = _data.dataList;
								$scope.pages = _data.pages;
							})
						};
						//上一页
						$scope.prePages = function () {
							if ($scope.page > 1) {
								$scope.page = $scope.page - 1;
								$scope.queryUser();
							} else {
								return;
							}
						};
						//下一页
						$scope.nextPages = function () {
							if ($scope.page < $scope.pages) {
								$scope.page = $scope.page + 1;
								$scope.queryUser();
							} else {
								return;
							}
						};
						//点击确定按钮
						$scope.ok = function () {
							//绑定组件data
							parentScope.data[component.key + 'Data'] = $scope.targetList;
							parentScope.data[component.key] = '';
							parentScope.data[component.key + 'Desc'] = '';
							parentScope.data[component.key + 'fullName'] = '';
							parentScope.data[component.key + 'Dept'] = '';
							if (isMulti) {
								//如果多选
								_.each($scope.targetList, function (_e, _i) {
									parentScope.data[component.key] += (_i > 0 ? ',' : '') + _e[valueKey];
									parentScope.data[component.key + 'Desc'] += (_i > 0 ? ',' : '') + _e.userName;
									parentScope.data[component.key + 'fullName'] += (_i > 0 ? ',' : '') + _e.fullName;
									parentScope.data[component.key + 'Dept'] += (_i > 0 ? ',' : '') + _e.fullPath;
								});
							} else {
								//判断是否选择一个
								if ($scope.targetList.length > 1) {
									toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOne'));
									return;
								}
								//如果是单选
								var selectItem = $scope.targetList[0];
								parentScope.data[component.key + 'Data'] = selectItem;
								parentScope.data[component.key] = selectItem[valueKey];
								parentScope.data[component.key + 'Desc'] = selectItem.userName;
								parentScope.data[component.key + 'fullName'] = selectItem.fullName;
								parentScope.data[component.key + 'Dept'] = selectItem.fullPath;
							}
							//关闭弹窗
							$uibModalInstance.close();
						};
						//点击取消按钮
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};
					}];
					break;
				case 'department':
					ctrl = ['$scope', '$uibModalInstance', 'BaseService', 'toaster', 'component', 'parent', 'messService', function ($scope, $uibModalInstance, BaseService, toaster, component, parentScope, messService) {
						$scope.title = '选择部门';
						$scope.lookupType = 'department';
						var setting = {
							view: {
								selectedMulti: false
							},
							async: {
								enable: false
							},
							callback: {
								beforeClick: zTreeOnClick,
								onExpand: onExpand
							},
							data: {
								key: {
									name: 'name',
									children: 'nodes'
								}
							},
							check: {
								enable: true,
								chkStyle: "checkbox",
								chkboxType: { "Y": "", "N": "" }
							}
						};

						function onExpand(event, treeId, treeNode) {
							//判断是否是父节点，如果不是点击不展开
							if (treeNode.isParent == false || treeNode.nodes.length > 0) {
								return;
							} else {
								BaseService._postArray({ _service: 'odsDepMgrtService', _method: 'querySubODSTreeList' }, { 'departmentId': treeNode.departmentId }, function (_data) {
									//成功后重新刷新当前树节点
									$scope.zTree.addNodes(treeNode, _data[0].nodes);
									$scope.zTree.updateNode(treeNode);
								})
							}
						}

						//节点点击事件
						function zTreeOnClick(treeId, treeNode) {
							//判断是否是父节点，如果不是点击不展开
							if (treeNode.isParent == false || treeNode.nodes.length > 0) {
								return;
							} else {
								BaseService._postArray({ _service: 'odsDepMgrtService', _method: 'querySubODSTreeList' }, { 'departmentId': treeNode.departmentId }, function (_data) {
									//成功后重新刷新当前树节点
									$scope.zTree.addNodes(treeNode, _data[0].nodes);
									$scope.zTree.updateNode(treeNode);
								})
							}
						}
						$(document).ready(function () {
							//获取树节点数据
							setTimeout(function () {
								BaseService._postArray({ _service: 'odsDepMgrtService', _method: 'querySubODSTreeList' }, { 'departmentId': '' }, function (_data) {
									//初始化树节点
									$.fn.zTree.init($("#treeDemo"), setting, _data);
									//绑定树
									$scope.zTree = $.fn.zTree.getZTreeObj("treeDemo");
									//$scope.zTree.expandAll(true);
								})
							}, 500)
						});
						//点击确定按钮
						$scope.ok = function () {
							//选中的节点
							$scope.selectItem = $scope.zTree.getChangeCheckedNodes();
							if (isMulti) {
								//如果是多选
								parentScope.data[component.key + 'Data'] = $scope.selectItem;
								parentScope.data[component.key] = '';
								parentScope.data[component.key + 'fullName'] = '';
								parentScope.data[component.key + 'Desc'] = '';
								_.each($scope.selectItem, function (_e, _i) {
									parentScope.data[component.key] += (_i > 0 ? ',' : '') + _e[valueKey];
									parentScope.data[component.key + 'Desc'] += (_i > 0 ? ',' : '') + _e.fullPath;
									parentScope.data[component.key + 'fullName'] += (_i > 0 ? ',' : '') + _e.fullPath;
									//parentScope.data[component.key + 'Dept'] += (_i>0?',':'') + _e.fullPath;
								});
							} else {
								if ($scope.selectItem.length > 1) {
									//如果没有选择节点，提示
									toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.onlySelectOneDept'));
									return;
								}
								//如果是单选
								var selectedItem = $scope.selectItem[0];
								parentScope.data[component.key] = selectedItem[valueKey];
								parentScope.data[component.key + 'Data'] = selectedItem;
								parentScope.data[component.key + 'fullName'] = selectedItem.fullPath;
								//parentScope.data[component.key + 'Dept'] = selectedItem.fullPath;
							}
							//关闭浮动层
							$uibModalInstance.close();
						};
						//点击取消按钮
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};

					}]
					break;
				default:
					ctrl = ['$scope', '$uibModalInstance', 'BaseService', 'toaster', 'component', 'parent', 'messService', function ($scope, $uibModalInstance, BaseService, toaster, component, parentScope, messService) {
						$scope.title = '选择部门';
						$scope.lookupType = 'common';
						var setting = {
							view: {
								selectedMulti: false
							},
							async: {
								enable: false
							},
							callback: {
								beforeClick: zTreeOnClick,
								onExpand: onExpand
							},
							data: {
								key: {
									name: 'name',
									children: 'nodes'
								}
							},
							check: {
								enable: false,
								chkStyle: "checkbox",
								chkboxType: { "Y": "", "N": "" }
							}
						};
						function getDeptList(_treeNode) {
							BaseService._postArray({ _service: 'odsDepMgrtService', _method: 'querySubODSTreeList' }, { 'departmentId': _treeNode.departmentId }, function (_data) {
								addHeader(_data);
								//成功后重新刷新当前树节点
								$scope.zTree.addNodes(_treeNode, _data[0].nodes);
								$scope.zTree.updateNode(_treeNode);
							})
						}
						function refreshTree(_treeNode) {
							addHeader(_treeNode);
							$scope.$apply()
						};
						function addHeader(_data) {
							var childrenHeader = {deptName: "子部门", header: 2};
							var parentHeader = {deptName: '父部门', header: 1};
							if (_.isArray(_data)) {
								if (_data[0].nodes) {
									$scope.list = JSON.parse(JSON.stringify(_data[0].nodes));
								} else {
									$scope.list = [].concat(JSON.parse(JSON.stringify(_data[0])));
								}
								var tempList = JSON.parse(JSON.stringify(_data[0]));
							} else {
								if (_data.nodes) {
								}
								$scope.list = JSON.parse(JSON.stringify(_data.nodes));
								var tempList = JSON.parse(JSON.stringify(_data));
							}
							$scope.list.unshift(childrenHeader);
							delete tempList.nodes;
							$scope.list.unshift(tempList);
							$scope.list.unshift(parentHeader);
							if (_.isArray(_data)) {
								if (!_data[0].nodes) {
									$scope.list.pop();
								}
							}
						}
						function onExpand(event, treeId, treeNode) {
							//判断是否是父节点，如果不是点击不展开
							if (treeNode.isParent == false || treeNode.nodes.length > 0) {
								// $scope.list = treeNode.nodes;
								refreshTree(treeNode)
							} else {
								getDeptList(treeNode)
							}
						}
						//节点点击事件
						function zTreeOnClick(treeId, treeNode) {
							$scope.parentDept = [];
							//判断是否是父节点，如果不是点击不展开
							if (treeNode.isParent == false || treeNode.nodes.length > 0) {
								refreshTree(treeNode)
							} else {
								getDeptList(treeNode)
							}
						}
						$(document).ready(function () {
							//获取树节点数据
							setTimeout(function () {
								BaseService._postArray({ _service: 'odsDepMgrtService', _method: 'querySubODSTreeList' }, { 'departmentId': '' }, function (_data) {
									$scope.list = _data;
									//初始化树节点
									$.fn.zTree.init($("#treeDemo"), setting, _data);
									fuzzySearch('treeDemo','#keyWord',null,true); //初始化模糊搜索方法
									//绑定树
									$scope.zTree = $.fn.zTree.getZTreeObj("treeDemo");
									//$scope.zTree.expandAll(true);
								})
							}, 500)
						});
						$scope.targetList = [];
						if (parentScope.data[component.key + 'Data']) {
							if(angular.isArray(parentScope.data[component.key + 'Data'])){
								$scope.targetList = parentScope.data[component.key + 'Data']
							}else{
								$scope.targetList = [parentScope.data[component.key + 'Data']]
							}
						};
						//单击添加
						$scope.addItem = function () {
							//找到选中的节点添加到targetList
							_.each($scope.list, function (_e) {
								if (_e.show && !checkRepetition($scope.targetList, _e)) {
									$scope.targetList.push(_e);
								}
							});
							scollDown()
						};
						function checkRepetition(_targetList, _item) {
							var flag = false;
							_.each(_targetList, function (_e, _i) {
								if (_e.depCode == _item.depCode) {
									flag = true
								}
							})
							return flag
						}
						//双击添加
						$scope.addItemdb = function (item) {
							if (!checkRepetition($scope.targetList, item)) {
								$scope.targetList.push(item);
							};
							scollDown();
						};
						//点击选中，改变背景颜色
						$scope.listItemClick = function (_item) {
							_item.show = !_item.show;
						}
						//点击删除选中
						$scope.delItemClick = function (_item) {
							_item.selected = !_item.selected;
						}
						//点击删除
						$scope.deleteItem = function () {
							_.each($scope.targetList, function (_e) {
								if (_e.selected) {
									$scope.targetList = _.reject($scope.targetList, _e);
								}
							});
						};
						//双击删除
						$scope.deleteItemdb = function (item) {
							$scope.targetList = _.reject($scope.targetList, item);
						};
						//点击确定按钮
						$scope.ok = function () {
							//绑定组件data
							parentScope.data[component.key + 'Data'] = $scope.targetList;
							parentScope.data[component.key] = '';
							parentScope.data[component.key + 'Desc'] = '';
							parentScope.data[component.key + 'fullName'] = '';
							parentScope.data[component.key + 'Dept'] = '';
							if (isMulti) {
								//如果多选
								_.each($scope.targetList, function (_e, _i) {
									parentScope.data[component.key] += (_i > 0 ? ',' : '') + _e[valueKey];
									parentScope.data[component.key + 'Desc'] += (_i > 0 ? ',' : '') + _e.fullPath;
									parentScope.data[component.key + 'fullName'] += (_i > 0 ? ',' : '') + _e.fullPath;
									parentScope.data[component.key + 'Dept'] += (_i > 0 ? ',' : '') + _e.fullPath;
								});
							} else {
								//判断是否选择一个
								if ($scope.targetList.length > 1) {
									toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.selectOne'));
									return;
								}
								//如果是单选
								var selectItem = $scope.targetList[0];
								parentScope.data[component.key + 'Data'] = selectItem;
								parentScope.data[component.key] = selectItem[valueKey];
								parentScope.data[component.key + 'Desc'] = selectItem.fullPath;
								parentScope.data[component.key + 'fullName'] = selectItem.fullPath;
								parentScope.data[component.key + 'Dept'] = selectItem.fullPath;
							}
							//关闭浮动层
							$uibModalInstance.close();
						};
						//点击取消按钮
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};

					}]
					break;
			}
			//点击事件打开modal层
			var onClick = function () {
				$uibModal.open({
					templateUrl: 'selectDeptDialog.html',
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
			//接受button的绑定事件
			$scope.$on('buttonClick', function (event, component, componentId) {
				if (componentId !== $scope.componentId) {
					return;
				}
				onClick();
			});

		}],
		viewTemplate: 'formio/componentsView/selectDept.html'
	});
}
]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
	var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/selectDept.html" });
	promise.then(function (resp) {
		$templateCache.put('formio/components/selectDept.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/selectDept.html', FormioUtils.fieldWrap(resp.data));
	}, function (resp) {

	});
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('SelectDept', {
		onEdit: ['$scope', function ($scope) {
			$scope.lookupTypes = [{ name: 'employee', title: '用户' }, { name: 'department', title: '部门' }, { name: 'common', title: '部门（可删除那种）' }];
			//$scope.lookupTypes = [ { name : 'employee', title : '用户' }];
			//$scope.valueKey = [ { name : 'userName', title : '用户名' }, { name : 'email', title : '邮箱'}];
		}],
		icon: 'fa fa-search',
		views: [
			{
				name: 'Display',
				template: 'formio/components/selectDept/display.html'
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
	$templateCache.put('formio/components/selectDept/display.html',
		'<ng-form>'
		+ '<form-builder-option property="label"></form-builder-option>'
		+ '<div class="form-group">'
		+ '<label for="lookupType" form-builder-tooltip="">{{\'Lookup Type\' | formioTranslate}}</label>'
		+ '<select class="form-control" id="lookupType" name="lookupType" ng-options="type.name as type.title for type in lookupTypes" ng-model="component.lookupType"></select>'
		+ '</div>'
		+ '<form-builder-option property="placeholder"></form-builder-option>'
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