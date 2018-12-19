<template>
  <div class="newsList baseFontColor " 
      v-on:scroll="changeTopTitle($event)" v-on:touchstart="moveStart($event)"  v-on:touchend="moveEnd($event)">
    <div class="topTitle">
       <div class="topTitleBG  baseTitle" :style="{opacity: topOpacity}"></div>
       <i class="iconfont icon-mulu" v-on:click="showSidebar"></i>
       <mt-spinner class="update" type="fading-circle" :size="20" v-if="updateData"></mt-spinner>
       <span class="titleContent">{{topTitle}}</span>
    </div>
    <div class="topSwiper">
      <mt-swipe :stopPropagation="true" :auto="0">
          <mt-swipe-item v-for="(item, index) in topStories" :key="index">
            <router-link :to="{ name: 'articleDetail', query: { id: item.id, type: 0 }} ">
              <img :src="item.image" width="100%">
              <div class="imgTitle">{{item.title}}</div>
            </router-link>
          </mt-swipe-item>
       </mt-swipe>
    </div>
    <div class="dailyContent">
       <div class="dailyList">
         <div class="date baseTitle" style="display: none">今日新闻</div>
         <ul>
           <li class="baseBorder" v-for="(item, index) in todayStories" :key="index">
             <router-link class="baseFontColor" :data-id="item.id" :to="{ name: 'articleDetail', query: { id: item.id, type: 1 }}">
               <span>{{item.title}}</span>
               <img :src="item.image">
            </router-link>
           </li>
         </ul>
       </div>
       <div class="dailyList" v-for="(item, index) in beforeStories" :key="index">
         <div class="date baseTitle">{{item.dateStr}}</div>
         <ul>
           <li class="baseBorder" v-for="item in item.stories" :data-id="item.id">
             <router-link class="baseFontColor" :data-id="item.id" :to="{ name: 'articleDetail', query: { id: item.id, type: 1}}">
             <span>{{item.title}}</span>
             <img :src="item.image">
             </router-link>
           </li>
         </ul>
       </div>
    </div>
  </div>
</template>

