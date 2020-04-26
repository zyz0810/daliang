<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
    </div>
    <el-row class="top_view flex">
      <div class="flex-item">
        <p class="primaryText title"><i class="el-icon-document"></i>基本信息</p>
        <p><i class="el-icon-tickets"></i>合同号：{{contractInfo.orderContract || '--' }}</p>
        <p><i class="el-icon-document-remove"></i>标的号：{{contractInfo.orderTarget}}</p>
        <p><i class="el-icon-document-remove"></i>商户编号：{{contractInfo.merchantNo || '--' }}</p>
      </div>
      <div class="flex-item">
        <p><svg-icon icon-class="ClassGran"></svg-icon>品类：{{contractInfo.grainName || '--' }}</p>
        <p><svg-icon icon-class="ClassGran"></svg-icon>品种：{{contractInfo.grainVarietyName || '--' }}</p>
        <p><i class="el-icon-medal"></i>等级：{{contractInfo.orderGbgrade || '--' }}</p>
        <p><i class="el-icon-location"></i>产地：{{contractInfo.orderCountry || '--'}}</p>
      </div>
      <div class="flex-item">
        <p><i class="el-icon-paperclip"></i>合同数量：{{contractInfo.contractNumber || '--' }}吨</p>
        <p><i class="el-icon-paperclip"></i>完成数量：{{contractInfo.completeNumber || '--'  }}吨</p>
        <p><svg-icon icon-class="Money"></svg-icon>买入单价：{{contractInfo.orderBugprice || '--' }}元/吨</p>
        <p><svg-icon icon-class="Money"></svg-icon>价款：{{contractInfo.contractPrice || '--' }}元</p>
      </div>
      <div class="flex-item" style="flex: 1.5;">
        <p><i class="el-icon-user-solid"></i>卖方交易商：{{contractInfo.sellUserName || '--' }}</p>
        <p><i class="el-icon-user-solid"></i>买方交易商：{{contractInfo.buyUserName || '--' }}</p>
        <p><i class="el-icon-office-building"></i>承储库：{{contractInfo.storageName || '--' }}</p>
        <p><i class="el-icon-office-building"></i>实际存量地点：{{contractInfo.depotName || '--' }}</p>
      </div>
      <div class="flex-item" style="flex: 0.6;">
        <p><i class="el-icon-school"></i>仓号：{{contractInfo.depotNum || '--'}}</p>
      </div>
      <div class="flex-item">
        <el-tooltip class="item" effect="dark" :content="progresscontent" placement="top-start">
          <div class="mixCircle">
            <el-progress type="circle" :percentage="percentage" :show-text="false" :width="50"></el-progress>
            <span class="statusText tc">合同数量<br>{{contractInfo.contractNumber || '--' }}吨</span>
          </div>
        </el-tooltip>
      </div>
    </el-row>
    <el-row class="content m20">
      <el-col :span="24" class="search">
        <el-form :inline="true" :model="SearchData" ref="SearchData" class="demo-form-inline">
          <el-form-item label="任务单位" prop="userId">
            <el-select v-model="SearchData.userId" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in CompanyOption" :key="index" :label="item.userName" :value="item.userID"></el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="执行营业部" prop="departId">-->
          <!--            <el-select v-model="SearchData.departId" placeholder="请选择">-->
          <!--              <el-option label="请选择" value=""></el-option>-->
          <!--              <el-option v-for="(item,index) in DepartOption" :key="index" :label="item.userName" :value="item.userID"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="状态" prop="status">
            <el-select v-model="SearchData.status" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in StatusOption" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库单号" prop="orderOutnum">
            <el-input v-model="SearchData.orderOutnum" placeholder="请输入出库单号" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="GetList()">查询</el-button>
            <el-button type="primary" plain @click="resetData()">重置</el-button>
            <el-button type="danger" plain class="export_button" @click="download('')"><i class="el-icon-edit-outline"></i>全部导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="list">
        <el-table :data="tableData" width="100%" v-loading="dataloading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#EBECED'}">
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column label="出库单号" align="center"><template slot-scope="{row}">{{ row.orderOutnum || '--' }}</template></el-table-column>
          <el-table-column label="本次提货数量(吨)" align="center"><template slot-scope="{row}">{{ row.orderNumber || '0' }}</template></el-table-column>
          <el-table-column label="本次金额" align="center"><template slot-scope="{row}">{{ row.orderTargetprice || '--' }}</template></el-table-column>
          <el-table-column label="经办人" align="center"><template slot-scope="{row}">{{ row.operator || '--' }}</template></el-table-column>
          <el-table-column label="经办人身份证号" align="center"><template slot-scope="{row}">{{ row.operatorCardid || '--' }}</template></el-table-column>
          <el-table-column label="任务单位" align="center"><template slot-scope="{row}">{{ row.userName || '--' }}</template></el-table-column>
