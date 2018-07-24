<template>
  <div>
      <div>
          一级表头
          <el-checkbox-group v-model="headerLevel1">
              <el-checkbox label="国外游戏"></el-checkbox>
              <el-checkbox label="国内游戏"></el-checkbox>
          </el-checkbox-group>
      </div>
      <div>
            <div>二级表头-游戏厂商</div>
            <el-checkbox-group v-model="headerLevel2">
                <el-checkbox v-for="item in header1List" :key="item.id" :label="item.val"></el-checkbox>
            </el-checkbox-group>
      </div>
      <div>
          <p>三级表头-各厂商游戏</p>
          <div>
              B社游戏
            <el-checkbox-group v-model="BGameSelectList">
                <el-checkbox v-for="item in BGameList" :key="item.id" :label="item.val"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div>
              R星游戏
              <el-checkbox-group v-model="RGameSelectList">
                <el-checkbox v-for="item in RGameList" :key="item.id" :label="item.val"></el-checkbox>
              </el-checkbox-group>
          </div>
          <div>
              土豆游戏
              <el-checkbox-group v-model="TGameSelectList">
                  <el-checkbox v-for="item in TGameList" :key="item.id" :label="item.val"></el-checkbox>
              </el-checkbox-group>
          </div>
      </div>
      <div style="margin-left: 5px;">
          <el-button type="primary" plain @click="confirm">确定</el-button>
          <el-button type="primary" plain @click="refresh">刷新</el-button>
      </div>
      <div>
          <webix-ui :config="dataTable" id="mytable"/>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "增加店铺",
      header1List: [{id: 'B', val:'B社'},{id:'R',val:'R星'},{id:'U', val:'土豆'}],
      BGameList: [{id: 'iron', val:'上古卷轴'},{id:'spider',val:'辐射'},{id:'hulk', val:'DOOM'}],
      RGameList:[{id:'gta', val:'GTA'}, {id:'rdr',val:'荒野大镖客'}],
      TGameList: [{id:'AC', val:'刺客信条'}, {id:'watchDog',val:'看门狗'},{id:'Rainbow6', val:'彩虹6号：围攻'}],
      headerLevel1: [],
      headerLevel2: [],
      BGameSelectList: [], // 3
      RGameSelectList: [], // 3
      TGameSelectList: [], // 3
      columns:[],
      talbleData: [{"type":"调整adjusted","departNameCnO":"总部/信息技术部/IT开发部","departNameEnO":"Headquarter/ IT Dept./IT Dev. Dept.","principalO":"陈俊堂","DeptFunctionCNO":"部门定位：XXX\r\n1. 职能总结（2-8字短语）\r\n详细描述（1-3句话）\r\n2. XXX\r\nxxxx","DeptFunctionENO":"Department Position：XXX\r\n1. Function conclusion（a phrase with 2 -8 words)\r\nDetailed function (1-3 sentence)\r\n2. XXX\r\nxxxx","departNameCnU":"总部/信息技术部/IT管理部","departNameEnU":"Headquarter/ IT Dept./IT Management Dept.","principalU":"陈俊堂","DeptFunctionCNU":"部门定位：XXX\r\n1. 职能总结（2-8字短语）\r\n详细描述（1-3句话）\r\n2. XXX\r\nxxxx","DeptFunctionENU":"Department Position：XXX\r\n1. Function conclusion（a phrase with 2 -8 words)\r\nDetailed function (1-3 sentence)\r\n2. XXX\r\nxxxx"},{"type":"新增added","departNameCnO":null,"departNameEnO":null,"principalO":null,"DeptFunctionCNO":null,"DeptFunctionENO":null,"departNameCnU":"总部/信息技术部/信息保密处","departNameEnU":"Headquarter/ IT Dept./Information Security Dept.","principalU":"陈俊堂","DeptFunctionCNU":"部门定位：XXX\r\n1. 职能总结（2-8字短语）\r\n详细描述（1-3句话）\r\n2. XXX\r\nxxxx","DeptFunctionENU":"Department Position：XXX\r\n1. Function conclusion（a phrase with 2 -8 words)\r\nDetailed function (1-3 sentence)\r\n2. XXX\r\nxxxx"},{"type":"删除deleted","departNameCnO":"总部/信息技术部/IT运维部","departNameEnO":"Headquarter/ IT Dept./IT Operation Dept.","principalO":"陈俊堂","DeptFunctionCNO":"部门定位：XXX\r\n1. 职能总结（2-8字短语）\r\n详细描述（1-3句话）\r\n2. XXX\r\nxxxx","DeptFunctionENO":"Department Position：XXX\r\n1. Function conclusion（a phrase with 2 -8 words)\r\nDetailed function (1-3 sentence)\r\n2. XXX\r\nxxxx","departNameCnU":null,"departNameEnU":null,"principalU":null,"DeptFunctionCNU":null,"DeptFunctionENU":null}],
      dataTable: {
            view: "datatable",		// 渲染的格式
            container: "mytable",	// 渲染区的容器
            id: "mytable",			// 必须，与渲染的容器的id相对应
            autoheight: true,
            fixedRowHeight:false,
            rowLineHeight:34, 
            rowHeight:34,
            editable: true, 	// 可编辑	
            editaction: "dblclick",	// 双击可编辑	
            select: "row",			// 点击选择行
            multiselect: true,		// 行多选
            resizeColumn: true,		// 列的宽度可拖动
            resizeRow:true,
            leftSplit: 1,			// 冻结第一列
            scorllX:true,
            tooltip:true,			// 鼠标悬浮提示框
            // columns: this.columns,
		}
    };
  },
  methods: {
    confirm(e) {
        webix.toExcel($$("mytable"), {
            styles:true,
            spans:true
        });
        // http://cdn.webix.com/extras/xlsx.core.min.js
        // http://cdn.webix.com/extras/xlsx.core.styles.min.js
    },
    refresh() {
        this.columns = [				// 渲染的列
                { id: "type", editor: "text", header: [{ text: '编辑', css: { "text-align": "center" } }], width: 60, css: { "text-align": "center" } },
                { id: "departNameCnO", editor: "popup", header: [{ text: '调整前', colspan: 5, css: { "text-align": "center" } }, '中文名'], width:100,}, //合并单元格 100
                { id: "departNameEnO", editor: "text", header: ['', '英文名'],width:100 }, //100
                { id: "principalO", editor: "text", header: ['', '负责人'] },
                { id: "DeptFunctionCNO", editor: "popup", header: ['', '职能'], width:150 },
                { id: "DeptFunctionENO", editor: "popup", header: ['', '职能英文'], width:100}, //100
                // { id: "officeAreaO", editor: "text", header: ['', messService.getMess("com.hytera.org.OfficeArea")] },
                { id: "departNameCnU", editor: "popup", header: [{ text: "调整后", colspan: 5, css: { "text-align": "center" } }, '中文名'],width:100 }, //100
                { id: "departNameEnU", editor: "text", header: ['', '英文名'],width:100 }, //100
                { id: "principalU", editor: "text", header: ['', '负责人'] },
                { id: "DeptFunctionCNU", editor: "popup", header: ['', '职能'], width:150 },
                { id: "DeptFunctionENU", editor: "popup", header: ['', '职能英文'], width:100 }, //100
                // { id: "officeAreaU", editor: "text", header: ['', messService.getMess("com.hytera.org.OfficeArea")] },
        ];
        $$("mytable").define("columns", this.columns);
        $$("mytable").define("data", this.talbleData);
        $$('mytable').refresh();
    }
  }
};
</script>