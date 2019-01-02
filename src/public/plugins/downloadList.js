
angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('downloadList', {
	    title: 'Download List',
	    template: 'formio/components/downloadList.html',
	    settings: {
	          input: true,
	          tableView: true,
	          label: '',
	          key: 'downloadList',
	          placeholder: '',
	          protected: false,
	          persistent: true,
	          clearOnHide: true,
	          validate: {
	            required: false,
	            custom: ''
	          }
	        },
	    controller: ['$scope', 'messService', function($scope, messService) {
						if ($scope.builder) return;
						var key = $scope.component.key;
						$scope.fileList = $scope.data[key];
						// $scope.fileList = [
						// 	{ name: 'google', link: 'https://www.google.com'},
						// 	{ name: 'facebook', link: 'https://www.facebook.com'},
						// 	{ name: 'ITHome', link: 'https://www.ithome.com'},
						// ]
          }],
        viewTemplate: 'formio/componentsView/downloadList.html'
      });
    }
  ]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/downloadList.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/downloadList.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/downloadList.html', FormioUtils.fieldWrap(resp.data));
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config([ 'formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('downloadList', {
		onEdit : [ '$scope', function($scope) {
				} ],
		icon : 'fa fa-tumblr',
		views : [
				{
					name : 'Display',
					template : 'formio/components/eidtor/display.html'
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
	$templateCache.put('formio/components/eidtor/display.html',
		'<ng-form>'
			+ '<form-builder-option property="label"></form-builder-option>'
			+ '<form-builder-option property="customClass"></form-builder-option>'
			+ '<form-builder-option property="tabindex"></form-builder-option>'
			+ '</ng-form>');
} ]);