
angular.module('ngFormBuilder').config(['formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('Import', {
	    title: 'Import',
	    template: 'formio/components/Import.html',
	    settings: {
	          input: true,
	          tableView: true,
	          label: '',
	          key: 'Import',
	          placeholder: '',
	          protected: false,
	          persistent: true,
	          clearOnHide: true,
	          validate: {
	            required: false,
	            custom: ''
	          }
	        },
	    controller: ['$scope', '$uibModal', 'toaster', 'messService', function($scope, $uibModal, toaster, messService) {
			if ($scope.builder) return;
			$scope.tableData = [];
			$scope.$watch('data.OrgData', function(_newVal, _oldVal){
				if (_newVal != _oldVal){
					$scope.data.OrgData = _newVal;
					$scope.tableData = _newVal;
				}
				return;
			})
			
			//增加一行webix表格
			$scope.addItem = function(){
				if(!$$('mytable')){
					return;
				};
				var table = $$('mytable');
				var selList = table.getSelectedId(true);
				var start = 0;
				if (selList.length == 0){
					start = table.getVisibleCount();
				}else{
					var id = selList[selList.length-1].id;
					start = table.getIndexById(id) + 1;
				}
				table.add({
					type: '',
					departNameCnO: "",
					departNameEnO: "",
					principalO: "",
					DeptFunctionCNO: "",
					DeptFunctionENO: "",
					officeAreaO: "",
					departNameEnU: "",
					principalU: "",
					DeptFunctionCNU: "",
					DeptFunctionENU: "",
					officeAreaU: "",
				},start);
				saveData(table);
				table.refresh()
			}

			//删除一行或者多行webix表格
			$scope.removeItem = function(){
				if(!$$('mytable')){
					return
				}
				var table = $$('mytable');
				var sel = table.getSelectedId(true);
				if (sel.length == 0) { 
					toaster.pop('error', messService.getMess('com.hytera.remind'), messService.getMess('com.hytera.selectOneRecord'))
					return
				};
				for (var i = 0; i < sel.length; i++){
					table.remove(sel[i]);
				}
				saveData(table);
				table.refresh()
			}

			//webix表格数据保存
			var saveData = function(_table){
				$scope.data.OrgData = [];
				_table.eachRow(
					function(row){
						$scope.data.OrgData.push(_table.getItem(row))
					}
				)
				// toaster.pop('success', messService.getMess('com.hytera.remind'), messService.getMess('com.hytera.savetabledata'))
			}
        }],
      viewTemplate: 'formio/componentsView/Import.html'
      });
    }
  ])
