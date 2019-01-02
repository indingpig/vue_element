
angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('supplierProduct', {
		title: 'Supplier Product',
		template: 'formio/components/supplierProduct.html',
		settings: {
			input: true,
			tableView: true,
			label: '',
			key: 'supplierProductField',
			placeholder: '',
			protected: false,
			persistent: true,
			clearOnHide: true,
			validate: {
				required: false,
				custom: ''
			},
			editable: false
		},
		controller: ['$scope', '$localStorage', 'messService', 'BaseService', 'toaster', function ($scope, $localStorage, messService, BaseService, toaster) {
			if ($scope.builder) return;
			$scope.lookupType = $scope.component.lookupType;
			switch ($scope.lookupType) {
				case 'supplierProduct':
					var component = $scope.component.key;
					$scope.addData = {};
					if (!$scope.data[component]) {
						$scope.data[component] = null;
					}
					$scope.addRow = function (_data) {
						if (_.isEmpty(_data) || _data.productSort == null || _data.product == null || _data.productsSource == undefined) {
							toaster.pop('error', messService.getMess('com.hytera.remind'), messService.getMess('一级品类、二级品类、来源为必填项'));
							return
						}
						if ($scope.data[component] === null) {
							$scope.data[component] = [];
						}
						var obj = _.clone(_data);
						$scope.data[component].push(obj);
					}
					$scope.removeRow = function (_i) {
						$scope.data[component].splice(_i, 1);
						if (_.isEmpty($scope.data[component])) {
							$scope.data[component] = null
						}
					}
					
					// productSorts options 
					BaseService._post({_service: 'sTPMgrtService', _method: 'getFirstSubCategory'}, function(_data) {
						$scope.productSorts = _data.data;
					});
					// 联动
					$scope.systemRoleCode = [];
					// 获取产品
					$scope.getProducts = function (_code, i) {
						$scope.addData.product = null;
						$scope.addData.productType = null;
						BaseService._post({_service: 'sTPMgrtService', _method: 'getFirstSubCategory'},{fathercategoryId: _code.categoryId}, function(_data) {
							$scope.productList = _data.data;
						});
					}
					// 获取产品型号
					$scope.getProductType = function (_code, i) {
						$scope.addData.productType = null;
						BaseService._post({_service: 'sTPMgrtService', _method: 'getFirstSubCategory'}, {fathercategoryId: _code.categoryId}, function(_data) {
							$scope.productTypeList = _data.data;
						});
					};
					// time compoment 
					$scope.popup = {
						datePopup: false,
					};
					$scope.dateOpen = function() {
						$scope.popup.datePopup = true;
					};
					// Products source
					BaseService._getArray({_service: 'lookUpMgrtService', _method: 'getLookUpItemByKL', _id: 'SUPPLIER-PROCUREMENT-SOURCE'}, function(_data) {
						$scope.productsSourceList = _data;
					});
					var timer = setTimeout(function() {
						$('#'+component +'placeholder').hide();
						clearTimeout(timer)
					}, 200)
				break;
				case 'supplierChange':
				var placeholderId =  $scope.component.key;
				var d = $scope.isDisabled($scope.component);
				webix.ready(function() {
					var isEditable = $scope.component.editable;
					var editor = '';
					isEditable? editor = 'richselect': editor = 'text'
					if (!$scope.data[placeholderId]) {
						$scope.data[placeholderId] = []
					}
					function analysisSingle(_c, _obj, _data) {
						// 这里的代码可以优化
						if (_c.DEPARTMENT == '1') {
							// 在jcs平台注册的
							_obj.supplierSalesRepresentativeName = _c.PERSON_LAST_NAME;
							_obj.supplierSalesRepresentativeContactInfo = _c.PRIMARY_PHONE_NUMBER;
							_obj.vendorContactId = _c.VENDOR_CONTACT_ID;
							_obj.parytSiteId = _c.PARTY_SITE_ID;
						} else {
							// 原有的ERP数据
							if (_data) {
								// 联系人有多个，取第一个
								_obj.supplierSalesRepresentativeName = _data[0].PERSON_LAST_NAME;
								_obj.supplierSalesRepresentativeContactInfo = _data[0].PRIMARY_PHONE_NUMBER;
								_obj.vendorContactId = _data[0].VENDOR_CONTACT_ID;
								_obj.parytSiteId = _data[0].PARTY_SITE_ID;
							} else {
								// 联系人只有一个，并且不在JCS平台注册，默认展示
								_obj.supplierSalesRepresentativeName = _c.PERSON_LAST_NAME;
								_obj.supplierSalesRepresentativeContactInfo = _c.PRIMARY_PHONE_NUMBER;
								_obj.vendorContactId = _c.VENDOR_CONTACT_ID;
								_obj.parytSiteId = _c.PARTY_SITE_ID;
							}
						};
						return _obj;
					};
					function analysis(_data, _obj) {
						for (var i = 0; i < _data.length; i++) {
							if (_data[i].DEPARTMENT == '1') {
								// 无论在ERP还是JCS注册的供应商，只要DEPARTMENT是1，解析后直接break
								_obj = analysisSingle(_data[i], _obj, _data);
								break
							} else {
								_obj = analysisSingle(_data[i], _obj, _data);
							}
						}
						return _obj
					};
					function parseSite(_sitesList, _o, _ouDataList) {
						_.each(_sitesList, function(_item, _index) {
							_o = parseSiteSingle(_item, _o, _ouDataList)
						});
						return _o;
					}
					function parseSiteSingle(_item, _obj, _ouDataList) {
						var o = {
							locationUse: '',
							paymentCondition: _item.TERM_NAME || '',
							registeredcapitalCurrency: _item.INVOICE_CURRENCY_CODE || '',
							date1: _item.SITE_CREATION_DATE || '',
							date2: '',
							organizationName: _item.ORGANIZATION_NAME
						};
						if (_item.VAT_CODE) {
							str = _item.VAT_CODE.match(/CHN_IN_(\S*)/)[1];
							o.taxRate = _item.VAT_CODE.match(/CHN_IN_(\S*)/)[1];
						} else {
							o.taxRate = '';
						}
						if (_item.PAYMENT_METHODS) {
							o.paymentMethod = _item.PAYMENT_METHODS.PAYMENT_METHOD.DESCRIPTION || '';
							o.billDays = _item.PAYMENT_METHODS.PAYMENT_METHOD.BILL_DAYS || '';
						} else {
							o.paymentMethod = '';
							o.billDays = '';
						}
						if (_item.BANK_ACCOUNTS) {
							o.bankname = _item.BANK_ACCOUNTS.BANK_ACCOUNT.BANK_BRANCH_NAME || '';
							o.bankaccountnum = _item.BANK_ACCOUNTS.BANK_ACCOUNT.BANK_ACCOUNT_NUM || '';
							o.banknumber = _item.BANK_ACCOUNTS.BANK_ACCOUNT.BRANCH_NUMBER || '';
						} else {
							o.bankname = '';
							o.bankaccountnum = '';
							o.banknumber = '';
						}
						_.each(_ouDataList, function(_o, _p) {
							if (o.organizationName == _o.value) {
								o.tradingOrganization = _o.id;
							}
						})
						_obj.outlets.push(o);
						return _obj;
					}
					// 解析数据
					function parse(_data, _site, _ouData) {
						var treeData = [];
						var ADdata = _data.VENDOR.ADDRS.ADDR;
						var obj = {};
						if (ADdata) {
							if (_.isArray(ADdata)) {
								_.each(ADdata, function(_e, _i) {
									obj = {
										detailedAddress: _e.ADDRESS_TEXT,
										country: _e.COUNTRY,
										province: _e.STATE,
										partySiteName: _e.PARTY_SITE_NAME,
										outlets: [],
										id: _i + 1,
										supplierSalesRepresentativeName : '',
										supplierSalesRepresentativeContactInfo : '',
										vendorContactId : '',
										parytSiteId : '',
									};
									if (_e.CONTACTS) {
										if (_.isArray(_e.CONTACTS.CONTACT)) {
											obj = analysis(_e.CONTACTS.CONTACT, obj);
										} else {
											obj = analysisSingle(_e.CONTACTS.CONTACT, obj)
										}
									};
									if (_e.SITES && !_.isEmpty(_e.SITES)) {  // OU层
										if (_.isArray(_e.SITES.SITE)) {
											obj = parseSite(_e.SITES.SITE, obj, _ouData);
										} else {
											obj = parseSiteSingle(_e.SITES.SITE, obj, _ouData);
										}
									}
									// 为richselect转换
									_.each(_site, function(_e, _i) {
										if (obj.partySiteName == _e.value) {
											obj.locationLevel = _e.id;
										}
									});
									treeData.push(obj);
								})
							} else {
								obj = {
									detailedAddress: ADdata.ADDRESS_TEXT,
									country: ADdata.COUNTRY,
									province: ADdata.STATE,
									partySiteName: ADdata.PARTY_SITE_NAME, 
									outlets: []
								};
								if (ADdata.CONTACTS) {
									if (_.isArray(ADdata.CONTACTS.CONTACT)) {
										obj = analysis(ADdata.CONTACTS.CONTACT, obj);
									} else {
										obj = analysisSingle(ADdata.CONTACTS.CONTACT, obj)
									}
								};
								if (ADdata.SITES && !_.isEmpty(ADdata.SITES)) {
									if (_.isArray(ADdata.SITES.SITE)) {
										obj = parseSite(ADdata.SITES.SITE, obj, _ouData);
									} else {
										obj = parseSiteSingle(ADdata.SITES.SITE, obj, _ouData);
									}
								}
								// 为richselect转换
								_.each(_site, function(_e, _i) {
									if (obj.partySiteName == _e.value) {
										obj.locationLevel = _e.id;
									}
								})
								treeData.push(obj)
							};
						} else {
							treeData = [{
								detailedAddress: '',
								country: '',
								partySiteName: '',
								outlets: [{
									locationUse: '',
									paymentCondition: '',
									taxRate: '',
									registeredcapitalCurrency: '',
									date1:  '',
									organizationName: '',
									paymentMethod: '',
									billDays: '',
									bankname: '',
									bankaccountnum: '',
									banknumber: '',
								}],
								id: 1,
								supplierSalesRepresentativeName : '',
								supplierSalesRepresentativeContactInfo : '',
								vendorContactId : '',
								parytSiteId : '',
							}]
						}
						return treeData;
					};
					var siteOption = [
						{id: '1', 'value': '材料采购'},
						{id: '2', 'value': '其他采购'}
					];

					// /oms/services/rest/supplierLocalService/getOUList
					var parma = {
						_service: 'supplierLocalService',
						_method: 'getOUList'
					};
					// 请求OU层的下拉数据;
					BaseService._get(parma,function(_data){
						_.each(_data.data, function (_e, _i) {
							_e.id = _e.organizationId;
							_e.value = _e.name
						});
						// 在最前面添加一个空选项
						_data.data[0] = {id:'0', value: ''};
						$scope.OUoption = _data.data;
						var timer1 = setTimeout(function() {
							$scope.$watch('data.supplierInfo', function(_newVal, _oldVal) {
								if (_newVal != _oldVal) {
									$$(placeholderId).clearAll();
									component.data = parse(_newVal, siteOption, $scope.OUoption);
									$$(placeholderId).parse(component.data);
									$scope.data[placeholderId] = component.data;
								}
							})
							component.subview.columns[1].options = $scope.OUoption; // 需要与subview的columns中的位置相对应
							webix.ui(component);
							$('#'+placeholderId +'placeholder').hide();
							_.each($scope.data[placeholderId], function(_e, _i) {
								$$(placeholderId).closeSub(_e.id);
								$$(placeholderId).openSub(_e.id);
							});							
							$$(placeholderId).refresh();
							clearTimeout(timer1)
						},100)
					})
					// 外层结构；
					var component = {
						container: placeholderId,
						id: placeholderId,
						view: 'datatable',
						autoheight: true,
						data: $scope.data[placeholderId],
						editable: (isEditable && !$scope.isDisabled($scope.component)),
						hover: "showPointer",
						resizeColumn: true,
						tooltip:true,
						columns: [
							{id: 'option',  header:{text: '操作', css: 'supplier-header'}, width: 50, template: function (obj) {
									var html = '';
									// if (isEditable) {
									// 	html = '<button class="addSite btn btn-default btn-xs" type="button">+</button>' +
									// 	'<button class="removeSite btn btn-default btn-xs" type="button" style="margin-left: 10px;">-</button>'
									// } 
									if (isEditable && !$scope.isDisabled($scope.component)) {
										html = '<button class="addSite btn btn-default btn-xs" type="button">+</button>';
									} else {
										html = '';
									}
									return html
								}
							},
							{ id: "", header: "", sort: "string", template: "{common.subrow()}", header:{text: '', css: 'supplier-header'},width:30 },
							{id: "locationLevel", editor: editor, width: 100, options: siteOption, header:{text: '地点层', css: 'supplier-header'}},
							{id:'supplierSalesRepresentativeName', editor: 'text', width: 100, header:{text: '联系人', css: 'supplier-header'}},
							{id: "supplierSalesRepresentativeContactInfo" , width: 150, sort: "string", editor: 'text', header:{text: '联系方式', css: 'supplier-header'}},
							{id: "country", width: 100,sort: "string", editor: 'text', header:{text: '国家', css: 'supplier-header'}},
							{id: "province", width: 100,sort: "string", editor: 'text', header:{text: '省', css: 'supplier-header'}},
							{id: "detailedAddress" , width: 650,fillspace: true,sort: "string", editor: 'text', header:{text: '详细地址', css: 'supplier-header'}},
						],
						on:{
							onSubViewCreate:function(view, item){
								view.config.id = 'subview' + item.id;
								view.config.parentId = item.id;
								view.parse(item.outlets);

							},
							onAfterEditStop: function (state, editor) {
								var tableData = [];
								var self = this;
								var item = self.getItem(editor.row); // 获取当前行的数据；
								if (!item.$cellCss) {
									item.$cellCss = {};
								}
								this.eachRow(function (row) {
									var item1 = self.getItem(row); // 通过eachRow遍历其他行的数据；
									if (editor.column == 'locationLevel') {
										if (editor.row != row && state.value == item1[editor.column]) {
											item[editor.column] = null;
											self.updateItem(editor.row, item);
											self.refresh();
											webix.message("不能创建相同的地点层", 'error')
										}
									};
									// 单元格被修改后变色
									if (state.old != state.value) {
										self.addCellCss(editor.row, editor.column, 'cell-change');
										// 单元格颜色保存到数据中；
										item.$cellCss[editor.column] = 'cell-change';
										self.refresh();
									}
									tableData.push(item1);
								})
							}
						},
						onClick: {
							'addSite': function (e, id, trg) {
								var count = this.count();
								if (count > 1) {
									webix.message('只能创建两条', 'error');
									return
								}
								this.add({outlets:[{
									locationLevel: '',
									supplierSalesRepresentativeName: '',
									supplierSalesRepresentativeContactInfo: '',
									country: '',
									province: '',
									detailedAddress: '',
								}]})
							},
							'removeSite': function (e, id, trg) {
								var count = this.count();
								if (count == 1) {
									webix.message('最少有一条', 'error');
									return
								}
								this.remove(id)
							}
						},
						subview: {
							view: 'datatable',
							headerRowHeight: 28,
							tooltip:true,
							resizeColumn: true,
							// select: true,
							autoheight: true,
							editable: (isEditable && !$scope.isDisabled($scope.component)),
							columns: [
								{ id:'option', header:{text: '操作', css: 'supplier-header'}, width: 50, template: function (obj) {
									var html = '';
									if (isEditable && !$scope.isDisabled($scope.component)) {
										html = '<button class="addOU btn btn-default btn-xs" type="button">+</button>';
									} else {
										html = '';
									}
									return html
								}},
								{ id: "tradingOrganization", editor: editor, width: 300, options: $scope.OUoption ,header:{text: 'OU层', css: 'supplier-header'}},
								// { id: "locationUse", editor: 'popup', header:{text: '地点用途', css: 'supplier-header'}},
								{ id: "paymentMethod", editor: 'popup', header:{text: '付款方式', css: 'supplier-header'}},
								{ id: "billDays", editor: 'popup', width: 50 ,header:{text: '天数', css: 'supplier-header'}},
								{ id: "paymentCondition", editor: 'popup', width:200 ,header:{text: '付款条件', css: 'supplier-header'}},
								{ id: "bankname", editor: 'popup', width:200 ,header:{text: '开户行', css: 'supplier-header'}},
								{ id: "bankaccountnum", editor: 'popup', width: 150 ,header:{text: '银行账号', css: 'supplier-header'}},
								{ id: "banknumber", editor: 'popup', width: 150 ,header:{text: '银行编码/swife code', css: 'supplier-header'}},
								{ id: "taxRate", editor: 'popup', width: 50 ,header:{text: '税率', css: 'supplier-header'}},
								{ id: "registeredcapitalCurrency", editor: 'popup', width: 50 ,header:{text: '币种', css: 'supplier-header'}},
								{ id: "date1", format: webix.Date.dateToStr("%Y-%m-%d") ,header:{text: '层创建时间', css: 'supplier-header'}},
								{ id: "date2", editor: 'date',stringResult:true, format: webix.Date.dateToStr("%Y-%m-%d") ,header:{text: '层失效日期', css: 'supplier-header'}}, // format 可以改变日期的格式 %Y-%m-%d为2018-06-11 %y-%m-%d为18-06-11
							],
							onClick: {
								'addOU': function (e, id, trg) {
									this.getFirstId();
									var o = {
										tradingOrganization: '',
										paymentMethod: '',
										billDays: '',
										paymentCondition: '',
										bankname: '',
										bankaccountnum: '',
										banknumber: '',
										taxRate: '',
										registeredcapitalCurrency: '',
										date1: '',
										date2: '',
									}
									this.add(o);
									// this.updateItem(id,{});
									$$(placeholderId).refresh()
								},
								'removeOU': function (e, id, trg) {
									var count = this.count();
									if (count == 1) {
										webix.message('最少有一条', 'error');
										return
									}
									this.remove(id);
									$$(placeholderId).refresh()
								}
							},
							on: {
								onAfterEditStop: function (state, editor) {
									var self = this;
									var parentId = this.config.parentId;
									var item = self.getItem(editor.row);
									// 单元格颜色
									if (!item.$cellCss) {
										item.$cellCss = {};
									}
									if (editor.column == 'tradingOrganization') {
										self.eachRow(function(row) {
											var item1 = self.getItem(row);
											if (editor.row != row && state.value == item1[editor.column]) {
												item[editor.column] = null;
												self.updateItem(editor.row, item);
												self.refresh();
												webix.message("不能创建相同OU层", 'error')
											}
										})
									};
									// 单元格被修改后变色
									if (state.old != state.value) {
										self.addCellCss(editor.row, editor.column, 'cell-change');
										// 单元格颜色保存到数据中；
										item.$cellCss[editor.column] = 'cell-change';
										self.refresh();
									}
									var table = $$(placeholderId);
									var data1 = [];
									var tableData = [];
									self.eachRow(function(row) {
										data1.push(self.getItem(row))
									});
									table.find(function(row) {
										tableData.push(row)
									});
									var viewId = _.findIndex(tableData,function(_e,_i) {
										return _e.id == parentId;
									})
									tableData[viewId].outlets = data1;
									table.updateItem(parentId,tableData[viewId])
									$scope.data[placeholderId] = tableData;
								},
							}
						}
					};
				});
			};
		}],
		viewTemplate: 'formio/componentsView/supplierProduct.html'
	});
}]);
angular.module('ngFormBuilder').run(['$templateCache', 'FormioUtils', '$http', function($templateCache, FormioUtils, $http) {
    var promise=$http({ method:'GET', url:"admin/vendor/angular/ng-formio/plugins/supplierProduct.html" });
    promise.then(function(resp) {
		$templateCache.put('formio/components/supplierProduct.html', resp.data);
		$templateCache.put('formio/componentsView/supplierProduct.html', resp.data);
	}, function(resp) {

	});
}]);

