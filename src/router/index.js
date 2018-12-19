import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import newsList from '@/components/newsList'
import articleDetail from '@/components/articleDetail'
import comment from '@/components/comment'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: home,
      children: [
        { 
          path: "", 
          name: "newsList",
          component: newsList,
        },
      ],
    },
    {
      path: '/articleDetail',
      name: 'articleDetail',
      component: articleDetail,
    },
    {
      path: '/comment',
      name: 'comment',
      component: comment,
    }
  ],
  scrollBehavior (to, from, savedPosition){
    if (savedPosition) {
      return savedPosition
    }else if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
})
