<template>
  <div>
    <el-radio-group v-model="labelPosition" size="small">
      <el-radio-button label="left">左对齐</el-radio-button>
      <el-radio-button label="right">右对齐</el-radio-button>
      <el-radio-button label="top">顶部对齐</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px;"></div>
    <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
      <el-form-item label="名称">
        <!-- <el-select v-model="value1" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="活动区域">
        <!-- <el-select v-model="value2" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="活动形式">
        <!-- <el-select v-model="value3" placeholder="请选择">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="地址">
        <el-cascader
          v-model="value4"
          :props="props"
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="地址1">
        <el-cascader
          v-model="value5"
          :props="props1"
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="地址3">
        <el-cascader
          v-model="value1"
          :props="props2"
          @change="handleChange"></el-cascader>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import region from '../../../assets/region.json';
let id = 0;
export default {
  name: 'el-select-test',
  data() {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      region: region.data,
      api: '/api/query/selectAll',
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      options5: [],
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level, root } = node;
          const regionT = Array.from(region.data);
          setTimeout(() => {
            let region = [];
            if (root) {
              for(let i = 0; i < regionT.length; i++) {
                let obj = {
                  value: regionT[i].value,
                  label: regionT[i].label,
                  leaf: regionT[i].children === null
                }
                region.push(obj);
              }
              resolve(region);
              return;
            }
            const getChildren = arr => {
              arr.forEach(v => {
                  // v.isCheck && result.push(v.id);
                  if (v.parentCode === node.value) {
                    let obj = {
                      value: v.value,
                      label: v.label,
                      leaf: v.children === null
                    }
                    region.push(obj)
                  }
                  if (v.children instanceof Array) {
                    getChildren(v.children)
                  }
              });
            };
            getChildren(regionT);
            resolve(region);
          }, 300);
        }
      },
      props1: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level, root } = node;
          const regionT = Array.from(region.data);
          setTimeout(() => {
            let region = [];
            if (root) {
              for(let i = 0; i < regionT.length; i++) {
                let obj = {
                  value: regionT[i].value,
                  label: regionT[i].label,
                  leaf: regionT[i].children === null
                }
                region.push(obj);
              }
              resolve(region);
              return;
            }
            const getChildren = arr => {
              arr.forEach(v => {
                  // v.isCheck && result.push(v.id);
                  if (v.parentCode === node.value) {
                    let obj = {
                      value: v.value,
                      label: v.label,
                      leaf: v.children === null
                    }
                    region.push(obj)
                  }
                  if (v.children instanceof Array) {
                    getChildren(v.children)
                  }
              });
            };
            getChildren(regionT);
            resolve(region);
          }, 300);
        }
      },
      props2: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level, root } = node;
          const regionT = Array.from(region.data);
          setTimeout(() => {
            let region = [];
            if (root) {
              for(let i = 0; i < regionT.length; i++) {
                let obj = {
                  value: regionT[i].value,
                  label: regionT[i].label,
                  leaf: regionT[i].children === null
                }
                region.push(obj);
              }
              resolve(region);
              return;
            }
            const getChildren = arr => {
              arr.forEach(v => {
                  // v.isCheck && result.push(v.id);
                  if (v.parentCode === node.value) {
                    let obj = {
                      value: v.value,
                      label: v.label,
                      leaf: v.children === null
                    }
                    region.push(obj)
                  }
                  if (v.children instanceof Array) {
                    getChildren(v.children)
                  }
              });
            };
            getChildren(regionT);
            resolve(region);
          }, 300);
        }
      }
    };
  },
  methods: {
    getSelect() {
      axios.post(this.api)
        .then(_res => {
          this.options1 = _res.data;
          this.options2 = _res.data;
          this.options3 = _res.data;
          this.options4 = _res.data;
          this.options5 = _res.data;
        });
    },
    handleChange() {
      console.log(1);
    }
  },
  created() {
    // this.getSelect();
    console.log(region);
  }
};
</script>

<style>

</style>
