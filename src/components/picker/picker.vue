<template>
  <div class="pick_wraper" v-if="data[radioName + 'Showflag']"> 
    <!-- data[radioName + 'Showflag'] 用于识别指定的组件 -->
    <div class="checkShade">
      <div class="checkShade_main">
        <div class="checkShade_warp"></div>
        <div class="checkShade_content">
          <div class="checkShade_con_top">
            <div class="checkShade_cancel" @touchend="checkShade_cancel">
              <img :src="shade_cancel" alt="">
            </div>
            <div class="checkShade_userType">
              <span>{{title}}</span>
            </div>
          </div>
          <div class="checkShade_con_con_wrap">
            <div class="checkShade_con_con check_list">
              <div v-for="(item, index) of checkList" :key="index" class="check_item">
                <input type="radio" :name="radioName" :id="'radio'+index"
                  v-on:input="$emit('input', $event.target.value)"
                  :value="item.value" :checked="item.value === value">
                <label :for="'radio'+index"><span>{{item.name}}</span></label>
              </div>
            </div>
          </div>
          <div class="checkShade_con_buttom" @touchend="checkShade_confirm">
            <span>确定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shade_cancel: require('@/assets/shade_close_2@2x.png'),
      checkedList: '',
      data: {},
      // 保存父组件传进来的值，点击取消的时候有用
      defaltValue: this.value
    }
  },
  methods: {
    hide() {
      // 由于没有在data函数中初始化值，使用$set函数添加属性，动态识别隐藏指定的picker
      this.$set(this.data, `${this.radioName}Showflag`, false);
    },
    checkShade_cancel() {
      this.hide();
      // 取消的时候，将默认值传给父组件
      this.$emit('input', this.defaltValue);
    },
    checkShade_confirm() {
      this.hide();
    },
    show() {
      // 由于没有在data函数中初始化值，使用$set函数添加属性
      this.$set(this.data, `${this.radioName}Showflag`, true);
    }
  },
  props: {
    checkList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // value 默认绑定父组件调用子组件的v-model的值
    value: {
      type: [String, Number]
    },
    title: {
      type: String,
      default: () => {
        return '';
      }
    },
    radioName: {
      type: String,
      default: () => {
        return '';
      }
    },
    radioId: {
      type: String,
      default: () => {
        return 'radioId'
      }
    }
  },
  mounted() {
    // 默认关闭
    this.hide();
    
  },
  watch: {
    'defaltValue': (_n) => {
      console.log(_n);
    }
  }
};
</script>

<style lang="scss">
  @import '@/lib/reset.scss';
  .pick_wraper .checkShade{
    @include rect(100%, 100%);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    .checkShade_main {
      @include rect(100%, 100%);
      position: relative;
      .checkShade_warp {
        // 遮罩层
        @include rect(100%, 100%);
        @include background-color(#333);
        position: absolute;
        top: 0;
        left: 0;
        opacity: .4;
      }
      .checkShade_content {
        @include rect(100%, 3.74rem);
        @include background-color(#F0F4F7);
        @include flexbox();
        @include flex-direction(column);
        position: absolute;
        bottom: 0;
        left: 0;
        .checkShade_con_top {
          @include rect(100%, .49rem);
          @include background-color(#fff);
          @include flexbox();
          @include justify-content(center);
          @include align-items(center);
          position: relative;
          .checkShade_cancel {
            position: absolute;
            top: 0;
            left: 0;
            @include rect(.45rem, 100%);
            @include flexbox();
            @include justify-content(center);
            @include align-items(center);
            img {
              @include rect(.15rem, .15rem);
            }
          }
        }
        .checkShade_con_con_wrap {
          padding: .1rem 0;
          overflow: hidden;
          flex: 1;
          .check_list {
            position: relative;
            overflow: auto;
            input[type="radio"] {
              display: none;
              position: relative;
            }
            input[type="radio"] + label::after{
              content: "\a0"; /*不换行空格*/
            }
            input[type="radio"]:checked + label::after {
              @include rect(.18rem, .13rem);
              display: inline-block;
              background-image: url(../../assets/ic_selected_3@2x.png);
              background-repeat: no-repeat;
              background-size: .18rem;
            }
            .check_item {
              label {
                @include rect(100%, .49rem);
                @include background-color(#fff);
                border-bottom: 1px solid #D3D3D3;
                padding: 0 .15rem;
                @include flexbox();
                @include justify-content(space-between);
                @include align-items();
                span {
                  @include rect(98%, auto);
                }
              }
            }
          }
        }
        .checkShade_con_buttom {
          @include rect(100%, .49rem);
          @include background-color(#fff);
          @include flexbox();
          @include justify-content();
          @include align-items();
          span {
            @include text-color(#4fbfbd);
            @include font-size(.16rem); 
          }
        }
      }
    }
  }
</style>
