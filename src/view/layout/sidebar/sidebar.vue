<template>
<!--  <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar">-->
<!--    <el-menu mode="vertical" class="left-sidebar" unique-opened :collapse-transition="false" :default-active="$route.path">-->
  <el-menu mode="vertical" class="left-sidebar" unique-opened :collapse-transition="false" :default-active="activeMenu">
      <sidebar-item v-for="route in routeLists" :key="route.functionPath" :item="route" :base-path="route.functionPath"></sidebar-item>
    </el-menu>
<!--  </el-scrollbar>-->


<!--  <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar">-->
<!--    <el-menu :default-active="$route.path" :collapse-transition="false" mode="vertical">-->
<!--      <sidebar-item v-for="route in routeLists" :key="route.functionPath" :item="route" :base-path="route.functionPath" />-->
<!--    </el-menu>-->
<!--  </el-scrollbar>-->
</template>

<script>
  import http from "@/api/AdminApi";
  import SidebarItem from './sidebar-item'
  let count = 0
  export default {
    components: { SidebarItem },
    data() {
      return {
        routeLists: []
      };
    },
    computed: {
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },

    },
    methods: {
      dealData(routes) {
        routes.forEach(item => {
          let length = `${item.functionID}`.length;
          if (!item.functionPath) {
            count ++;
            item.functionPath = `${length == 3 ? `/blank${count}` : `blank${count}`}`;
          }
          if (item.menuList && item.menuList.length > 0) {
            this.dealData(item.menuList);
          }
        });
        return routes
      }
    },
    mounted() {
      // console.log('路由')
      // console.log($route)
      http.role().then(res => {
        if (res.statusCode == 200) {
          // 需要将数据进行处理
          this.dealData(res.message)
          this.routeLists = res.message;
        }
      });
    }
  };
</script>

<!--<style scoped>-->
<!--  .scrollbar {-->
<!--    height: calc(100% - 60px);-->
<!--  }-->
<!--  /*/deep/ .el-scrollbar__wrap { */-->
<!--  .el-scrollbar__wrap {-->
<!--    overflow-x: hidden;-->
<!--  }-->
<!--  /*/deep/ .el-menu {*/-->
<!--</style>-->

<style lang="stylus">
.left-sidebar{
  position:fixed;
  top:56px;
  width:220px;
  height:100%;
  /*min-height:500px*/
  overflow: auto;
}
</style>

