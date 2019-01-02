angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('toThousand', {
        title: 'ToThousand',
        template: 'formio/components/toThousand.html',
        settings: {
            input: true,
            tableView: true,
            label: '',
            key: 'toThousand',
            placeholder: '',
            protected: false,
            persistent: true,
            clearOnHide: true,
            validate: {
                required: false,
                custom: ''
            }
        },
        controller: ['$scope', '$uibModal', '$localStorage', 'LookUpMgrtService', 'BaseService', function ($scope, $uibModal, $localStorage, LookUpMgrtService, BaseService) {
            if ($scope.builder) { return };
            var user = $scope.data.proposerName;
            var component = $scope.component.key;
            //数字，千分位分隔
            $scope.toThousand = function() {
                var toThousandstr = toThousand($scope.data[component]);
                $scope.data[component] = toThousandstr.replace(/^\d+/g, function(m) { 
                   return m.replace(/(?=(?!^)(\d{3})+$)/g, ',')
                });
                
            }

            function toThousand(numStr) {
                // 去掉获取数字中的逗号,小数超过两位四舍五入
                var toThousandstr = parseFloat(numStr.replace(/,/g, ''));
                // 为了避免js对浮点数计算出现问题，先对数字进行换算
                // 小数点的位数
                // var floatLength = toThousandstr.split(".")[1].length;
                // var num = "1"
                // for (var i = 0; i < floatLength; i++) {
                //     num += "0"
                // }
                // var toThousandnum = ((toThousandstr * num) / num).toFixed(2);
                var toThousandnum = toThousandstr.toFixed(2);
                return toThousandnum
            }
        }],
        viewTemplate: 'formio/componentsView/toThousand.html'
    });

}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
    var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/toThousand.html" });
    promise.then(function (resp) {
        $templateCache.put('formio/components/toThousand.html', FormioUtils.fieldWrap(resp.data));
        $templateCache.put('formio/componentsView/toThousand.html', FormioUtils.fieldWrap(resp.data));
    }, function (resp) {

    });
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('toThousand', {
        icon: 'fa fa-yen',
        views: [
            {
                name: 'Display',
                template: 'formio/components/toThousand/display.html'
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
    $templateCache.put('formio/components/toThousand/display.html',
        '<ng-form>'
        + '<form-builder-option property="label"></form-builder-option>'
        + '<form-builder-option property="placeholder"></form-builder-option>'
        + '<form-builder-option property="description"></form-builder-option>'
        + '<form-builder-option property="customClass"></form-builder-option>'
        + '<form-builder-option property="customDisabled"></form-builder-option>'
        + '<form-builder-option property="tabindex"></form-builder-option>'
        + '</ng-form>');
}]);