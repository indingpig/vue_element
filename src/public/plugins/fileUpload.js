angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
    formioComponentsProvider.register('FileUpload', {
        title: 'File Upload',
        template: 'formio/components/fileUpload.html',
        settings: {
            input: true,
            tableView: true,
            label: '',
            key: 'FileUploadField',
            placeholder: '',
            protected: false,
            persistent: true,
            clearOnHide: true,
            validate: {
                required: false,
                custom: ''
            }
        },
        controller: ['$scope', '$uibModal', 'BaseService', 'toaster', 'messService', '$localStorage', function($scope, $uibModal, BaseService, toaster, messService, $localStorage) {
            if ($scope.builder) return;
            var valueKey = $scope.component.valueKey;
            var ctrl = null;
            var ctrlList = null;
            var isMulti = $scope.component.isMulti || false;
            $scope.fileMultiple = false;
            if(isMulti){
            	$scope.fileMultiple = true;
            }
            $scope.uploadTotal = 0;
            //$scope.data[$scope.component.key] = null;
            ctrl = ['$scope', '$uibModalInstance', '$localStorage', 'parent', 'component', 'BaseService','$q', 'messService', 'toaster', function($scope, $uibModalInstance, $localStorage, parent, component, BaseService, $q, messService, toaster) {
            	
            	$scope.multiple = parent.fileMultiple;
            	//绑定文档类型，业务主键；
            	$scope.detail = {
            		path: parent.path
            	}
            	$scope.flieList = [];			//数据，为一个复合数组             
                //文件上传
            	$scope.fileNameChanged = function(event){  
            		$scope.fileData = event.files;                		
            		//如果没有文件
            		if( !isMulti && $scope.fileData.length > 1){
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
            		});
        			
            	}; 
            	
            	//上传进度实现方法，上传过程中会频繁调用该方法
                function progressFunction(evt) {                    
                     var progressBar = document.getElementById("progressBar");
                     var percentageDiv = document.getElementById("percentage");
                     // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
                     if (evt.lengthComputable) {//
                         progressBar.max = evt.total;
                         progressBar.value = evt.loaded;
                         percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
                     }
                }    
                //点击上传按钮
        		$scope.uploadFn =  function (){
        			//angular$q利用延迟
        			var defer = $q.defer();
        			var promise = defer.promise;
        			$('#formFileUpload').submit(function(event){
        				event.preventDefault();
        				//$scope.form = $(this);							
        				// mulitipart form,如文件上传类
        				$scope.formData = new FormData(this);
        				//console.log($scope.formData);
        				//返回值给promise；
        				defer.resolve($scope.formData);
        				return promise;
        			})
        			//回调上传方法；
        			promise.then(function(formData){        				
        				//创建xhr
        				var xhr = new XMLHttpRequest();
        				xhr.open("POST", '/oms/services/rest/docMgrtService/uploadFileListByPath', true);
        				xhr.onerror =  uploadFailed; //请求失败
        				xhr.upload.onprogress = progressFunction;//【上传进度调用方法实现】
        				xhr.upload.onloadstart = function(){//上传开始执行方法			                
        					// oloaded = 0;//设置上传开始时，以上传的文件大小为0
        				};        				
        				xhr.send(formData); //开始上传，发送form数据
        				xhr.onload = uploadComplete; //请求完成
        				//上传成功响应
        				function uploadComplete(evt) {
        					//服务断接收完文件返回的结果
        					attachListByKey();
        				}
        				//上传失败
        				function uploadFailed(evt) {
        					toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess("com.hytera.UploadFailure"));
        				}
        				//取消上传
        				function cancleUploadFile(){
        					xhr.abort();
        				}
        			})
        				
        		
        		}
        		//根据path查询列表
        		var attachListByKey = function(){
        			BaseService._get({_service:'docMgrtService',_method:'attachListByKey',_id:$scope.detail.path},function(_data){
	            		$scope.myData = _data.data; 
						parent.uploadTotal = _data.data.length;
	            	})
        		}
        		//初始化列表
        		attachListByKey();
        		$scope.myData = [];
        		$scope.gridOptions = {
        	    		data: 'myData',
        	    		enablePaging: true,
        	    		columnDefs: [
        	    		             {field:'docName', displayName:messService.getMess('com.hytera.FileName')},
        	    		             {field:'docSize', displayName:messService.getMess('com.hytera.documentSize')},
        	    		             {field:'suffix', displayName:messService.getMess('com.hytera.docType')},
        	    		             {field:'op', displayName:messService.getMess("com.hytera.operation"), cellTemplate:'<button class="icon-shanchu" ng-click="delFile(row.getProperty(\'attachmentId\'))"></button>'}
        	                         ]
    	    	};
        		//删除文件
        		$scope.delFile = function(attachmentId){
        			//调用删除接口
        			BaseService._delete({_service:'docMgrtService',_method:'deleteFileById',_id: attachmentId},function(_data){
        				if(_data.status == '203') {
        					//弹出提示删除成功
        	                toaster.pop('success', messService.getMess("com.hytera.remind"), messService.getMess("com.hytera.deleteSuccessfully"));
        	                //初始化文件列表
        	                attachListByKey();
        				} else {
        					//弹出提示删除失败
        			        toaster.pop('error', messService.getMess("com.hytera.remind"), messService.getMess("com.hytera.deleteFailed"));
        				}
        			})
        			//window.location.href = delLink;
        		}
        		//点击取消按钮
				$scope.cancel = function() {
					$uibModalInstance.dismiss('cancel');
				};				

			}];
			//查看文档列表
            ctrlList = ['$scope', '$uibModalInstance', '$localStorage', 'parent', 'component', 'BaseService', 'toaster', 'messService', function($scope, $uibModalInstance, $localStorage, parent, component, BaseService, toaster, messService) {
            	//绑定文档类型，业务主键；
            	$scope.detail = {
            		path: parent.path
            	}
            	//查看文档列表
            	var attachListByKey = function(){
        			BaseService._get({_service:'docMgrtService',_method:'attachListByKey',_id:$scope.detail.path},function(_data){
	            		$scope.myData = _data.data; 
	            	})
        		}
        		attachListByKey(); 
        		//列表绑定
               	$scope.gridOptions = {
        	    		data: 'myData',
        	    		enablePaging: true,
        	    		columnDefs: [
        	    		             {field:'docName', displayName:messService.getMess('com.hytera.FileName')},
        	    		             {field:'docSize', displayName:messService.getMess('com.hytera.documentSize')},
        	    		             {field:'suffix', displayName:messService.getMess('com.hytera.docType')},
        	    		             {field:'op', displayName:messService.getMess("com.hytera.operation"), cellTemplate:'<button ng-bind="\'com.hytera.downloadFile\'|mess" ng-click="upload(row.getProperty(\'link\'))"></button>'}
        	                         ]
               	};

        	    //下载文件
    	    	$scope.upload = function(link){
    	    		window.location.href = link;
    	    	}
			  	//取消按钮
				$scope.cancel = function() {
					$uibModalInstance.dismiss('cancel');
				};
            }];
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
            
            var onClick = function() {
            	//创建上传文件目录
				if(_.isEmpty($scope.data[$scope.component.key])){
					BaseService._put({_service:"docMgrtService", _method:'createDir', _id:$scope.description},function(_data){						
						$scope.path = _data.data;
						//如果API没值，绑定API
						$scope.data[$scope.component.key] = $scope.path;
						//打开浮动层
						$uibModal.open({
		    				templateUrl: 'fileDialog.html',
		    				controller: ctrl,
		    				size: 'lg',
		    				resolve: {
		    					component: function() {
		    						return $scope.component;
		    					},
		    					parent: function() { return $scope; }
		    				}
		    			});
					})				
				}else{
					//如果API有值
					$scope.path = $scope.data[$scope.component.key];
					//打开浮动层
					$uibModal.open({						
	    				templateUrl: 'fileDialog.html',
	    				controller: ctrl,
	    				size: 'lg',
	    				resolve: {
	    					component: function() {
	    						return $scope.component;
	    					},
	    					parent: function() { return $scope; }
	    				}
	    			});
				}
                                
                
            };
            //点击查看文件按钮
            var queryClick = function(){
            	//获取API绑定的值
            	$scope.path = $scope.data[$scope.component.key];
            	//打开浮动层
            	$uibModal.open({
    				templateUrl: 'fileList.html',
    				controller: ctrlList,
    				size: 'lg',
    				resolve: {
    					component: function() {
    						return $scope.component;
    					},
    					parent: function() { return $scope; }
    				}
    			});
            }
            //接收button的queryClick事件
            $scope.$on('queryClick', function(event, component, componentId) {
                if (componentId !== $scope.componentId) {
                    return;
                }
                //调用查看文件
                queryClick();
            });
          //接收button的buttonClick事件
            $scope.$on('buttonClick', function(event, component, componentId) {
                if (componentId !== $scope.componentId) {
                    return;
                }
                //调用事件
                onClick();
            });

        }],
        viewTemplate: 'formio/componentsView/fileUpload.html'
    });
}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise = $http({ method: 'GET', url: "admin/vendor/angular/ng-formio/plugins/fileUpload.html" });
    promise.then(function(resp) {
        $templateCache.put('formio/components/fileUpload.html', FormioUtils.fieldWrap(resp.data));
        $templateCache.put('formio/componentsView/fileUpload.html', FormioUtils.fieldWrap(resp.data));
    }, function(resp) {

    });
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
    formioComponentsProvider.register('FileUpload', {
        icon: 'fa fa-cloud-upload',
        views: [{
                name: 'Display',
                template: 'formio/components/fileUpload/display.html'
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
            }
        ],
        documentation: ''
    });
}]);
angular.module('ngFormBuilder').run(['$templateCache', function($templateCache) {
    // Create the settings markup.
    $templateCache.put('formio/components/fileUpload/display.html',
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
        '<div class="form-group">'
		+ '<label for="isMulti" form-builder-tooltip="">{{\'Multi Select\' | formioTranslate}}</label>'
		+ '<input type="checkbox" class="form-control" id="isMulti" name="isMulti" ng-model="component.isMulti"></input>' 
		+ '</div>'+
        //modify y18407 
        '<form-builder-option property="customDisabled"></form-builder-option>' +
        //end
        '<form-builder-option property="tableView"></form-builder-option>' +
        '</ng-form>');
}]);