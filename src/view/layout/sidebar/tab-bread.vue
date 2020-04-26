<template>
  <div class="breadcrumb" >
    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$route.path == '/dashboard'">
      <el-breadcrumb-item>流向流量业务系统</el-breadcrumb-item>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb separator-class="el-icon-arrow-right" v-else>
      <el-breadcrumb-item v-for="(item,index) in breadcrumblist" :key="index" v-if="item.meta.showName!=1">
        <span v-if="index==0 || index==breadcrumblist.length-1">{{item.meta.title}}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
<!--    <span @click="refresh()" class="refresh"><i class="el-icon-refresh"></i></span>-->
    <el-button @click="refresh()" size="mini" class="refresh">刷新</el-button>
  </div>
</template>

<script>
  export default {
    inject:['reload'],
    data(){
      return{
        breadcrumblist:[],
      }
    },
    watch:{
      $route() {
        if(this.$route.path == '/dashboard'){
           this.breadcrumblist = []
        }else{
           this.breadcrumblist = this.$route.matched
        }
      },
    },
    methods:{
      handleLink(item) {
        const { path } = item;
        this.$router.push(path)
      },
      refresh:function(){
        this.reload()
      },
    },
    created() {
       if(this.$route.path == '/admin'){
          this.breadcrumblist = []
       }else{
          this.breadcrumblist = this.$route.matched
       }
    }
  }
</script>
<style scoped>
  .breadcrumb{width: 98%;margin: 0 auto;display: flex;}
  .el-breadcrumb{
    flex: 1;
  }
  .el-breadcrumb__inner a{
    color: #888888;
    font-weight: normal;
  }
  .el-breadcrumb__inner a:hover{
    color: #1492D3;
  }
  .refresh.el-button:focus, .refresh.el-button:hover {
    color: #606266;
    background: #fff;
    border: 1px solid #DCDFE6;
  }
</style>
