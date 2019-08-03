<template>
  <div>
    <div class="cascader-wrap">
      <button @click="toggle" type="button"
        class="el-button button__wrap ellipsis"
        :disabled="disabled"
        :class="{isActive: open}">
        test
        <i class="icon el-select__caret el-input__icon el-icon-arrow-up"></i>
      </button>
      <!-- 下拉框模拟 -->
      <div v-show="open" class="cascader-dropdown">
        <!-- 已选择 -->
        <div></div>
        <div class="cascader-list">
          <ul>
            <li v-for="item in options" :key="item.value" class="cascader-menu">{{item.label}}</li>
          </ul>
        </div>
      </div>
      {{value}}
    </div>
  </div>
</template>

<script>
import basicOption from './region.json';
export default {
  name: 'cascader',
  props: {
    options: {
      type: Array,
      // default: () => []
      default: () => basicOption.data
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 这个用于自定义组件上使用v-model语法糖
    value: {
      required: false
    },
    placeholder: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    toggle() {
      this.open = !this.open;
      this.$emit('input', this.open);
    }
  },
  created() {
    console.log(this.options);
  }
};
</script>

<style lang="less" scoped>
  .cascader-wrap {
    position: relative;
    .button__wrap {
      position: relative;
      width: 100%;
      height: 42px;
      padding: 0 20px;
      line-height: 40px;
      border: 1px solid @line-color;
      background: none;
      color: @font-light;
      transition: all 0.3s;
      .icon {
        position: absolute;
        transform: rotateZ(180deg);
        right: 5px;
      }
    }
    .button__wrap.isActive {
      border-color: @blue-light;
      .icon {
        transform: rotateZ(0);
      }
    }
    .cascader-dropdown {
      margin: 5px 0;
      height: 200px;
      overflow: auto;
      font-size: 14px;
      background-color: #fff;
      border: 1px solid #E4E7ED;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      .cascader-menu {
        cursor: pointer;
        height: 34px;
        line-height: 34px;
        padding: 0 30px 0 20px;
      }
    }
  }
</style>
