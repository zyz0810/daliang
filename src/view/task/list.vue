<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
    </div>
    <el-row class="content">
      <el-col :span="24" class="search">
        <el-form :inline="true" :model="SearchData" ref="SearchData" class="demo-form-inline">
          <el-form-item label="品类" prop="grainId">
            <el-select v-model="SearchData.grainId" placeholder="请选择" @change="changeGrainId">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in GrainOption" :label="item.value" :value="item.key" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品种" prop="grainVariety">
            <el-select v-model="SearchData.grainVariety" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in VarietyOption" :label="item.value" :key="item.key" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="等级" prop="orderGbgrade">
            <el-select v-model="SearchData.orderGbgrade" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in GradeOption" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="状态" prop="status">-->
<!--            <el-select v-model="SearchData.status" placeholder="请选择">-->
<!--              <el-option label="请选择" value=""></el-option>-->
<!--              <el-option v-for="(item,index) in StatusOption" :key="index" :label="item.label" :value="item.value"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务单位" prop="userId">-->
<!--            <el-select v-model="SearchData.userId" placeholder="请选择">-->
<!--              <el-option label="请选择" value=""></el-option>-->
<!--              <el-option v-for="(item,index) in CompanyOption" :key="index" :label="item.userName" :value="item.userID"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="执行营业部" prop="departId">-->
<!--            <el-select v-model="SearchData.departId" placeholder="请选择">-->
<!--              <el-option label="请选择" value=""></el-option>-->
<!--              <el-option v-for="(item,index) in DepartOption" :key="index" :label="item.userName" :value="item.userID"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="出库单号" prop="orderOutnum">-->
<!--            <el-input v-model="SearchData.orderOutnum" placeholder="请输入出库单号" clearable></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="合同号" prop="orderContract">
            <el-input v-model="SearchData.orderContract" placeholder="请输入合同号" clearable></el-input>
          </el-form-item>
          <el-form-item label="商户编号" prop="merchantNo">
            <el-input v-model="SearchData.merchantNo" placeholder="请输入商户编号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="GetList()">查询</el-button>
            <el-button type="primary" plain @click="resetData()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="list">
        <el-table :data="tableData" width="100%" v-loading="dataloading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#EBECED'}">
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column label="合同号" align="center"><template slot-scope="{row}">{{ row.orderContract || '--' }}</template></el-table-column>
          <el-table-column label="商户编号" align="center"><template slot-scope="{row}">{{ row.merchantNo || '--' }}</template></el-table-column>
          <el-table-column label="品类" align="center"><template slot-scope="{row}">{{ row.grainName || '--' }}</template></el-table-column>
          <el-table-column label="品种" align="center"><template slot-scope="{row}">{{ row.grainVarietyName || '--' }}</template></el-table-column>
          <el-table-column label="等级" align="center"><template slot-scope="{row}">{{ row.orderGbgrade || '--' }}</template></el-table-column>
          <el-table-column label="价格(元/吨)" align="center"><template slot-scope="{row}">{{ row.orderBugprice || '--' }}</template></el-table-column>
          <el-table-column label="合同数量(吨)" align="center"><template slot-scope="{row}">{{ row.contractNumber }}</template></el-table-column>
          <el-table-column label="完成数量(吨)" align="center"><template slot-scope="{row}">{{ row.completeNumber || '--' }}</template></el-table-column>
          <el-table-column label="买方交易商" align="center"><template slot-scope="{row}">{{ row.buyUserName || '--' }}</template></el-table-column>
          <el-table-column label="卖方交易商" align="center"><template slot-scope="{row}">{{ row.sellUserName || '--' }}</template></el-table-column>
          <el-table-column label="实际存粮地点" align="center"><template slot-scope="{row}">{{ row.depotName || '--' }}</template></el-table-column>
<!--          <el-table-column label="状态" align="center">-->
<!--            <template slot-scope="{row}"><span :class="[row.status<=1 ? 'primaryText' : '' , row.status>1&& row.status<7 ? 'SuccessText' : '',row.status>1&& row.status==7 ? 'FilshText' : '' ,row.status>=8? 'WarnText' : '']">{{ row.status | filtersStatus }}</span></template>-->
<!--          </el-table-column>-->
          <el-table-column label="任务时间" align="center"><template slot-scope="{row}">{{ row.taskTime || '--' }}</template></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}" >
              <el-button type="primary" size="mini" @click="GetInfo(row,row.orderContract)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="page">
        <span class="FloatLeft TextColorGlay">共{{totalRecords}}条</span><el-pagination @current-change="handleCurrentChange"  :page-size="SearchData.pageSize" background layout="prev, pager, next,jumper" :total="totalRecords"> </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AdminApi from '@/api/AdminApi.js'

  export default{
    data(){
      return{
        SearchData:{
          grainId:'',
          grainVariety:'',
          orderGbgrade:'',
          orderContract:'',
          merchantNo:'',
          currentPage:1,
          pageSize:10
        },
        dataloading:false,
        tableData:[],
        totalRecords:0,
        GrainOption: [],
        GradeOption:{1:'一等', 2:'二等', 3:'三等', 4:'四等', 5:'五等', 6:'等外'},
        VarietyOption:[],
      }
    },
    methods:{
      GetInfo:function(row,id){
        sessionStorage.setItem('contractInfo', JSON.stringify(row));
        this.$router.push({path:'/logistics/contract'})
      },
      GetList:function(){
        this.dataloading = true;
        let Params = this.SearchData;
        AdminApi.getTaskOrderList(Params).then(data=>{
          this.dataloading = false;
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.tableData = message.records;
            this.totalRecords = message.totalRecords
          }else{
            this.$message.error(message);
          }
        })
      },
      // 品种品类
      getGrain:function(){
        AdminApi.getGrainList().then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.GrainOption = message.grain;
          }else{
            this.$message.error(message);
          }
        })
      },
      changeGrainId(Value){
        this.SearchData.grainVariety='';
        this.VarietyOption =  this.GrainOption.find(item => item.key == Value).list
      },
      resetData:function(){
        this.$refs['SearchData'].resetFields();
        this.GetList()
      },
      handleCurrentChange:function(val){
        this.SearchData.currentPage = val;
        this.GetList()
      }
    },
    mounted() {
      this.GetList();
      this.getGrain();
    }
  }
</script>
