<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
    </div>
    <el-row class="content">
      <el-col :span="24" class="list" style="padding-top: 10px;">
        <el-table :data="tableData" width="100%" v-loading="dataloading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#EBECED'}">
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column label="经纪人姓名" prop="agentName" align="center"> </el-table-column>
          <el-table-column label="联系方式" prop="agentPhone" align="center"> </el-table-column>
          <el-table-column label="所属营业部" prop="userName" align="center"> </el-table-column>
          <el-table-column label="主要任务完成数" prop="mainCompletedNumber" align="center"> </el-table-column>
          <el-table-column label="辅助任务完成数" prop="auxiliaryCompletedNumber" align="center"> </el-table-column>
          <el-table-column label="主要任务出库吨数" prop="mainOutNumber" align="center"> </el-table-column>
          <el-table-column label="辅助任务出库吨数" prop="auxiliaryOutNumber" align="center"> </el-table-column>
          <el-table-column label="添加时间" prop="crttime" align="center"> </el-table-column>
        </el-table>
      </el-col>
<!--      <el-col :span="24" class="page">-->
<!--        <span class="FloatLeft TextColorGlay">共{{total}}条</span><el-pagination background layout="prev, pager, next,jumper" :total="total"> </el-pagination>-->
<!--      </el-col>-->
    </el-row>
  </div>
</template>

<script>
  import AdminApi from '@/api/AdminApi.js'

  export default{
    data(){
      return{
        dataloading:false,
        tableData:[],
        total:0,
        staff:{
          userId:'',
          currentPage:1,
          pageSize:10
        }
      }
    },
    methods:{
      GetList:function(){
        this.dataloading = true;
        let Params = this.staff;
        Params.userId = this.$route.params && this.$route.params.id;
        AdminApi.getAgentList(Params).then(data=>{
          this.dataloading = false;
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.tableData = message;
            this.total = message.totalRecords
          }else{
            this.$message.error(message);
          }
        })
      },
    },
    mounted() {
      this.GetList()
    }
  }
</script>
