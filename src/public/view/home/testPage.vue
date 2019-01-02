<template>
    <div>
        <div style="margin-left: 5px;">
            <el-button type="primary" plain @click="queryData">请求数据</el-button>
            <el-button type="primary" plain @click="refresh">刷新</el-button>
            <div></div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      time: 0,
      data1: {},
      data2: {}
    };
  },
  methods: {
    async queryData() {
      console.time();
      let v1 = await axios.get("/api/query/vue/getTextPage?time=1000");
      let v2 = await axios.get("/api/query/vue/getTextPage?time=" + v1.data);
      console.log(`${v1.data} ---------${v2.data}`);
      console.timeEnd();
    },
    refresh() {
      // this.queryData();
      // let testPoint = this.test(123,456789);
      // console.log(testPoint.toString());
      // this.test();
      let that = this;
      axios.get("/api/test1")
        .then((_data) => {
          that.data1 = _data.data;
          that.data2 = _data.data;
          that.data2.a = 2;
          debugger;  
        });
    },
    test(_x, _y) {
      // console.log(this.dedupe([1,1,1,2,3,3,1,2,5,3,{},{}]))
      // let arry = [1,2,31,1,2,3];
      // let aar = new Set(arry);
      // arry.forEach((val, key) => console.log(`${val}:${key}`));
      // aar.forEach((_val, _key) => console.log(`${_val}:${_key}`));
      //   class Point {
      //     constructor(x, y) {
      //       this.x = x;
      //       this.y = y;
      //     }
      //     toString() {
      //       return `${this.x} + ${this.y}`;
      //     }
      //   }
      //   // return new Point(_x, _y);
      //   function foo(_xyz) {
      //     bar.call(this, _xyz);
      //   }
      //   function bar(_item) {
      //     console.log(_item);
      //   }
      //   foo("hello world");
      var data = [
        { id: 1, name: "安徽", key: 1 },
        { id: 2, name: "江苏", key: 2 },
        { id: 3, name: "合肥", pid: 1, key: 3 },
        { id: 4, name: "庐阳区", pid: 3, key: 4 },
        { id: 5, name: "大杨镇", pid: 4, key: 5 },
        { id: 6, name: "南京", pid: 2, key: 6 },
        { id: 7, name: "玄武区", pid: 6, key: 7 },
        { id: 8, name: "梅园新村街道", pid: 7, key: 8 },
        { id: 9, name: "上海", key: 9 },
        { id: 10, name: "黄浦区", pid: 9, key: 10 },
        { id: 11, name: "外滩", pid: 10, key: 11 },
        { id: 12, name: "安庆", pid: 1, key: 12 }
      ];
      treeUtils();
      function sonsTree(obj, arr) {
        var children = new Array();
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].pid == obj.id) {
            //pid等于加入数组
            sonsTree(arr[i], arr); //递归出子元素
            arr[i].pname = obj.name;
            children.push(arr[i]);
          }
        }
        if (children.length > 0) {
          obj.children = children;
        }
        return obj;
      }

      function treeUtils() {
        let ptree = [];
        let tree = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].pid == null) {
            //获取父元素
            let o = sonsTree(data[i], data);
            ptree.push(o);
          }
        }
        console.info(ptree);
        return ptree;
      }
    },
    dedupe(_arry) {
      return Array.from(new Set(_arry));
    }
  },
  mounted() {}
};
</script>