angular.module('ngFormBuilder').config(['formioComponentsProvider', function (formioComponentsProvider) {
	formioComponentsProvider.register('supplierProduct', {
		onEdit: ['$scope', function ($scope) {
			$scope.lookupTypes = [{name:'supplierProduct', title:'供应商注册组件'},{name:'supplierChange',title:'供应商变更界面组件'}]
		}],
		icon: 'fa fa-search',
		views: [
			{
				name: 'Display',
				template: 'formio/components/supplierProduct/display.html'
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
	$templateCache.put('formio/components/supplierProduct/display.html',
		'<ng-form>'
		+ '<form-builder-option property="label"></form-builder-option>'
		+ '<div class="form-group">'
		+ '<label for="lookupType" form-builder-tooltip="">{{\'Lookup Type\' | formioTranslate}}</label>'
		+ '<select class="form-control" id="lookupType" name="lookupType" ng-options="type.name as type.title for type in lookupTypes" ng-model="component.lookupType"></select>' 
		+ '</div>'
		+ '<div class="form-group">'
		+ '<label for="editable" form-builder-tooltip="">{{\'可编辑\' | formioTranslate}}</label>'
		+ '<input type="checkbox" name="editable" id="editable" ng-model="component.editable" class="form-control">' 
		+ '</div>'
		+ '<form-builder-option property="customClass"></form-builder-option>'
		+ '<form-builder-option property="customDisabled"></form-builder-option>'
		+ '<form-builder-option property="tabindex"></form-builder-option>'
		+ '</ng-form>');
}]);