.directive("webixTable", ['messService', function(messService){
	return {
		replace: true,
		restrict: 'EAC',
		scope: { 
			tabledata: '=',
			disabled: '='
		},
		link: function(scope, elm, attrs){
			scope.iseditable = !scope.disabled;
			scope.$watch('tabledata',function(_newVal, _oldVal){
				if(_newVal != _oldVal){
					var dtable = $$("mytable");
					//清空原有的数据
					dtable.clearAll();
					dtable.parse(_newVal);
					dtable.adjustRowHeight("departNameCnO", true); 
					dtable.refresh()
				}
				return
			})
			webix.ready(function () {
				// console.log(window.devicePixelRatio);
				var width = null;
				window.devicePixelRatio == 1.25? width = 100: width = 160;
				var grid = new webix.ui({
					view: "datatable",		// 渲染的格式
					container: "mytable",	// 渲染区的容器
					id: "mytable",			// 必须，与渲染的容器的id相对应
					autoheight: true,
					fixedRowHeight:false,
					rowLineHeight:34, 
					rowHeight:34,
					editable: scope.iseditable, 	// 可编辑	
					editaction: "dblclick",	// 双击可编辑	
					select: "row",			// 点击选择行
					multiselect: true,		// 行多选
					resizeColumn: true,		// 列的宽度可拖动
					resizeRow:true,
					leftSplit: 1,			// 冻结第一列
					scorllX:true,
					tooltip:true,			// 鼠标悬浮提示框
					columns: [				// 渲染的列
						{ id: "type", editor: "text", header: [{ text: messService.getMess("com.hytera.type"), css: { "text-align": "center" } }], width: 60, css: { "text-align": "center" } },
						{ id: "departNameCnO", editor: "popup", header: [{ text: messService.getMess("com.hytera.org.OriginalOrganizationStructure"), colspan: 5, css: { "text-align": "center" } }, messService.getMess("com.hytera.org.DeptName(CN)")], width:width,}, //合并单元格 100
						{ id: "departNameEnO", editor: "text", header: ['', messService.getMess("com.hytera.org.DeptName(EN)")],width:width }, //100
						{ id: "principalO", editor: "text", header: ['', messService.getMess("com.hytera.org.ResponsiblePerson")] },
						{ id: "DeptFunctionCNO", editor: "popup", header: ['', messService.getMess("com.hytera.org.DeptFunctionCN")], width:width },
						{ id: "DeptFunctionENO", editor: "popup", header: ['', messService.getMess("com.hytera.org.DeptFunctionEN")], width:width}, //100
						// { id: "officeAreaO", editor: "text", header: ['', messService.getMess("com.hytera.org.OfficeArea")] },
						{ id: "departNameCnU", editor: "popup", header: [{ text: messService.getMess("com.hytera.org.AdjustedOrganizationStructure"), colspan: 5, css: { "text-align": "center" } }, messService.getMess("com.hytera.org.DeptName(CN)")],width:width }, //100
						{ id: "departNameEnU", editor: "text", header: ['', messService.getMess("com.hytera.org.DeptName(EN)")],width:width }, //100
						{ id: "principalU", editor: "text", header: ['', messService.getMess("com.hytera.org.ResponsiblePerson")] },
						{ id: "DeptFunctionCNU", editor: "popup", header: ['', messService.getMess("com.hytera.org.DeptFunctionCN")], width:width },
						{ id: "DeptFunctionENU", editor: "popup", header: ['', messService.getMess("com.hytera.org.DeptFunctionEN")], width:width }, //100
						// { id: "officeAreaU", editor: "text", header: ['', messService.getMess("com.hytera.org.OfficeArea")] },
					],
					data: scope.tabledata,
					// on:{
					// 	onItemDblClick: function(id, e, trg) {
					// 		if (scope.iseditable) {
					// 			return
					// 		}
					// 		console.log(e);
					// 		var text = this.getText(id.row, id.column);
					// 		webix.ui({
					// 			view:"popup",
					// 			height:250,
					// 			width:300,
					// 			left:e.clientX, 
					// 			top:e.clientY,
					// 			head:"My Window",
					// 			body:{
					// 				template: text
					// 			}
					// 		}).show();
					// 	}
					// }
				});
			})
		}
	}
}])
.directive("importSheetJs", [function () {
	return {
		scope: {
			isolates: '='
		},
		link: function (scope, elm, attrs, messService) {
			elm.on('change', function (changeEvent) {
				var reader = new FileReader();
				var workArea = [];
				var arraydata = [];
				reader.onload = function (e) {
					// do something code here;
					var bstr = e.target.result;
					// var workbook = XLSX.read(bstr, { type: 'binary' });
					var workbook = XLSX.read(btoa(fixdata(bstr)), {//手动转化  
						type: 'base64'  
					});  
					var arr = []
					var array = [];
					var newArr = [];
					var sheetNameList = workbook.SheetNames;
					//遍历工作表中的数据
					sheetNameList.forEach(function (y) {
						var worksheet = workbook.Sheets[y];
						var ref = worksheet['!ref'];
						//遍历工作表中的数据；以工作表的单元格为一个元素；
						workArea = getSheetArray(ref);

						for (z in worksheet) {
							if (z[0] === '!') {
								continue
							}
							var objtempt = {};
							objtempt[z] = worksheet[z].v;
							arr.push(objtempt);

						}
						// 注意！注意！注意！当模板增加列或者减少列的时候，这里需要做相应的修改！！！
						arr = arr.slice(13);

						for (var j = 0; j < workArea.length; j++) {
							workArea[j].forEach(function (value, index) {
								var re = checkExists(arr, value);
								if (re) {
									workArea[j][index] = re;
								} else {
									workArea[j][index] = null;
								}
							})
						}

					});

					function checkExists(list, key) {
						for (l in list) {
							if (list[l][key]) {
								return list[l][key];
							} else {
								continue;
							}
						}
					}

					//根据工作表的工作区域做一个对应的数组；
					function getSheetArray(_ref) {
						var array1 = _ref.split(":");
						var rowMin = array1[0].substr(1);
						var rowMax = array1[1].substr(1);
						var colMin = array1[0].charAt(0);
						var colMax = array1[1].charAt(0);
						var list = [];
						for (var j = rowMin; j <= rowMax; j++) {
							var arr = [];
							for (var i = colMin.charCodeAt(0); i <= colMax.charCodeAt(0); i++) {
								var str = String.fromCharCode(i) + j;
								//console.log(str);
								arr.push(str);
							}
							list[j - 1] = arr;
						}
						list = list.slice(2);
						return list;
					}

					var OrgData = []
					for (var i = 0; i < workArea.length; i++) {
						var obj = {};
						for (var j = 0; j < workArea[i].length; j++) {
							obj["type"] = workArea[i][0];
							obj["departNameCnO"] = workArea[i][1];
							obj["departNameEnO"] = workArea[i][2];
							obj["principalO"] = workArea[i][3];
							obj["DeptFunctionCNO"] = workArea[i][4];
							obj["DeptFunctionENO"] = workArea[i][5];
							// obj["officeAreaO"] = workArea[i][6];
							obj["departNameCnU"] = workArea[i][6];
							obj["departNameEnU"] = workArea[i][7];
							obj["principalU"] = workArea[i][8];
							obj["DeptFunctionCNU"] = workArea[i][9];
							obj["DeptFunctionENU"] = workArea[i][10];
							// obj["officeAreaU"] = workArea[i][12];

						}
						OrgData.push(obj)
					}
					scope.$parent.$parent.data.OrgData = OrgData;
					scope.$apply();
				};
				reader.readAsArrayBuffer(changeEvent.target.files[0]);
				function fixdata(data) { //文件流转BinaryString  
					var o = "",  
						l = 0,  
						w = 10240;  
					for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));  
					o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));  
					return o;  
				} 
			})
		}
	}
}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/Import.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/Import.html', FormioUtils.fieldWrap(resp.data));
		$templateCache.put('formio/componentsView/Import.html', FormioUtils.fieldWrap(resp.data));
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config([ 'formioComponentsProvider', function(formioComponentsProvider) {
	formioComponentsProvider.register('Import', {
		onEdit : [ '$scope', function($scope) {}],
		icon : 'fa fa-pencil-square-o',
		views : [
				{
					name : 'Display',
					template : 'formio/components/Import/display.html'
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
	$templateCache.put('formio/components/Import/display.html',
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