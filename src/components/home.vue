<template>
  <div id="home" class="baseBackground" v-on:touchstart="moveStart($event)" v-on:touchmove="move($event)" 
        v-on:touchend="moveEnd($event)">
    <div class="homeBody" :style="changeStyle" :class="{contentTran: reboundTran}">
        <user class="sidebar" name="sidebar" v-on:hideCenter="hideSidebar"></user>
        <keep-alive include="newsList">
          <router-view class="main"  v-on:showCenter="showSidebar"></router-view>
        </keep-alive>
    </div>
    <div class="maskLayer" :class="{showMask: sidebarState}" v-on:click="hideSidebar"></div>
  </div>
</template>

<script>
import userCenter from '@/components/userCenter'

export default {
  name: 'home',
  components: {
    'user': userCenter,
  },
  data () {
    return {
      contentX: '0',         // ".content" 元素的X轴偏移量
      reboundTran: false,    // 是否开启回弹过渡
      sidebarWidth: 0,       // 侧边栏的宽度
      sidebarState: false,   // 是否显示侧边栏
      changeStyle: {
        transform: 'translate3d(0, 0, 0)'
      },
      startX: 0,
      startY: 0,
    }
  },  
  watch: {
    sidebarState: function(newVal) {
      this.contentX = newVal ? this.sidebarWidth : 0;   // 根据侧边栏的显隐状态自动更改页面偏移量
    },
    contentX: function() {
      this.changeStyle = {
        transform: 'translate3d(' + this.contentX + 'px, 0px, 0px)' 
      } 
    }
  },
  mounted: function() {
     this.sidebarWidth = document.getElementsByClassName("sidebar")[0].offsetWidth;
  },
  methods: {
    showSidebar: function() {
      this.sidebarState = true;
      this.reboundTran = true;
    },
    hideSidebar: function() {
      this.sidebarState = false;
      this.reboundTran = true;
    },
    moveStart: function(e) {
      const target = e.touches[0];
      this.startX = target.clientX;
      this.startY = target.clientY;
    },
    move: function(e) {
      const target = e.touches[0];
      const disX = target.clientX - this.startX;
      const disY = target.clientY - this.startY;
     
      // 拖动时不添加过渡效果
      this.reboundTran = false;

      // 侧边栏隐藏时只能向右水平移动
      if (!this.sidebarState && disX > 0 && Math.abs(disY) < 10) {
        this.contentX = disX;
      }   
      // 侧边栏显示时只能向左移动
      if (this.sidebarState && disX < 0 ){ 
        e.preventDefault();
        this.contentX = this.sidebarWidth + disX;
      }

      // 确保移动到边界后不能超出边界地继续移动
      if (this.contentX < 0) {
        this.contentX = 0;
        this.sidebarState = false;
      }else if (this.contentX > this.sidebarWidth) {
        this.contentX = this.sidebarWidth;
        this.sidebarState = true;
      }
    },
    moveEnd: function(e) {
      if(this.contentX == 0) return;
      if (this.contentX <= this.sidebarWidth * 2/3) {
        this.contentX = 0;
        this.hideSidebar();
      }else {
        this.contentX = this.sidebarWidth;
        this.showSidebar();
      }
    }
  }
}
</script>

<style lang="less">
.homeBody {
  width: calc(167vw);
  height: calc(100vh);
  display: flex;
  margin-left: -67vw;
  z-index: 99;  
  .sidebar {
    flex: 2;
  }
  .main {
    transition: all 0.8s;
    flex: 3;
  }
}
.maskLayer {
  position: absolute;
  top: 0;
  width: calc(100vw);
  height: 100%;
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
  z-index: 1000;
}
.contentTran {
  transition: all 0.5s;
}
.showMask{
  -webkit-transform: translate3d(66.6%, 0, 0);
  transform: translate3d(66.6%, 0, 0);
}
</style>
