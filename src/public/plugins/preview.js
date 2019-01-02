
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('preview', {
		title: 'preview',
		template: 'formio/components/preview.html',
		settings: {
			input: true,
			tableView: true,
			label: '',
			key: 'previewField',
			placeholder: '',
			protected: false,
			persistent: true,
			clearOnHide: true,
			validate: {
				required: false,
				custom: ''
			}
		},
		controller: ['$scope', '$timeout', '$sce', function ($scope, $timeout, $sce) {
			if ($scope.builder) return;
			var key = $scope.component.key;
			var timer,timer2;
			var editorWatch = $scope.component.watch;
			

			eval(editorWatch)
			
			
			// 月份转中文格式
			function CNDateString(date) {
				var cn = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
				var s = [];
				var YY = date.getFullYear().toString();
				for (var i = 0; i < YY.length; i++) {
					if (cn[YY.charAt(i)]) {
						s.push(cn[YY.charAt(i)]);
					} else {
						s.push(YY.charAt(i));
					}
				}
				s.push("年");
				var MM = date.getMonth() + 1;
				if (MM < 10) {
					s.push(cn[MM]);
				}else if (MM < 20) {
					s.push("十" + cn[MM % 10]);
				}
				s.push("月");
				var DD = date.getDate();
				if (DD < 10) {
					s.push(cn[DD]);
				} else if (DD < 20) {
					s.push("十" + cn[DD % 10]);
				} else if (DD == 20) {
					s.push("二十");
				} else if (DD > 20 && DD < 30) {
					s.push("二十" + cn[DD % 10]);
				} else if (DD == 30) {
					s.push("三十");
				} else {
					s.push("三十" + cn[DD % 10]);
				}
				s.push("日");
				return s.join('');
			}
			function ENDateString(date) {
				var s = [];
				var en = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				var MM = date.getMonth();
				s.push(en[MM]);
				s.push(' ');
				var DD = date.getDate();
				s.push(DD);
				s.push(',');
				s.push(' ')
				var YY = date.getFullYear();
				s.push(YY);
				return s.join('')
			}
			function dateToStr(date) {
				return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
			}
			
		}],
		viewTemplate: 'formio/componentsView/preview.html'
	});
}
])
	// .directive('disableStatus', [function () {
	// 	return {
	// 		restrict: 'E',
	// 		replace: true,
	// 		template: '<div></div>',
	// 		scope: {
	// 			disabled: '=',
	// 			isdisabled: '='
	// 		},
	// 		link: function (scope, elm, attrs) {
	// 			scope.$parent.isdisabled = scope.disabled
	// 		}
	// 	}
	// }]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
	var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/preview.html" });
	promise.then(function (resp) {
		$templateCache.put('formio/components/preview.html', resp.data);
		$templateCache.put('formio/componentsView/preview.html', resp.data);
	}, function (resp) {

	});
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('preview', {
		onEdit: ['$scope', function ($scope) {
			// $scope.editorKey = [{key: true, title: '编辑'}, {key: false, title: '不可编辑'}]
		}],
		icon: 'fa fa-tumblr',
		views: [
			{
				name: 'Display',
				template: 'formio/components/preview/display.html'
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
	$templateCache.put('formio/components/preview/display.html',
		'<ng-form>'
		+ '<form-builder-option property="label"></form-builder-option>'
		+ '<form-builder-option property="disabled"></form-builder-option>'
		+ '<form-builder-option property="customClass"></form-builder-option>'
		+ '<form-builder-option property="tabindex"></form-builder-option>'
		+ '<div class="form-group">'
		+ '<label for="editor-watch" form-builder-tooltip="">监听</label>'
		+ '<textarea class="form-control" ng-model="component.watch" id="editor-watch" rows="6">'
		+ '</textarea>'
		+ '</div>'
		+ '</ng-form>');
}]);

