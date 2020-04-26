<template>
  <div class="app-wrapper">
    <header-bar></header-bar>
    <sidebar></sidebar>
    <div class="main-container">
      <tab-bread></tab-bread>
      <app-main v-if="isRouterAlive"></app-main>
    </div>
  </div>
</template>

<script>
  import HeaderBar from '@/components/header'
  import Sidebar from './sidebar/sidebar'
  import AppMain from './sidebar/app-main'
  import TabBread from './sidebar/tab-bread'
  export default{
    provide() { // 注册一个方法
      return {
        reload: this.reload
      }
    },
    components:{
      HeaderBar,
      Sidebar,
      AppMain,
      TabBread
    },
    data(){
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function() {
          this.isRouterAlive = true
        })
      }
    },
  }
</script>

<style scoped lang="stylus">
  .app-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    .main-container {
      padding-left: 220px;
      padding-top: 68px;
      height: 100%;
    }
  }
</style>
