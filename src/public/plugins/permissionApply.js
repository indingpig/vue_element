
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('permissionApply', {
		title: 'Permission Apply',
		template: 'formio/components/permissionApply.html',
		settings: {
			input: true,
			tableView: true,
			label: '',
			key: 'PermissionApplyField',
			placeholder: '',
			protected: false,
			persistent: true,
			clearOnHide: true,
			validate: {
				required: false,
				custom: ''
			}
		},
		controller: ['$scope', '$uibModal', '$localStorage', 'messService', 'BaseService', function ($scope, $uibModal, $localStorage, messService, BaseService) {
			if ($scope.builder) return;
			var container = $scope.component.key;
			var webixCode = $scope.component.webixCode
			setTimeout(function() {
				webix.ready(function(){
					$scope.$eval(webixCode);
					$('#placeholder').css('display','none')
				});
			},200)

			$scope.permissionData = [
				{ id:1, title:"The Shawshank Redemption", cat_id:"Thriller", votes:678790, rating:9.2, rank:1},
				{ id:2, title:"The Godfather", cat_id:"Crime", votes:511495, rating:9.2, rank:2}
			];
		}],
		viewTemplate: 'formio/componentsView/permissionApply.html'
	});
}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
	var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/permissionApply.html" });
	promise.then(function (resp) {
		$templateCache.put('formio/components/permissionApply.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/permissionApply.html', FormioUtils.fieldWrap(resp.data));
	}, function (resp) {

	});
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('permissionApply', {
		onEdit: ['$scope', function ($scope) {

		}],
		icon: 'fa fa-search',
		views: [
			{
				name: 'Display',
				template: 'formio/components/permissionApply/display.html'
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
	$templateCache.put('formio/components/permissionApply/display.html',
		'<ng-form>' + 
		'<form-builder-option property="label"></form-builder-option>' + 
		'<div class="form-group">' +
		// + '<div class="form-group">'
		// + '<label for="webix-id" form-builder-tooltip="webix渲染容器ID要与API相同">{{\'webix渲染容器ID\' | formioTranslate}}</label>'
		// + '<input type="text" class="form-control" id="webix-id" name="webix-id" ng-model="component">'
		// + '</div>'
		// + '<div class="form-group">'
		// + '<label for="isMulti" form-builder-tooltip="">{{\'Multi Select\' | formioTranslate}}</label>'
		// + '<input type="checkbox" class="form-control" id="isMulti" name="isMulti" ng-model="component.isMulti"></input>'
		// + '</div>'
		// + '<div class="form-group">'
		// + '<label for="isDefaultValue" form-builder-tooltip="">{{\'Default Value\' | formioTranslate}}</label>'
		// + '<input type="checkbox" class="form-control" id="isDefaultValue" name="isDefaultValue" ng-model="component.isDefaultValue"></input>'
		// + '</div>'+ 
		'<div class="form-group">' +
		'<label for="webix-code">{{\'webix\' | formioTranslate}}</label>' +
		'<textarea class="form-control" ng-model="component.webixCode" id="webix-code" rows="10" placeholder="/*** Example Code ***/\n There is no code.\n Think aboat it by yourself. \n Maybe you need this: https://docs.webix.com/"></textarea>' +
		'</div>' +
		'<form-builder-option property="customClass"></form-builder-option>' +
		'<form-builder-option property="customDisabled"></form-builder-option>' +
		'<form-builder-option property="tabindex"></form-builder-option>' +
		'</ng-form>');
}]);
