
angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('ItPrivilegedCountdataGrid', {
	    title: 'It Privileged Count DataGrid',
	    template: 'formio/components/ItPrivilegedCountdataGrid.html',
	    settings: {
	          input: true,
	          tableView: true,
	          label: '',
	          key: 'dataGridField',
	          placeholder: '',
	          protected: false,
	          persistent: true,
	          clearOnHide: true,
	          validate: {
	            required: false,
	            custom: ''
	          }
	        },
	    controller: ['$scope', 'BaseService', 'LookUpMgrtService', function($scope, BaseService, LookUpMgrtService) {
			if ($scope.builder) return;
			var component = $scope.component.key;
			if (!$scope.data[component]) {
				$scope.data[component] = [{}];
			}
            $scope.addRow = function () {
                $scope.data[component].push({});
            }
            $scope.removeRow = function (_i) {
                $scope.data[component].splice(_i, 1);
                $scope.systemRoleCode.splice(_i, 1)
            }
            
            // systemCode options 
            LookUpMgrtService._getArray({_method: 'getLookUpItemByKL', _id: 'systemCode'}, function(_data) {
                $scope.systemCode = _data;
            })
            // 联动
            $scope.systemRoleCode = [];
            $scope.getSystemRoleCode = function (_code, i) {
                var systemRole = JSON.parse(sessionStorage.getItem('dataCache')).systemRoleCode;
                $scope.systemRoleCode[i] = [];
                $scope.data[component][i].systemRoleCode = {};
                _.each(systemRole, function (_e, _i, _list) {
                    var roleKey = _e.itemKey;
                    if (roleKey.indexOf(_code + '_') == 0) {
                        $scope.systemRoleCode[i].push(_e);
                    }
                });
            }
        }],
        viewTemplate: 'formio/componentsView/ItPrivilegedCountdataGrid.html'
      });
    }
  ]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/ItPrivilegedCountdataGrid.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/ItPrivilegedCountdataGrid.html', resp.data);
		$templateCache.put('formio/componentsView/ItPrivilegedCountdataGrid.html', resp.data);
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config([ 'formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('ItPrivilegedCountdataGrid', {
		onEdit : [ '$scope', function($scope) {
				} ],
		icon : 'fa fa-tumblr',
		views : [
				{
					name : 'Display',
					template : 'formio/components/ItPrivilegedCountdataGrid/display.html'
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
	$templateCache.put('formio/components/ItPrivilegedCountdataGrid/display.html',
		'<ng-form>'
			+ '<form-builder-option property="label"></form-builder-option>'
			+ '<form-builder-option property="customClass"></form-builder-option>'
			+ '<form-builder-option property="tabindex"></form-builder-option>'
			+ '</ng-form>');
} ]);