
angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('typedLookup', {
	    title: 'Typed Lookup',
	    template: 'formio/components/typedLookup.html',
	    settings: {
	          input: true,
	          tableView: true,
	          label: '',
	          key: 'typedLookup',
	          placeholder: '',
	          protected: false,
	          persistent: true,
	          clearOnHide: true,
	          validate: {
	            required: false,
	            custom: ''
	          }
	        },
	    controller: ['$scope', '$uibModal', function($scope, $uibModal) {
	      if ($scope.builder) return;
	      var restURL = $scope.component.restURL;
          $scope.onTyped = function() {
        	  $.ajax({type:'GET',async:false, url: restURL + '/' + $scope.data[$scope.component.key], success: function(_data){
        		  if(!!_data) {
        			  $scope.data[$scope.component.key+'_data'] = _data;
        		  } else {
        			  $scope.data[$scope.component.key+'_data'] = {};
        		  }
    	      }});
          };

        }],
        viewTemplate: 'formio/componentsView/typedLookup.html'
      });
    }
  ]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/typedLookup.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/typedLookup.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/typedLookup.html', FormioUtils.fieldWrap(resp.data));
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config([ 'formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('typedLookup', {
		onEdit : [ '$scope', function($scope) {}],
		icon : 'fa fa-pencil-square-o',
		views : [
				{
					name : 'Display',
					template : 'formio/components/typedLookup/display.html'
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
	$templateCache.put('formio/components/typedLookup/display.html',
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