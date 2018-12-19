<template>
  <div class="article baseBackground">
    <mt-loadmore 
        :bottomMethod="toNext" 
        :topMethod="toPrev" 
        :autoFill="false"
        :bottomAllLoaded="bottomAllLoaded"
        bottomPullText="载入下一篇"
        bottomDropText="载入下一篇"
        topPullText="载入上一篇"
        topDropText="载入上一篇"
        ref="loadmore"
    >
    <div class="currArticle" v-for="(item, index) in articles" :key="index">
      <div class="top">
          <img :src="item.image" width="100%">
          <div class="message">
            <div class="title">{{item.title}}</div>
            <div class="source">{{item.source}}</div>
          </div>
      </div>
      <div class="articleContent" v-html="item.content">
      </div>
    </div> 
    </mt-loadmore>
    <div class="blank"></div>
    <div class="footerNav baseBackground baseFontColor navBorder" >
      <i class="iconfont icon-shangyiye" v-on:click="$router.go(-1)"></i>
      <i class="iconfont icon-Group-" v-on:click="toNext"></i>
      <i class="iconfont icon-dianzan" v-on:click="$toast('该功能尚未实现')">
        <span>{{popularity}}</span>
      </i>
      <i class="iconfont icon-shoucang" v-on:click="$toast('该功能尚未实现')"></i>
      <i class="iconfont icon-tubiaopinglunshu" v-on:click="toComment">
        <span>{{comments}}</span>
      </i>
    </div>
  </div>
</template>

