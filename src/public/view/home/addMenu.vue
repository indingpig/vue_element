<template>
  <div id="add-menu">
      <el-button type="primary" plain @click="confirm">确定</el-button>
      <formbuilder :form="formConfig" :options="{}"></formbuilder>
      <!-- form 绑定的是表单构建器里各个组件的值，可以保存到后台 -->
  </div>
</template>

<script>
    import { FormBuilder } from 'vue-formio';
    export default {
        data() {
            return {
                msg: 'hahah',
                formConfig: {} // 表单构建器的值
            }
        },
        // name: 'add-menu',
        components: {
            'formbuilder': FormBuilder 
        },
        methods: {
            confirm() {
                localStorage.setItem('formConfig', JSON.stringify(this.formConfig));
            }
        }
    }
    // import { FormBuilder } from 'vue-formio';
    // export default {
    //     name: 'app',
    //     components: {
    //         'formbuilder': FormBuilder 
    //     },
    // }
</script>