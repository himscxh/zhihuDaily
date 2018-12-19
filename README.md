# zhihuDaily 

一个基于 vue 全家桶构建的仿知乎日报移动端单页 web 应用

<br />

### 基本介绍

在我学习过 vue.js，了解到 vue 全家桶组件化开发的模式后，想通过一个项目案例来加深自己的学习，所以选取了一个有开放接口的应用进行模仿练习。这个项目的 UI 界面是模仿 IOS 端的知乎日报界面，接口由知乎（Zhihu.Inc）提供，这里感谢 Xiao Liang 分享的[知乎日报API分析](https://github.com/izzyleung/ZhihuDailyPurify/wiki/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5-API-%E5%88%86%E6%9E%90)，项目主要技术栈：vue + vue-router + vuex + axios + lib-flexible + mint-ui 。

### 声明

本项目仅做参考学习，所有文字图片等稿件内容均由知乎提供，获取与共享之行为若侵犯了知乎权益，被告知需停止共享与使用，本人会及时删除整个项目。请您了解相关情况，并遵守知乎协议。

### 使用说明
请在本地运行，并使用浏览器（推荐 chrome）移动端模式查看

```
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```

### 项目效果演示
 ![image](https://github.com/himscxh/zhihuDaily/raw/master/src/assets/images/total.gif)

### 项目主要结构 
 ![image](https://github.com/himscxh/zhihuDaily/raw/master/src/assets/images/main.png)

### 已完成功能
> **新闻列表页**
- 下拉更新最新新闻
- 懒加载往日新闻
- 页面顶部标题栏的背景透明度，标题内容随页面滚动变化
- 缓存页面，记录上次的阅读位置

> **新闻详情页**
- 下拉加载上一篇新闻，底部上拉加载下一篇新闻
- 前往评论页会缓存此页面，记录阅读位置

> **评论页**
- 长评论，短评论的锚点导航

> **侧滑栏**
- 切换 “夜间”/“日间” 主题色

> **主页动效**
- 新闻列表页左上角按钮可以显示侧滑栏
- 侧滑栏显示时，右侧新闻列表页任意位置可隐藏侧滑栏
- 水平向左/向右滑动可以隐藏/显示侧滑栏

### 存在的问题

新闻列表页的轮播图开启自动轮播，在侧滑栏显示的情况下页面下边会出现一大片空白。

轮播图自动轮播时，部分轮播图元素会添加上 transform：translate3d(x,y,z)。mint-ui 的 toast() 方法弹出的提示框同样有 transform：translate3d(x,y,z)。在此发现在侧滑栏显示的时候，只要元素有 transform：translate3d(x,y,z) 的样式属性，页面就会出现一大片空白。（我在侧滑栏和新闻列表页的父元素上也使用了 translate3d）

暂未找到出现大片空白的原因及解决方法

### 部分项目过程记录

>  **新闻列表页顶部标题修改及往日新闻懒加载功能**

知乎日报 app 的新闻列表页随着页面的滚动会有类似日期标题栏“吸顶”的效果，实际上我处理成随页面滚动修改顶部标题框内的标题内容。

![image](https://github.com/himscxh/zhihuDaily/raw/master/src/assets/images/newsList.gif)

这里需要判断的目标有两个，向下滚动时判断下一个日期标题栏（nextDom）是否到达页面顶部，向上滚动时判断当前日期标题栏（currentDom）是否低于页面顶部。因此需要获取 nextDom , currentDom 这两个节点，每当 nextDom 到达页面顶部或 currentDom 低于页面顶部时就需要修改页面顶部标题和更新两个节点。

在获取 nextDom 时可能为空，这时才进行数据请求，达到往日新闻懒加载效果。

以上思路的具体实现见项目中 newsList.vue 中 changeTopTitle, gotoNext, gotoPrev 方法。

<br/>

> **新闻详情页上下篇切换功能的实现思路**

新闻详情页的上下篇顺序是根据新闻列表页的列表顺序，列表页轮播图的新闻 id 按顺序保存到数组 topNewsIdList，今日新闻及往日新闻 id 保存到数组 newsIdList。这两个数组使用 vuex 进行状态管理。

```
let state = {
	newsIdList: [],
	topNewsIdList: [],
}
```

列表页往下滑动逐渐加载往日新闻，将新加载的新闻 id 序列组添加到 newsIdList 。

```
// id: 新加载的新闻 id 序列组 
addNewsIdList (state, id) {
	state.newsIdList = state.newsIdList.concat(id);
}
```

列表页刷新则 topNewsIdList，newsIdList 全部更新。

```
clearTopIdList (state) {
	state.topNewsIdList = [];
}
setTopNewsIdList (state, id) {
	state.topNewsIdList = state.topNewsIdList.concat(id);
}	
```

列表页下拉只更新轮播图及今日新闻数据，topNewsIdList 可全部更新。而由于列表页进行了路由缓存，已加载的往日新闻不会重新加载，因此 newsIdList 不能全部更新，只对数组前面今日新闻部分进行更新。

```
updateNewsIdList (state, option) {
    // 删除原来的今日新闻 id
	state.newsIdList.splice(0,option.orignLength);
	// 添加更新的今日新闻 id
	state.newsIdList = option.newsIdList.concat(state.newsIdList);
}
```

上下篇新闻的切换加载使用 mint-ui 的 loadmore 组件。具体实现见项目 components > articleDetail.vue 及 store > index.js 。

<br/>

> **主页动效**

这个项目中我将侧滑栏组件 userCenter 和新闻列表组件 newsList 嵌套到 home 组件中。侧滑栏的显隐是通过修改 home 组件的 translate3d 值实现的。

```
<!-- home 组件 -->
<template>
  <div id="home">
    <div class="homeBody" :style="changeStyle">
        <!-- 侧滑栏 -->
        <user class="sidebar" name="sidebar"></user>
        <!-- 路由匹配到的组件，例如 newsList 组件 -->
        <keep-alive include="newsList">
          <router-view class="main" ></router-view>
        </keep-alive>
    </div>
    <!-- 遮罩层 -->
    <div class="maskLayer"></div>
  </div>
</template>
```

![image](https://github.com/himscxh/zhihuDaily/raw/master/src/assets/images/home.gif)

主页侧滑栏显隐的交互动效处理细节：

- 侧滑栏隐藏时，点击新闻列表页左上角按钮显示侧滑栏，这里加上过渡效果。
- 侧滑栏显示时，点击侧滑栏右侧区域任意位置隐藏侧滑栏，这里实际在右侧添加了一个透明的遮罩层，同样加过渡效果。
- 左右滑动时，根据移动的距离修改 translate3d 的值，这里不加过渡效果（滑动效果才顺畅）。
- 滑动结束时，如果侧滑栏未完全拉出，则添加过渡效果，侧滑栏拉出超过 2/3 宽则完全显示侧滑栏，否则完全隐藏侧滑栏。
- 侧滑栏完全显示时不能再向右移动，侧滑栏完全隐藏时不能再向左移动。

具体实现见项目 components > home.vue 。

### 总结

该项目目前只完成了三个页面，但过程中遇到了大大小小的问题，涉及的知识点也多，很多细节功能需要去观察并思考理顺一步步实现。还有一些尚未完成的功能和存在 bug ，后续会继续学习并补充完善这个项目。






