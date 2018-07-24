<template>
  <div id="add-menu">
      {{msg}}
      <formbuilder v-bind:form="{display: 'form'}" v-bind:options="{}"></formbuilder>
  </div>
</template>

<script>
    import { FormBuilder } from 'vue-formio';
    export default {
        data() {
            return {
                msg: 'hahah',
            }
        },
        name: 'add-menu',
        components: {
            'formbuilder': FormBuilder 
        },
    }
    // import { FormBuilder } from 'vue-formio';
    // export default {
    //     name: 'app',
    //     components: {
    //         'formbuilder': FormBuilder 
    //     },
    // }
</script>