<!--          <el-table-column label="执行营业部" align="center"><template slot-scope="{row}">{{ row.departName || '&#45;&#45;' }}</template></el-table-column>-->
          <el-table-column label="状态" align="center">
            <template slot-scope="{row}"><span :class="[row.status<=1 ? 'primaryText' : '' , row.status>1&& row.status<7 ? 'SuccessText' : '',row.status>1&& row.status==7 ? 'FilshText' : '' ,row.status>=8? 'WarnText' : '']">{{ row.status | filtersStatus }}</span></template>
          </el-table-column>
          <el-table-column label="任务时间" align="center"><template slot-scope="{row}">{{ row.taskTime || '--' }}</template></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}" >
              <el-button type="primary" size="mini" @click="GetInfo(row.taskId,row.orderOutnum)">详情</el-button>
              <el-button :type="row.status == 7 ? 'danger':'info'" :disabled="row.status != 7" size="mini" @click="download(row.orderOutnum)">下载</el-button>
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
        contractInfo:{},
        SearchData:{
          orderContract:'',
          status:'',
          userId:'',
          // departId:'',
          orderOutnum:'',
          currentPage:1,
          pageSize:10
        },
        percentage:0,
        dataloading:false,
        tableData:[],
        totalRecords:0,
        CompanyOption:[],
        GrainOption: [],
        GradeOption:{1:'一等', 2:'二等', 3:'三等', 4:'四等', 5:'五等', 6:'等外'},
        VarietyOption:[],
        StatusOption:[{value:1,label:'待接收'}, {value:2,label:'进行中'}, {value:7,label:'已完成'},{value:8,label:'已取消'}],
        DepartOption:[],
        progresscontent: '',
      }
    },
    methods:{
      download:function(id){
        let Params= Object.assign({},this.SearchData);
        if(id==''){
          Params.orderContract = this.contractInfo.orderContract;
          Params.orderOutnum = '';
        }else{
          Params.orderContract = '';
          Params.orderOutnum = id;
        }
        // this.$delete(Params,'orderContract');
        this.$delete(Params,'currentPage');
        this.$delete(Params,'pageSize');
        this.$set(Params,'grainId','');
        this.$set(Params,'grainVariety','');
        this.$set(Params,'orderGbgrade','');
        this.$set(Params,'departId','');
        Params.status = '7';

        AdminApi.download(Params).then(data=>{
          const blob = new Blob([data]);
          let myDate = new Date();
          let timename = myDate.toLocaleDateString().split('/').join('-');
          const fileName = '数据结果'+timename+'.xlsx';
          const linkNode = document.createElement('a');
          linkNode.download = fileName; //a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click();  //模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
        })
      },
      GetInfo:function(id,outNum){
        this.$router.push({name:'taskView',query:{taskId:id,orderOutnum:outNum}})
      },
      GetList:function(){
        // window.localStorage.setItem('contractId', JSON.stringify(this.$route.query.taskId));
        this.dataloading = true;
        let Params = this.SearchData;
        AdminApi.getContractTaskOrderList(Params).then(data=>{
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
      // 营业部
      getAllDepart:function(){
        AdminApi.getAllDepartList().then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.DepartOption = message
          }else{
            this.$message.error(message);
          }
        })
      },
      // 任务单位
      getAllCompany:function(){
        AdminApi.getAllCompanyList().then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.CompanyOption = message
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
        this.$refs['SearchData'].resetFields()
        this.GetList()
      },

      handleCurrentChange:function(val){
        this.SearchData.currentPage = val
        this.GetList()
      },
    },
    filters: {
      filtersStatus: function(value) {
        if(!value) return '--';
        let StatusArr = {1:'待接收', 2:'进行中',  3:'进行中', 4:'进行中', 5:'进行中', 6:'进行中', 7:'已完成', 8:'已取消'}
        return StatusArr[value]
      }
    },
    mounted() {
      this.contractInfo = JSON.parse(sessionStorage.getItem('contractInfo'))
      this.SearchData.orderContract = this.contractInfo.orderContract;
      if(this.contractInfo.contractNumber<=0){
        this.percentage = 100
      }else{
        this.percentage = (this.contractInfo.completeNumber*1/this.contractInfo.contractNumber*1)*100
      }
      this.progresscontent = '合同数量'+this.contractInfo.contractNumber+'吨('+this.percentage.toFixed(2)+'%)';
      this.GetList();
      // this.getAllDepart();
      this.getAllCompany();
      // this.getGrain();
    },
  }
</script>

<style>
  .mixCircle{
    margin: 0 auto;
    width: 120px;
    height: 120px;
    position: relative;
    /*height: 100%;*/
  }
  .mixCircle .el-progress--circle .el-progress-circle{
    width: 120px !important;
    height: 120px !important;
  }
  .mixCircle .statusText{
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
  }


</style>
