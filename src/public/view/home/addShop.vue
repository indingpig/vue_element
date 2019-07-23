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
      <el-form-item label="地址" v-once>
        <el-cascader
          v-model="value4"
          :options="region"
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="地址1" v-once>
        <el-cascader
          v-model="value5"
          :options="region"
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="地址3" v-once>
        <el-cascader
          v-model="value1"
          :options="region"
          @change="handleChange"></el-cascader>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import region from '../../../assets/region.json';
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
    this.getSelect();
    console.log(region);
  }
};
</script>

<style>

</style>
