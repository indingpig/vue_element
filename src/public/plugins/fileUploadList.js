
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('fileUploadList', {
		title: 'fileUploadList',
		template: 'formio/components/fileUploadList.html',
		settings: {
			input: true,
			tableView: true,
			label: '',
			key: 'FileUploadListField',
			placeholder: '',
			protected: false,
			persistent: true,
			clearOnHide: true,
			validate: {
				required: false,
				custom: ''
			}
		},

		controller: ['$scope', '$uibModal', 'toaster', 'messService', 'BaseService', '$q', '$localStorage', 'ViewPDF', function ($scope, $uibModal, toaster, messService, BaseService, $q, $localStorage, ViewPDF) {
			if ($scope.builder) return;
			var lookupType = $scope.component.key;
			//$scope.component.isShowList == 'list' ? $scope.isShowList = false :$scope.isShowList = true;

			if (!$scope.data[lookupType+ "list"]) {
				$scope.data[lookupType+ "list"] = null;
			}
			
			$scope.fileNameChanged = function(event){  
				$scope.fileData = event.files;                		
				//如果没有文件
				if( $scope.fileData.length == 0){
					return false;
				}
				
				//更新页面绑定内容
				//如果文件大于50M
				if($scope.fileData.length == 1){            			
					if( $scope.fileData[0].size > 5*10 * 1024 * 1024){
						toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.largeFile'));
						$scope.$apply(function () {
							//
						});
						return;
					}
				}else if($scope.fileData.length > 1){
					for(var i in $scope.fileData){
						if($scope.fileData[i].size > 5*10 * 1024 * 1024){
							toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess('com.hytera.largeFile'));
							$scope.$apply(function () {
								//
							});
							return;
						}
					}
				}
				//手动调用$apply刷新页面绑定的值
				$scope.$apply(function () {
					$scope.fileList = $scope.fileData;
					$scope.data[lookupType+ "list"] = []
					_.each($scope.fileList, function(_e) {
						$scope.data[lookupType+ "list"].push(_e.name)
					})
				});

				// for (var i = 0; i < $scope.fileList.length; i++) {
				// 	var file = $scope.fileList[i]
				// 	//利用fileReader实现上传
				// 	var reader = new FileReader();

				// 	reader.onloadstart = function () {
				// 		// 这个事件在读取开始时触发
				// 		console.log(file)
				// 	}
				// 	reader.onloadend = function () {
				// 		// 这个事件在读取结束后，无论成功或者失败都会触发
				// 		if (reader.error) {
				// 			console.log(reader.error)
				// 		} else {
				// 			upload(reader.result)
				// 		}
				// 	}
				// 	reader.readAsBinaryString(file);
				// }

				var formData = new FormData(event.form);
				upload(formData)
				
			}; 

			//上传进度实现方法，上传过程中会频繁调用该方法
			function progressFunction(evt) {
				var progressBar = document.getElementById('progressBar');
				var percentageDiv = document.getElementById("percentage");
				// event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
				if (evt.lengthComputable) {//
					progressBar.max = evt.total;
					progressBar.value = evt.loaded;
					$scope.$apply(function(){
						$scope.percent = Math.round(evt.loaded / evt.total * 100) 
					})
					percentageDiv.innerHTML = $scope.percent + "%";
 				}
		   	}

			function upload(res) {
				//创建xhr
				var xhr = new XMLHttpRequest();
				xhr.open("POST", '/oms/services/rest/docMgrtService/uploadFileListByPath', true);
				xhr.onerror = uploadFailed; //请求失败
				xhr.upload.onprogress = progressFunction;//【上传进度调用方法实现】
				xhr.upload.onloadstart = function () {//上传开始执行方法			                
					// oloaded = 0;//设置上传开始时，以上传的文件大小为0
				};
				xhr.send(res)//开始上传，发送form数据;
				xhr.onload = uploadComplete; //请求完成
				//上传成功响应
				function uploadComplete(evt) {
					if(this.responseText=='700'){
						toaster.pop('info', messService.getMess("com.hytera.remind"), messService.getMess("com.hytera.UploadSuccess"));
					}else {
						toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess("com.hytera.UploadFailure"));
					}
					//服务断接收完文件返回的结果
					attachListByKey();
				}
				//上传失败
				function uploadFailed(evt) {
					toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess("com.hytera.UploadFailure"));
				}
				//取消上传
				function cancleUploadFile() {
					xhr.abort();
				}
			}
			
			//根据path查询列表
			var attachListByKey = function(){
				if (!$scope.path) return
				BaseService._get({_service:'docMgrtService',_method:'attachListByKey',_id:$scope.path},function(_data){
					//判断是否显示预览按钮
					var suffix = ['doc', 'xls', 'docx', 'xlsx', 'pdf', 'ppt', 'pptx', 'txt'];
					var uploadListData = _data.data;
					_.each(uploadListData, function(_e, _i){
						var trueOrFalse = suffix.join(',').indexOf(_e.suffix);
						if( trueOrFalse == -1 ){
							_e.isSupportFile = false;
						}else{
							_e.isSupportFile = true;
						}
					})
					$scope.uploadList = uploadListData; 
					// 默认小图标
					var reg =  /^(doc|docx|gif|jpeg|jpg|pdf|ppt|pptx|rar|txt|xlsx|zip)$/;
					_.each(_data.data, function(_e, _i) {
						if (reg.test(_e.suffix)) {
							return
						} else {
							_e.suffixTemp = 'file'
						}
					})
					$scope.uploadTotal = _data.data.length;
					var eleId = $scope.componentId + 'file';
                    var file = document.getElementById(eleId);
                    file.value = '';
				})
			}
			//删除文件
			function delFileList(_docName) {
				var index = _.findIndex($scope.data[lookupType+ "list"], function(_n) { return _n == _docName });
				$scope.data[lookupType+ "list"].splice(index, 1);
				if ($scope.data[lookupType+ "list"].length == 0) {
					$scope.data[lookupType+ "list"] = null
				}
			}
			//删除
			$scope.del = function(attachmentId, docName, createBy){
				var currentUser = $localStorage.user;
				if(currentUser.userName !== createBy){
					return;
				}
				//调用删除接口
				BaseService._delete({_service:'docMgrtService',_method:'deleteFileById',_id: attachmentId},function(_data){
					if(_data.status == '203') {
						//弹出提示删除成功
						toaster.pop('success', messService.getMess("com.hytera.remind"), messService.getMess("com.hytera.deleteSuccessfully"));
						//初始化文件列表
						attachListByKey();
						delFileList(docName)
					} else {
						//弹出提示删除失败
						toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess("com.hytera.deleteFailed"));
					}
				})
				//window.location.href = delLink;
			}

			//配置默认文档分类      
            if(!_.isEmpty($scope.data[$scope.component.key])){
            	//有值
        		$scope.description = $scope.data[$scope.component.key];
            }else if(!_.isEmpty($scope.component.placeholder)){
            	//有填写
        		$scope.description = $scope.component.placeholder;
            }else{
            	//如果没有填写。默认是Other；
            	$scope.description = 'L005';
            }
			
			
            function onClick() {
            	//创建上传文件目录
				if(_.isEmpty($scope.data[$scope.component.key])){
					BaseService._put({_service:"docMgrtService", _method:'createDir', _id:$scope.description},function(_data){						
						$scope.path = _data.data;
						//如果API没值，绑定API
						$scope.data[$scope.component.key] = $scope.path;
					})				
				}else{
					//如果API有值
					$scope.path = $scope.data[$scope.component.key];
				}
				attachListByKey();
			};
			onClick();
			
			//文件预览
		    $scope.viewerPdf = function(_data){
		        ViewPDF.openModal(_data);
		    };
		}],
		viewTemplate: 'formio/componentsView/fileUploadList.html'
	});
}
])

angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function ($templateCache, FormioUtils, $http) {
	var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/fileUploadList.html" });
	promise.then(function (resp) {
		$templateCache.put('formio/components/fileUploadList.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/fileUploadList.html', FormioUtils.fieldWrap(resp.data));
	}, function (resp) {

	});
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('fileUploadList', {
		onEdit: ['$scope', function ($scope) {
            // $scope.isHide = ['true','false'];
            //$scope.isShowList = [{ name: 'upload', title: '完整组件' }, { name: 'list', title: '只展示下载列表' }];
        }],
		icon: 'fa fa-cloud-upload',
		views: [
			{
				name: 'Display',
				template: 'formio/components/fileUploadList/display.html'
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
	$templateCache.put('formio/components/fileUploadList/display.html',
	'<ng-form>' +
	'<form-builder-option property="label"></form-builder-option>' +
	'<form-builder-option property="defaultValue"></form-builder-option>' +
	'<form-builder-option property="placeholder"></form-builder-option>' +
	'<form-builder-option property="description"></form-builder-option>' +
	'<form-builder-option property="customClass"></form-builder-option>' +
	'<form-builder-option property="tabindex"></form-builder-option>' +
	'<form-builder-option property="clearOnHide"></form-builder-option>' +
	'<form-builder-option property="protected"></form-builder-option>' +
	'<form-builder-option property="persistent"></form-builder-option>' +
	'<form-builder-option property="disabled"></form-builder-option>' +
	//modify y18407 
	'<form-builder-option property="customDisabled"></form-builder-option>' +
	//end
	'<form-builder-option property="tableView"></form-builder-option>' +
	'</ng-form>');
}]);