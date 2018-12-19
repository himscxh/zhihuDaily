<template>
  <div class="userCenter sideBackground">
    <div class="centerHead">
      <img class="userLogo" src="../assets/images/logo.jpg">
      <span class="userName">请登录</span>
    </div>
    <div class="centerOption">
      <div class="optItem collect">
        <i class="iconfont icon-shoucang"></i>
        <span class="title">收藏</span>
      </div>
      <div class="optItem collect">
        <i class="iconfont icon-tishi"></i>
        <span class="title">消息</span>
      </div>
      <div class="optItem collect">
        <i class="iconfont icon-shezhi2"></i>
        <span class="title">设置</span>
      </div>
    </div>
    <div class="theme">
      <div class="themeItem sideSelected" v-on:click="hideSidebar">
        <i class="iconfont icon-shouye"></i>
        <span class="title">首页</span>
        <i class="iconfont icon-xiayiye toTarget" ></i>
      </div>
    </div>
    <div class="centerFoot">
      <div class="footItem">
        <i class="iconfont icon-Group-1"></i>
        <span class="title">离线</span>
      </div>
      <div class="footItem" @click="changeStyle">
        <i class="iconfont icon-taiyang" v-if="$store.state.theme != 'dayTime'"></i>
        <i class="iconfont icon-yueliang" v-else></i>
        <span class="title">{{$store.state.theme == 'dayTime' ? '夜间' : '日间'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userCenter',
  data () {
    return {
      
    }
  },
  methods: {
    changeStyle () {
     this.$store.commit('setTheme');
    },
    hideSidebar () {
      this.$emit('hideCenter');
    }

  }
}
</script>

<style scoped lang="less">
.userCenter {
  padding-top:  @topbarHeight;
  color: #d2c7c7;
  letter-spacing: 1px;
  .centerHead {
    .userLogo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 35px;
      vertical-align: middle;
      background: #fff;
    }
    .userName {
      font-size: 30px;
    }
  }
  .centerOption {
    margin: 20px 0;
    .optItem {
      padding: 0 35px;
      width: 60px;
      font-size: 16px;
      display: inline-block;
      text-align: center;
      .iconfont {
        font-size: 45px;
        display: inline-block;
        padding-bottom: 5px;
      }
    }
  }
  .theme {
    .themeItem {
      line-height: 80px;
      .iconfont {
        padding: 0 35px;
        font-size: 30px;
        vertical-align: middle;
      }
      .title {
        line-height: 30px;
        vertical-align: middle;
      }
      .toTarget {
        padding: 0 35px 0 150px !important;
        color: #d2c7c7 !important;
        font-size: 40px !important;
      }
    }
  }
  .centerFoot {
    position: fixed;
    bottom: 0;
    font-size: 30px;
    padding: 35px;
    .footItem {
      display: inline-block;
      padding-right: 30px;
      .iconfont {
        font-size: 50px;
        vertical-align: middle;
      }
      .title {
        vertical-align: middle;
      }
    }
  }
}


</style>