<script>
import {Loadmore} from "mint-ui"
export default {
  name: 'articleDetail',
  components: {
    'mt-loadmore': Loadmore
  },
  data () {
    return {
      id: '',       // 文章id
      type: 0,   // 0: 轮播图新闻, 1: 每日列表新闻
      idList: [],   // 新闻id顺序列表
      articleIndex: 0,   // 当前文章在顺序列表中的下标
      articles: [],
      popularity: '', // 点赞人数
      comments: '',   // 评论总数
      longComments: '',  // 长评论数
      shortComments: '', // 短平路数
      bottomAllLoaded: false,
      topAllLoaded: false,
      articleDom: null,
    }
  },
  mounted () {
    this.init();
  },
  beforeRouteEnter (to, from, next) {
    let self = this
    if(from.name == 'newsList'){
      next(vm => {
        vm.init();
      })
    }else {
       next();
    }
  },
  activated () {
    this.articleDom.scrollTop = this.$store.state.detailPosition;
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('setDetailPosition',this.articleDom.scrollTop);
    next();
  },
  methods: {
    init () {
      this.id = this.$route.query.id;
      this.type = this.$route.query.type;
      this.articleDom = document.querySelector(".article");

      // 新闻内容
      this.getBaseData(0); 
      // 新闻点赞，评论数 
      this.getExtraData(0); 

      if (this.type == 0) {
        this.idList = this.$store.state.topNewsIdList;
      }else if (this.type == 1){
        this.idList = this.$store.state.newsIdList;
      }
      this.articleIndex = this.idList.indexOf(Number(this.id));
    },
    // type: 0--首次加载  1--下拉加载  2--上拉加载
    getBaseData (type) {  
      let self = this;
      let option = this.getDiffOption(type);
      if (type == 0) {
        this.articles = [];
      }
      if (!option.targetId) {
        this.$refs.loadmore.onTopLoaded();
        this.$refs.loadmore.onBottomLoaded();
        return;
      }
      this.$wait.open();
      this.$ajax.get('api/4/news/' + option.targetId)
      .then(function (res) {
        self.$wait.close();
        if (res.status != 200) {
          self.$refs.loadmore.onTopLoaded();
          self.$refs.loadmore.onBottomLoaded();
          return self.$toast(res.statusText);
        }
        let data = res.data;
        let articleDetail = {
          image: data.image,
          source: data.image_source,
          title: data.title,
          css: data.css[0],
          content: data.body,
        }
        self.id = option.targetId;
        self.addArticleCss(articleDetail.css);
        setTimeout(() => {
           option.callback.call(self,articleDetail);
        },100)
      })
      .catch(function (err) {
        self.$wait.close();
        self.$refs.loadmore.onTopLoaded();
        self.$refs.loadmore.onBottomLoaded();
        console.log(err);
        return self.$toast('出错啦！请检查网络环境');
      })
    },
    getExtraData (type) {
      let self = this;
      let option = this.getDiffOption(type);
      if (!option.targetId) {
        return;
      }
      this.$ajax.get('api/4/story-extra/' + option.targetId)
      .then(function (res){
        if (res.status != 200) {
          return self.$toast(res.statusText);
        }
        self.popularity = res.data.popularity;
        self.comments = res.data.comments; 
        self.longComments = res.data.long_comments; 
        self.shortComments = res.data.short_comments; 
      })
      .catch(function (err) {
        console.log(err);
        return self.$toast('出错啦！请检查网络环境');
      })
    },
    getDiffOption (type) {
      let targetId = '';
      let callback = '';
      switch(type) {
        case 0:
            targetId = this.id;
            callback = function (articleDetail) {
              this.articles.push(articleDetail);
            }
            break;
        case 1:
            targetId = this.idList[this.articleIndex - 1] || '';
            callback = function (articleDetail) {
              this.$refs.loadmore.onTopLoaded();
              this.articleIndex--;
              this.articles.unshift(articleDetail);
              this.articles.pop();
              setTimeout(() => {
                document.querySelector(".currArticle").scrollIntoView();
              },200)
            }
            if (targetId) {
              this.topAllLoaded = false;
            }else {
              this.topAllLoaded = true;
              this.$toast("当前已是第一篇")
            }
            break;
        case 2:
            targetId = this.idList[this.articleIndex + 1] || '';
            callback = function (articleDetail) {
              this.$refs.loadmore.onBottomLoaded();
              this.articleIndex++;
              this.articles.push(articleDetail);
              this.articles.shift();
              setTimeout(() => {
                document.querySelector(".currArticle").scrollIntoView();
              },50)              
            }
            if (targetId) {
              this.bottomAllLoaded = false;
            }else {
              this.bottomAllLoaded = true;
            }
      }
      return {
        targetId, callback
      }
    },
    toNext () {
      this.getBaseData(2);
      this.getExtraData(2);
    },
    toPrev () {
      this.getBaseData(1);
      this.getExtraData(1);
    },
    toComment () {
      this.$router.push({name:'comment', query: {id: this.id, long: this.longComments, 
                         short: this.shortComments, all: this.comments}});
    },
    addArticleCss (cssHref) {
      let linkDom = document.querySelector('link.article_detail_css');
      if(linkDom != cssHref) {
        linkDom.href = cssHref;
      }
    } 
    

  }
}
</script>

<style  lang="less">
.article {
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  overflow-scrolling: touch;
  .currArticle{
    position: relative;
    .top {
      height: 250px; /*no*/
      overflow: hidden;
      position: absolute;
      z-index: 3;
      background: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
      img {
        position: relative;
        z-index: -1;
        top: -30px; /*no*/
      }
      .message {
        position: absolute;
        bottom: 0;
        padding: 0 30px 20px;
        width: 100%;
        box-sizing: border-box;
        .title {
          font-size: 40px;
          color: #fff;
        }
        .source {
          color: #cdcdcd;
          text-align: right;
        }
      }
    }
  }
  .articleContent {
    position: relative;
    top: 50px; /*no*/
    width: 100%;
    margin-bottom: 100px;
  }
  .blank {
    height: 70px;
    width: 100%;
  }
  .footerNav {
    position: fixed;
    bottom: -1px; /*no*/
    display: flex;
    text-align: center;
    width: 100%;
    line-height: 74px;
    box-sizing: border-box;
    i {
      flex: 1;
      font-size: 40px;
      span {
        font-size: 20px;
        position: relative;
        top: -20px;
        left: 5px;
      }
    }
  }
}
 .mint-loadmore-text {
    font-size: 30px !important;
    color: #cdcdcd !important;
  }
</style>
