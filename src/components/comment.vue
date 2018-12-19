<template>
  <div class="comment baseBackground">
    <!-- 页面头部 -->
    <div class="title baseTitle">{{all}}条点评</div>
    <!-- 长评论 -->
    <div v-if="longComments.length != 0">
      <div id="long" class="commentItem baseFontColor baseBorder">{{long}}条长评</div>
      <ul>
        <li class="baseBorder" v-for="(item, index) in longComments" :key="index">
          <div class="userLogo">
            <img :src="item.logo">
          </div>
          <div class="commContent baseFontColor1">
            <p class="name">{{item.author}}</p>
            <p class="detail">{{item.content}}</p>
            <p class="time">{{item.time}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="noData">深度长评虚位以待</div>
    <!-- 短评论 -->
    <div v-if="shortComments.length != 0">
      <div id="short" class="commentItem baseFontColor baseBorder" >{{short}}条短评
        <router-link :to="{path: originPath +'#short'}" replace>
          <i class="iconfont icon-xiangxiajiantou baseFontColor1" v-if="!showShortComm" @click="showShortComm = true"></i>
        </router-link>
        <router-link :to="{path: originPath +'#long'}" replace>
          <i class="iconfont icon-xiangshangjiantou baseFontColor1" @click="showShortComm = false" v-if="showShortComm"></i>  
        </router-link>
      </div>
      <ul v-show="showShortComm">
        <li class="baseBorder" v-for="(item, index) in shortComments" :key="index">
          <div class="userLogo">
            <img :src="item.logo">
          </div>
          <div class="commContent baseFontColor1">
            <p class="name">{{item.author}}</p>
            <p class="detail">{{item.content}}</p>
            <p class="time">{{item.time}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="noData">还没有短评论</div>
    <!-- 页面底部 -->
    <div class="commFooter">
      <i class="iconfont icon-shangyiye" v-on:click="$router.go(-1)"></i>
      <span v-on:click="$toast('该功能尚未实现')">写评论</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'comment',
  data () {
    return {
      originPath: this.$route.fullPath,
      id: '',
      all: '',
      long: '',
      short: '',
      showShortComm: false,
      longComments: [],
      shortComments: [],
    }
  },
  mounted () {
    let query = this.$route.query;
    this.id = query.id;
    this.all = query.all;
    this.long = query.long;
    this.short = query.short;
    this.getLongComm();
    this.getShortComm();
  },
  methods: {
    getLongComm () {
      if(!this.id) return;
      let self = this;
      this.$ajax.get('api/4/story/' + this.id + '/long-comments' )
      .then(function (res){
        console.log(res);
        if(res.status != 200) {
          return self.$toast(res.statusText);
        }
        let comments = res.data.comments;
        comments.forEach((item, index) => {
          let timeObj = self.parseTime(item.time);
          let obj = {
            author: item.author,
            content: item.content,
            time: timeObj.month + '-' + timeObj.day + ' ' + timeObj.time,
            logo: item.avatar,
          }
          self.longComments.push(obj);
        })
      })
      .catch(function (err) {
        console.log(err);
        return self.$toast('出错啦！请检查网络环境');
      })
    },
    getShortComm () {
      if(!this.id) return;
      let self = this;
      this.$ajax.get('api/4/story/' + this.id + '/short-comments')
      .then(function (res){
        console.log(res);
        if(res.status != 200) {
          return self.$toast(res.statusText);
        }
        let comments = res.data.comments;
        comments.forEach((item, index) => {
          let timeObj = self.parseTime(item.time);
          let obj = {
            author: item.author,
            content: item.content,
            time: timeObj.month + '-' + timeObj.day + ' ' + timeObj.time,
            logo: item.avatar,
          }
          self.shortComments.push(obj);
        })
      })
      .catch(function (err) {
        console.log(err);
        return self.$toast('出错啦！请检查网络环境');
      })
    }
  }
}
</script>

<style scoped lang="less">
.comment {
  min-height: 100vh;
  letter-spacing: 3px; /*no*/
  margin-bottom: 74px;
  .title {
    width: 100%;
    height: 80px;
    line-height: 80px;
    padding-top: @topbarHeight;
    font-size: 40px;
    text-align: center;
  }
  .commentItem {
    font-size: 35px;
    padding: 25px;
    a {
      display: inline-block;
      width: auto;
      float: right;
    i {
      font-size: 40px;
    }
    }
  }
  .userLogo {
    display: inline-block;
    box-sizing: border-box;
    padding: 25px;
    width: 20%;
    vertical-align: top;
    img {
      width: 100%;
      border-radius: 50%
    }
  }
  .commContent {
    box-sizing: border-box;
    display: inline-block;
    width: 78%;
    padding: 10px 20px 10px 0;
    p {
      margin: 20px 0 !important;
      letter-spacing: 2px;
    }
    .name {
      font-size: 35px;
      font-weight: bold;
    }
    .detail {
      font-size: 30px;
      overflow: hidden;
    }
    .time {
      font-size: 25px;
    }
  }
  .commFooter {
    position: fixed;
    bottom: 0;
    width: 100%;
    line-height: 74px;
    display: flex;
    text-align: center;
    font-size: 28px;
    background: #51524d;
    color: #eee;
    i {
      flex: 1;
      font-size: 48px;
      border-right: 1px solid #eee;
    }
    span {
      flex: 9;
    }
  }
}

.noData {
  font-size: 30px;
  line-height: 200px;
  color: #999;
  text-align: center;
}
</style>
