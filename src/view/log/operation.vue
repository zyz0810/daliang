<!-- 角色分页设置 -->
<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
    </div>
    <el-row class="content">
      <el-col :span="24" class="search">
        <el-form :inline="true" :model="search" ref="search" :rules="searchrules" class="demo-form-inline">
          <el-form-item label="账号" prop="userAccount">
            <el-input v-model="search.userAccount" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="search.userName" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getlist()">查询</el-button>
            <el-button @click="resetData()" class="reset_button">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="list">
        <el-table :data="tableData" width="100%" v-loading="dataloading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#EBECED'}">
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column prop="userAccount" label="账号" align="center"></el-table-column>
          <el-table-column prop="userName" label="操作人" align="center"></el-table-column>
          <el-table-column prop="operateIp" label="操作IP" align="center"></el-table-column>
<!--          <el-table-column prop="operateState" label="操作结果" align="center">{{operateState==1?'成功':'失败'}}</el-table-column>-->
          <el-table-column label="操作结果" align="center">
            <template slot-scope="scope" >
              <span :class="scope.row.operateState=='1'?'green01':'red01'">{{scope.row.operateState=='1'?'操作成功':'操作失败'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operateText" label="操作内容" align="center"></el-table-column>
          <el-table-column prop="crttime" label="操作时间" align="center"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="page">
        <span class="FloatLeft TextColorGlay">共{{totalRecords}}条</span>
        <el-pagination :page-size="search.pageSize" @current-change="handleCurrentChange" :total="totalRecords" :background="true"> </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import http from "@/api/AdminApi";

export default {
  name: "listUserRole",
  data() {
    return {
      dataloading: true,
      totalRecords: 0,
      search: {
        userAccount:'',
        userName: "",
        currentPage: 1,
        pageSize: 10
      },
      searchrules: {},
      tableData: [],
    };
  },
  methods: {
    //获取列表
    getlist() {
      this.dataloading = true;
      var Params = this.search;
      // http.getRolesList(Params).then(res => {
      //   if (res.statusCode === 200) {
      //     this.dataloading = false;
      //     this.tableData = res.message.records;
      //     this.totalRecords = res.message.totalRecords;
      //   }
      // });
      http.getOperateLog(Params).then(res => {
        this.dataloading = false;
        this.tableData = res.message.records;
        this.totalRecords = res.message.totalRecords;
      });
    },
    //重置
    resetData: function() {
      this.$refs["search"].resetFields();
      this.getlist();
    },
    //页数
    handleCurrentChange: function(val) {
      this.search.currentPage = val;
      this.getlist();
    },
  },
  activated() {
    this.$shadow.shadow(this, this.cachedViews);
  },
  computed: {
    cachedViews() {
      return this.$store.state.permission.cachedViews;
    }
  },
  mounted() {
    this.getlist();
  }
};
</script>
