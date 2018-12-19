<template>
  <div id="app" :class="theme">
    <transition :name="transitionName">
    <keep-alive include="home,articleDetail">
      <router-view/>
    </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: ''
    }
  },
  watch: {
    '$route' (to,from) {
      if(to.name == 'newsList'){
        this.transitionName = 'slide-left'
      }
    }
  },
  computed: {
    theme () {
      return this.$store.state.theme 
    }
  },
  created () {
    window.localStorage.getItem('baseState') &&  this.$store.replaceState(JSON.parse(localStorage.getItem('baseState')));

  },
  mounted () {
    let self = this;
    window.addEventListener('beforeunload', () => {
      window.localStorage.setItem('baseState',JSON.stringify(self.$store.state));
    })
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}
a {
  text-decoration: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
