
angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('translation', {
	    title: 'Translation',
	    template: 'formio/components/translation.html',
	    settings: {
	          input: true,
	          tableView: true,
	          label: '',
	          key: 'translation',
	          placeholder: '',
	          protected: false,
	          persistent: true,
	          clearOnHide: true,
	          validate: {
	            required: false,
	            custom: ''
	          }
	        },
	    controller: ['$scope', '$uibModal','$sce', function($scope, $uibModal, $sce) {
	      if ($scope.builder) return;
				

				
				$scope.$watch('data', function(){
					$scope.data.subjectContentTemp = $sce.trustAsHtml($scope.data.subjectContent);
					$scope.data.checkedSubjecThemeTemp = $sce.trustAsHtml($scope.data.checkedSubjecTheme);
					$scope.data.checkedSubjectContentTemp = $sce.trustAsHtml($scope.data.checkedSubjectContent);
				})

        }],
        viewTemplate: 'formio/componentsView/translation.html'
      });
    }
  ]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/translation.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/translation.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/translation.html', FormioUtils.fieldWrap(resp.data));
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config([ 'formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('translation', {
		onEdit : [ '$scope', function($scope) {}],
		icon : 'fa fa-pencil-square-o',
		views : [
				{
					name : 'Display',
					template : 'formio/components/translation/display.html'
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
	$templateCache.put('formio/components/translation/display.html',
		'<ng-form>'
			+ '<form-builder-option property="label"></form-builder-option>'
			+ '<div class="form-group">'
			+ '<label for="restURL" form-builder-tooltip="">{{\'REST URL\' | formioTranslate}}</label>'
			+ '<input type=\"text\" class="form-control" id="restURL" name="restURL" ng-model="component.restURL"></input>' 
			+ '</div>'
			+ '<form-builder-option property="customClass"></form-builder-option>'
			+ '<form-builder-option property="tabindex"></form-builder-option>'
			+ '</ng-form>');
} ]);