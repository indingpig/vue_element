<template>
  <div id="add-menu">
      <formio :form="formConfig" ></formio>
  </div>
</template>

<script>
    import { Form } from 'vue-formio';
    export default {
        data() {
            return {
                msg: 'hahah',
                formConfig: {} // 表单构建器的值
            }
        },
        name: 'formComponent',
        components: {
            'formio': Form 
        },
        methods: {
            getFormConfig() {
                this.formConfig = JSON.parse(localStorage.getItem('formConfig'));
            },
            submitForm() {

            }
        },
        beforeMount() {
            this.getFormConfig();
        },
    }
</script>