
angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('editor', {
	    title: 'Editor',
	    template: 'formio/components/editor.html',
	    settings: {
	          input: true,
	          tableView: true,
	          label: '',
	          key: 'editorField',
	          placeholder: '',
	          protected: false,
	          persistent: true,
	          clearOnHide: true,
	          validate: {
	            required: false,
	            custom: ''
	          }
	        },
	    controller: ['$scope', function($scope) {
			if ($scope.builder) return;
			var key = $scope.component.key;
		   // Editor options.
			$scope.options = {
				allowedContent : true,
				entities : false,
				// Editror toolbar config
				// uiColor: '#AADC6E',
				image_previewText : ' ', // 去掉图片预览中的英文，这里注意里面一定要有个空格 
				extraPlugins: 'insertImg',
				toolbarGroups : [
					{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
					{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
					{ name: 'links' },
					{ name: 'insert' },
					{ name: 'forms' },
					{ name: 'tools' },
					{ name: 'document',	  groups: [ 'mode', 'document', 'doctools','myplugin' ] }, //源码: mode
					{ name: 'others' },
					{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
					{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
					{ name: 'styles', groups: [ 'styles' ] },
					{ name: 'colors' },
					// { name: 'about' , groups:['myplugin']},
					
				]
			};
			localStorage.getItem("language")=='zh-CN'?$scope.options.language = 'zh-cn':$scope.options.language = 'en';
			// not needed in the Standard(s) toolbar.
			$scope.options.removeButtons = $scope.component.remove;
			// 清除格式
			$scope.options.pasteFromWordRemoveFontStyles = $scope.component.removeformat; // 默认false为不清除；
			// Called when the editor is completely ready.
			$scope.onReady = function() {
				// ...
			};
	      
        }],
        viewTemplate: 'formio/componentsView/editor.html'
      });
    }
  ]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/editor.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/editor.html', resp.data);
		$templateCache.put('formio/componentsView/editor.html', resp.data);
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config([ 'formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('editor', {
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
			+ '<div class="form-group">'
			+ '<label for="editor-remove" form-builder-tooltip="请用英文字符,隔开;">移除按钮，具体配置<a href="http://localhost:8080/oms/admin/vendor/angular/angular-ckeditor/bower_components/ckeditor/samples/index.html" target="_blank">请查看</a></label>'
			+ '<input type="text" class="form-control" ng-model="component.remove" id="editor-remove">'
			+ '</div>'
			+ '<div class="form-group">'
			+ '<label for="editor-removeformat" form-builder-tooltip="">是否清除从word文档粘贴的文本格式</label>'
			+ '<input type="checkbox" class="form-control" ng-model="component.removeformat" id="editor-removeformat">'
			+ '</div>'
			+ '</ng-form>');
} ]);