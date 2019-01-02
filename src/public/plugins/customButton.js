angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('customButton', {
        title: 'Costom Button',
        template: 'formio/components/customButton.html',
        settings: {
            label: 'Submit',
            size: 'md',
            leftIcon: '',
            rightIcon: '',
            block: false,
            action: 'submit',
            disableOnInvalid: false,
            theme: 'primary',
            input: true,
            tableView: true,
            key: 'Costom Button',
        },
        controller: ['$scope', function ($scope) {
            if ($scope.builder) return;
            var settings = $scope.component;
            $scope.ts = true;
            var customClick = $scope.component.customEvent;
            $scope.customClick = function () {
                eval('(function(data) {' + customClick + ';})($scope.data)');
            };
            $scope.customDisabled = function (settings, data) { 
                if (settings.customDisabled) {
                    return eval('(function(data) { var disabled = false;' + settings.customDisabled.toString() + ';return disabled})($scope.data)')
                }
                return false;
             }
            // $scope.getButtonType = function () {
            //     switch (settings.action) {
            //         case 'submit':
            //             return 'submit';
            //         case 'reset':
            //             return 'reset';
            //         case 'event':
            //             return 'button'
            //         case 'oauth':
            //         default:
            //             return 'button';
            //     }
            // };
            $scope.resetForm = function() {
                // Manually remove each key so we don't lose a reference to original
                // data in child scopes.
                for (var key in $scope.data) {
                  delete $scope.data[key];
                }
              };
            var onClick = function () {
                switch (settings.action) {
                    case 'submit':
                        return;
                    case 'event':
                        // modify by sheldon
                        // 修改点击事件 
                        // $scope.$emit($scope.component.event, $scope.data);
                        $scope.customClick();
                        // modify end
                        break;
                    case 'reset':
                        $scope.resetForm();
                        break;
                    case 'oauth':
                        if (!settings.oauth) {
                            $scope.showAlerts({
                                type: 'danger',
                                message: 'You must assign this button to an OAuth action before it will work.'
                            });
                            break;
                        }
                        if (settings.oauth.error) {
                            $scope.showAlerts({
                                type: 'danger',
                                message: settings.oauth.error
                            });
                            break;
                        }
                        $scope.openOAuth(settings.oauth);
                        break;
                };
            };

            $scope.$on('buttonClick', function (event, component, componentId) {
                // Ensure the componentId's match (even though they always should).
                if (componentId !== $scope.componentId) {
                    return;
                }
                onClick();
            });
        }],
        viewTemplate: 'formio/componentsView/customButton.html'
    });
}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
    var promise = $http({
        method: 'GET',
        url: "admin/vendor/angular/ng-formio/plugins/customButton.html"
    });
    promise.then(function (resp) {
        $templateCache.put('formio/components/customButton.html', resp.data);
        $templateCache.put('formio/componentsView/customButton.html', resp.data);
    }, function (resp) {

    });
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
    formioComponentsProvider.register('customButton', {
        onEdit: ['$scope', function ($scope) {
            var FORM_OPTIONS = {
                actions: [
                  {name: 'submit',title: 'Submit'},
                  {name: 'event',title: 'Event'},
                  {name: 'reset',title: 'Reset'},
                  {name: 'oauth',title: 'OAuth'}
                ],
                themes: [
                  {name: 'default',title: 'Default'},
                  {name: 'primary', title: 'Primary'},
                  {name: 'info',title: 'Info'},
                  {name: 'success',title: 'Success'},
                  {name: 'danger',title: 'Danger'},
                  {name: 'warning',title: 'Warning'}
                ],
                sizes: [
                  {name: 'xs',title: 'Extra Small'},
                  {name: 'sm',title: 'Small'},
                  {name: 'md',title: 'Medium'},
                  {name: 'lg',title: 'Large'}
                ]
              };
            $scope.actions = FORM_OPTIONS.actions;
            $scope.sizes = FORM_OPTIONS.sizes;
            $scope.themes = FORM_OPTIONS.themes;
        }],
        icon: 'fa fa-tumblr',
        views: [{
                name: 'Display',
                template: 'formio/components/customButton/display.html'
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
            }
        ],
        documentation: ''
    });
}]);
angular.module('ngFormBuilder').run(['$templateCache', function ($templateCache) {
    // Create the settings markup.
    $templateCache.put('formio/components/customButton/display.html',
        '<ng-form>' +
        '<form-builder-option property="label"></form-builder-option>' +
        // '<div class="form-group">' +
        // '<label for="action" form-builder-tooltip="This is the action to be performed by this button.">{{\'Action\' | formioTranslate}}</label>' +
        // '<select class="form-control" id="action" name="action" ng-options="action.name as action.title for action in actions" ng-model="component.action"></select>' +
        // '</div>' +
        // '<div class="form-group" ng-if="component.action === \'event\'">' +
        '<div class="form-group">' +
        '  <label for="event" form-builder-tooltip="The event to fire when the button is clicked.">{{\'Button Event\' | formioTranslate}}</label>' +
        '<textarea class="form-control" id="event" name="event" ng-model="component.customEvent" rows="10" placeholder="/*** Example Code ***/\n function test(){alert(123)} \n test()"></textarea>' +
        // modify end
        '</div>' +
        '<div class="form-group">' +
        '<label for="theme" form-builder-tooltip="The color theme of this panel.">{{\'Theme\' | formioTranslate}}</label>' +
        '<select class="form-control" id="theme" name="theme" ng-options="theme.name as theme.title for theme in themes" ng-model="component.theme"></select>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="size" form-builder-tooltip="The size of this button.">{{\'Size\' | formioTranslate}}</label>' +
        '<select class="form-control" id="size" name="size" ng-options="size.name as size.title for size in sizes" ng-model="component.size"></select>' +
        '</div>' +
        '<form-builder-option property="leftIcon"></form-builder-option>' +
        '<form-builder-option property="rightIcon"></form-builder-option>' +
        '<form-builder-option property="customClass"></form-builder-option>' +
        '<form-builder-option property="tabindex"></form-builder-option>' +
        '<form-builder-option property="block"></form-builder-option>' +
        '<form-builder-option property="customDisabled" placeholder="/*** Example Code ***/\n disabled = true "></form-builder-option>' +
        '<form-builder-option property="disableOnInvalid"></form-builder-option>' +
    '</ng-form>');
}]);
