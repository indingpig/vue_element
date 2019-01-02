
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('webixSelect', {
		title: 'webix Rickselect',
		template: 'formio/components/webixSelect.html',
		settings: {
			input: true,
			tableView: true,
			label: '',
			key: 'webixSelectField',
			placeholder: '',
			protected: false,
			persistent: true,
			clearOnHide: true,
			data: {
				columns:[]
			},
			validate: {
				required: false,
				custom: ''
			}
		},
		controller: ['$scope', '$uibModal', '$localStorage', 'messService', 'BaseService', '$timeout', function ($scope, $uibModal, $localStorage, messService, BaseService, $timeout) {
			if ($scope.builder) return;
			
            var key = $scope.component.key;
            var URl = $scope.component.url;
			var richselectColumns = [];
			_.each($scope.component.data.columns, function(_e, _i) {
				var obj = {
					id: _e.value,
					header: messService.getMess(_e.label),
					width: _e.width
				}
				richselectColumns.push(obj)
			})
			var code = $scope.component.richSelectConfig
			var webixSelectDefaultValue = null;
			
            webix.ready(function() {
                $.ajax({
                    type: 'GET',
                    url: URl,
                    cache: false,
					processData: false,
					async: true
                }).success(function(_data) {
					var options = [];
					var options =  eval('(function(data){var values = [];'+ code.toString() +'; return values})(_data)');
					// var options =  $scope.$eval('(function(data){var values = [];'+ code.toString() +'; return values})(_data)');
					// var options =  $parse('(function(data){var values = [];'+ code.toString() +'; return values})(_data)');
					// expect(element(by.binding('1+2')).getText()).toEqual('1+2=3');
                    $timeout(function() {
						if ($scope.data[$scope.componentId]) {
							webixSelectDefaultValue = $scope.data[$scope.componentId].id;
						} else {
							$scope.data[$scope.componentId] = null;
						}
						webixRichSelectFn(webixSelectDefaultValue, richselectColumns, options);
						$$($scope.componentId).refresh();
                        $('#'+ $scope.componentId +'_placeholder').css('display','none');
                    }, 200)
                });
                
			});

			function webixRichSelectFn(_defaultVal, _columns, _options) {
				webix.ui({
					view: 'richselect',
					container: $scope.componentId,
					id: $scope.componentId,
					value: _defaultVal,
					disabled: $scope.isdisabled,
					suggest: {
						view: 'gridsuggest',
						body: {
							data: _options,
							tooltip: true,
							columns: _columns,
						},
					},
					on:{
						onChange: function(_newVal, _oldVal) {
							var self = this
							$scope.$apply(function() {
								if (_newVal == '' || null) {
									$scope.data[$scope.componentId] = null;
								} else {
									$scope.data[$scope.componentId] = self.getList().getItem(_newVal);
								}
							})
						},
					},
				});
			};
		}],
		viewTemplate: 'formio/componentsView/webixSelect.html'
	});
}])
.directive('webixRichSelect', [function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        scope: {
            disabled: '=',
            isdisabled: '='
        },
        link: function(scope, elm, attrs) {
            scope.$parent.$parent.isdisabled = scope.disabled
        }
    }
}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
	var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/webix-select.html" });
	promise.then(function (resp) {
		$templateCache.put('formio/components/webixSelect.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/webixSelect.html', FormioUtils.fieldWrap(resp.data));
	}, function (resp) {

	});
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('webixSelect', {
		onEdit: ['$scope', function ($scope) {
		}],
		icon: 'fa fa-search',
		views: [
			{
				name: 'Display',
				template: 'formio/components/webixSelect/display.html'
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
	$templateCache.put('formio/components/webixSelect/display.html',
		'<ng-form>'
		+ '<form-builder-option property="label"></form-builder-option>'
		+ '<div class="form-group">'
		+ '<label for="url">{{\'URL\' | formioTranslate}}</label>'
		+ '<input type="text" ng-model="component.url" class="form-control" id="url">'
        + '</div>'
		+ '<detest data="component.data.columns" label="下拉框配置"></detest>'
		+ '<div class="form-group">'
		+ '<label for="" form-builder-tooltip="id字段不可删除，richselect靠id来获取每行的id，但id对应的value可根据后台数据做相应的修改；其他的键必须跟上面下拉框配置的列ID相对应，否则渲染失败 ">{{\'下拉框请求数据处理\' | formioTranslate}}</label>'
		+ '<textarea class="form-control" ng-model="component.richSelectConfig" rows="6" placeholder="/*** Example Code And Explain ***/ \n id: _e.itemKey, \n value: _e.itemValue, \n itemDesc: _e.itemDesc"></textarea>'
		+ '</div>'
		+ '<form-builder-option property="customClass"></form-builder-option>'
		+ '<form-builder-option property="disabled"></form-builder-option>'
		+ '<form-builder-option property="customDisabled"></form-builder-option>'
		+ '<form-builder-option property="tabindex"></form-builder-option>'
		+ '</ng-form>');
}])
	.directive('detest', [function () {
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
				'<td class="col-xs-3"><input type="number" class="form-control" ng-model="v[widthProperty]" placeholder="{{ widthLabel | formioTranslate }}"/></td>' +
				'<td class="col-xs-2"><button type="button" class="btn btn-danger btn-xs" ng-click="removeValue($index)" tabindex="-1"><span class="fa-times-circle-o"></span></button></td>' +
				'</tr>' +
				'</tbody>' +
				'</table>' +
				'<button type="button" class="btn" ng-click="addValue()">{{ \'Add Value\' | formioTranslate }}</button>' +
				'</div>',
			replace: true,
			link: function ($scope, el, attrs) {
				$scope.valueProperty = $scope.valueProperty || 'value';
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