<script>
  import { Swipe, SwipeItem, Spinner} from 'mint-ui';
  export default {
    name: 'newsList',
    components: {
      'mt-swipe': Swipe,
      'mt-swipe-item': SwipeItem,
      'mt-spinner': Spinner,
    },
    data () {
      return {
        topTitle: "今日新闻",
        topOpacity: 0,      // 顶部标题栏的背景透明度
        newsListDom: null,  // 新闻列表页 Dom 节点
        
        currentDom: null,  
        currentTop: 0,
        nextDom: null,
        nextTop: 0, 
        nextIndex: 1,

        today: '',         // 今天的日期
        topStories: [],    // 顶部轮播图内容
        todayStories: [],  // 今日内容列表
        beforeStories: [], // 过往消息列表
        flag: true, 
       
        updateData: false, // 是否显示顶部加载圈
        updateFlag: false, // 是否到达页面顶部才进行下拉动作
        touchStartY: 0,
        touchEndY:0,
      }
    },
    mounted () {
      this.newsListDom = document.querySelector(".newsList");
      this.currentDom = document.getElementsByClassName("date")[0];
      this.currentTop = this.currentDom.offsetTop;
      this.getLatestData(0);
    },
    activated () {
      this.newsListDom.scrollTop = this.$store.state.listPosition;
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('setListPosition',this.newsListDom.scrollTop);
      next();
    },
    methods: {
      showSidebar () {
        this.$emit("showCenter");
      },
      moveStart (e) {
        if(this.newsListDom.scrollTop != 0) return;
        this.updateFlag = true;
        this.touchStartY = e.touches[0].clientY;
      },
      moveEnd (e) {
        if(!this.updateFlag) return;
        this.updateFlag = false;
        this.touchEndY = e.changedTouches[0].clientY;
        if((this.touchEndY - this.touchStartY) < 50) return;
        this.updateData = true;
        this.getLatestData(1);
      },
      changeTopTitle (e) {
        let top = e.target.scrollTop;
        let proportion = top / 250 ;

        // 顶部标题栏显隐，修改透明度
        this.topOpacity = proportion < 1 ? proportion : 1; 

        // 向上滚动到上一个列表 
        let currentDist = this.currentTop - top;
        if (currentDist > 30) {   
          this.nextIndex --;
          this.gotoPrev();
        }

        // 向下滚动到下一个列表
        let nextDist = this.nextTop - top;
        // 下一个列表还未加载 
        if (this.nextDom == null){
          if(this.flag){  
            //  防止多次请求
            this.flag = false;  
            this.getBeforeData();
          }
          return;
        }
        // 下一个列表已加载完
        else if (nextDist < 30) {    
          this.topTitle = this.nextDom.innerHTML;
          this.nextIndex ++;
          this.gotoNext();
        }
      },
      gotoNext () {
        this.currentDom = this.nextDom;
        this.currentTop = this.nextTop;
        this.nextDom = document.getElementsByClassName("date")[this.nextIndex];
        this.nextTop = this.nextDom ? this.nextDom.offsetTop : '';
      },
      gotoPrev () {
        this.nextDom = this.currentDom;
        this.nextTop = this.currentTop;
        this.currentDom = document.getElementsByClassName("date")[this.nextIndex - 1];
        this.currentTop = this.currentDom.offsetTop;
        this.topTitle = this.currentDom.innerHTML; 
      },
      // type: 0 -- 第一次进入页面请求； 1 -- 刷新请求
      getLatestData (type) {
        let self = this;
        let newsIdList = [];
        let topNewsIdList = [];
        let orignLength = this.todayStories.length;

        this.$ajax.get('api/4/news/latest')
        .then(function (res) {
          self.updateData = false;
          if(res.status != 200){
            return self.$toast(res.statusText);
          }
          self.today = res.data.date;

          // 顶部轮播图数据
          self.topStories = [];
          res.data.top_stories.forEach(function (item, index) {
            let obj = {};
            obj.id = item.id;
            obj.title = item.title;
            obj.image = item.image;
            self.topStories.push(obj);
            topNewsIdList.push(item.id);
          })
          // 今日内容数据
          self.todayStories = [];
          res.data.stories.forEach(function (item, index) {
            let obj = {};
            obj.id = item.id;
            obj.title = item.title;
            obj.image = item.images[0];
            self.todayStories.push(obj);
            newsIdList.push(item.id);  
          })

          // 清空 $store 顶部新闻ID序列组, 重新更新
          self.$store.commit('clearTopIdList');
          self.$store.commit('setTopNewsIdList', topNewsIdList);

          // type = 0: 清空 $store 新闻ID序列组, 重新更新
          // type = 1: $store 新闻ID序列组中今日新闻部分, 其余不动
          if (type == 0) {
            self.$store.commit('clearNewsIdList');
            self.$store.commit('addNewsIdList', newsIdList);
          }else if (type == 1) {
            self.$store.commit('updateNewsIdList',{orignLength, newsIdList});
          }
          
        })
        .catch(function (err) {
          console.log(err);
          self.updateData = false;
          self.$toast("出错啦！请检查网络环境");
        });
      },
      getBeforeData () {
        let nextDay = this.getNextDay();
        let newsIdList = [];
        let self = this;

        this.$ajax.get('api/4/news/before/' + nextDay)
        .then(function (res) {
          console.log(res);
          if(res.status != 200){
            self.flag = true;
            return self.$toast(res.statusText);
          }

          // 当前日期列表数据加载
          let result = {
            date: res.data.date,
            dateStr: self.dateString(res.data.date),
            stories: []
          }
          res.data.stories.forEach(function (item, index) {
            let obj = {};
            obj.id = item.id;
            obj.title = item.title;
            obj.image = item.images[0];
            result.stories.push(obj);
            newsIdList.push(item.id);
          })
          self.beforeStories.push(result);
          self.$store.commit('addNewsIdList', newsIdList);

          // 更新当前显示列表的下一个列表的相关数据
          setTimeout(function() {
            if(!self.nextDom) {
              self.nextDom = document.getElementsByClassName("date")[self.nextIndex];
              self.nextTop = self.nextDom.offsetTop;
              self.flag = true;
            }
          }, 100)
        })
        .catch(function (err) {
          console.log(err);
          self.flag = true;
        });
      },
      getNextDay () {
        let length = this.beforeStories.length;
        return (length != 0 ? this.beforeStories[length - 1].date : this.today);
      },
      dateString (date) { 
        // date 格式为 "20181110"  =>  返回 11月11日 星期六  
        let week = ["日","一","二","三","四","五","六"];
        date = new Date( date.slice(0,4) + '-' + date.slice(4,6) + '-' + date.slice(6,8) );
        return (date.getMonth() + 1) + "月" + date.getDate() + "日" + "   星期" + week[date.getDay()];
      }
    }
  }
</script>

<style lang="less">
  .newsList {
    height: 100vh;
    overflow: scroll;
    overflow-scrolling: touch;
    .topTitle {
      position: fixed;
      top: 0;
      z-index: 5;
      width: 100vw;
      height: 60px;
      padding-top: @topbarHeight; 
      text-align: center;
      color: #fff;
      .topTitleBG {
        position: fixed;
        top: 0;
        z-index: -1;
        height: 59px + @topbarHeight;
        width: 100%;
      }
      .iconfont {
        float: left;
        font-size: 40px;
        padding: 0 30px;
      }
      .titleContent {
        width: 270px;
        font-size: 35px;
        position: absolute;
        left: 32%;
      }
      .update {
        display: inline-block;
        margin-left: 135px;
        float: left;
      }
    }
    .topSwiper {
      width: 100vw;
      height: 260px; /*no*/
      img {
         margin-top: -10vw;
      }
      .imgTitle {
        color: #fff;
        font-size: 48px;
        position: absolute;
        bottom: -5px;
        padding: 0 30px 40px 30px;
        background: linear-gradient(rgba(255,255,255,0), rgba(0,0,0,0.5));
      }
    }
    .dailyContent {
      font-size: 35px;
      .dailyList {
        .date {
          text-align: center;
          line-height: 65px;
        }
        ul {
          padding: 0 30px;
          li {
            padding-top: 20px;
            height: 140px;
            font-size: 30px;
            img {
              float: right;
              width: 140px;
              height: 120px;
            }
            span {
              width: 70%;
              display: inline-block;
            }
          }
        }
      }
    }
  }

  a {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .dailyList li:last-child {
    border: 0;
  } 
</style>
