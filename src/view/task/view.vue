<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
    </div>
    <el-row v-loading="dataloading">
      <div class="ContenFelx">
        <el-col :span="18" class="step">
          <el-steps :active="datainfo.setstatus"  align-center>
            <el-step title="添加任务" :class="{inine:datainfo.status>=2 && datainfo.status!=8}" :description="datainfo.taskTime"></el-step>
            <el-step title="任务接收"  :class="{inine:datainfo.status>=3 && datainfo.status!=8}" :description="datainfo.acceptTaskTime"></el-step>
            <el-step title="仓单注册" :class="{inine:datainfo.status>=4 && datainfo.status!=8}" :description="datainfo.orderCrttime"></el-step>
            <el-step title="出库" :class="{inine:datainfo.status>=5 && datainfo.status!=8}" :description="datainfo.outOutStartTime"></el-step>
            <el-step title="物流运输" :class="{inine:datainfo.status>=6 && datainfo.status!=8}" :description="datainfo.outOutStartTime"></el-step>
            <el-step title="入库" :class="{inine:datainfo.status>=7 && datainfo.status!=8}" :description="datainfo.outInEndTime"></el-step>
            <el-step title="任务完成" :description="datainfo.finishTaskTime"></el-step>
          </el-steps>
        </el-col>
        <el-col :span="5" class="StepStatus">
          <div class="StatusCircle" v-if="datainfo.status>=2 && datainfo.status<=7">
            <el-progress type="circle" :percentage="(datainfo.status/7)*100" :show-text="false"></el-progress>
            <span class="statusText">{{datainfo.status | filtersStatus}}</span>
          </div>
          <div class="StatusCircle" v-if="datainfo.status==1">
            <el-progress type="circle" :percentage="0" :show-text="false"></el-progress>
            <span class="statusText">{{datainfo.status | filtersStatus}}</span>
          </div>
          <div class="StatusCircle" v-if="datainfo.status==8">
            <el-progress type="circle" :percentage="100" status="warning" :show-text="false"></el-progress>
            <span class="statusText WarnText">{{datainfo.status | filtersStatus}}</span>
          </div>
          <p class="StatusCentent" :class="[datainfo.status!=8?'StatusCirclePrimitText':'']">{{datainfo.taskTime}}</p>
        </el-col>
      </div>
      <el-row class="top_view flex m20">
        <!--      <div class="flex">-->
        <div class="flex-item" style="flex: 1.5;">
          <p class="primaryText title"><i class="el-icon-document"></i>本次出库信息</p>
          <p><i class="el-icon-tickets"></i>出库单号：{{datainfo.orderOutnum || '--'}}</p>
          <p><i class="el-icon-user-solid"></i>经办人：{{datainfo.operator || '--' }}</p>
          <p><i class="el-icon-mobile"></i>经办人身份证号：{{datainfo.operatorCardid || '--' }}</p>
        </div>
        <div class="flex-item" style="flex: 1 ;">
          <p><svg-icon icon-class="ClassGran"></svg-icon>品类：{{datainfo.grainName || '--'}}</p>
          <p><svg-icon icon-class="ClassGran"></svg-icon>品种：{{datainfo.grainVarietyName || '--'}}</p>
          <p><i class="el-icon-medal"></i>等级：{{datainfo.orderGbgrade || '--'}}</p>
          <p><i class="el-icon-location"></i>产地：{{datainfo.orderCountry || '--'}}</p>
        </div>
        <div class="flex-item" style="flex: 1.5;">
          <p><i class="el-icon-paperclip"></i>本次提货数量：{{datainfo.orderNumber || '--' }}吨</p>
          <p><svg-icon icon-class="Money"></svg-icon>本次金额：{{datainfo.orderTargetprice || '--' }}元</p>
          <p><svg-icon icon-class="Money"></svg-icon>买入单价：{{datainfo.orderBugprice || '--'}}元/吨</p>

        </div>
        <div class="flex-item" style="flex: 3;">
          <p><i class="el-icon-user-solid"></i>执行营业部：{{datainfo.departName || '--'}}</p>
          <p><i class="el-icon-user-solid"></i>执行经纪人：{{datainfo.userAgentNames || '--'}}</p>
          <p><i class="el-icon-user-solid"></i>转发到营业部：{{datainfo.departNames || '--'}}</p>
          <p><i class="el-icon-office-building"></i>任务内容：{{datainfo.taskContent || '--'}}</p>
        </div>
      </el-row>
      <div class="title_one"><h4 class="m20">流向流量追踪信息</h4></div>
      <el-row class="content MarginTop">
        <el-col :span="24" class="search">
          <el-form :inline="true" :model="SearchData" ref="SearchData" class="demo-form-inline">
            <el-form-item label="车牌号" prop="carLicense">
              <el-input v-model="SearchData.carLicense" placeholder="请输入车牌号" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="GetList()">查询</el-button>
              <el-button type="primary" plain @click="resetData()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      <el-col :span="24" class="list">
        <el-table :data="tableData" width="100%" v-loading="listloading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#EBECED'}">
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column label="司机姓名" align="center"><template slot-scope="{row}">{{ row.carName || '--' }}</template></el-table-column>
          <el-table-column label="车牌号" align="center"><template slot-scope="{row}">{{ row.carLicense || '--' }}</template></el-table-column>
          <el-table-column label="运输起点" align="center"><template slot-scope="{row}">{{ row.depotAddress || '--' }}</template></el-table-column>
          <el-table-column label="运输终点" align="center"><template slot-scope="{row}">{{ row.outAddress || '--' }}</template></el-table-column>
          <el-table-column label="实际运输量" align="center"><template slot-scope="{row}">{{ row.carOutnetStr || '--' }}</template></el-table-column>
          <el-table-column label="实际发车时间" align="center"><template slot-scope="{row}">{{ row.carOutdate || '--' }}</template></el-table-column>
          <el-table-column label="实际到达时间" align="center"><template slot-scope="{row}">{{ row.carIndate || '--' }}</template></el-table-column>
          <el-table-column label="实际用时" align="center"><template slot-scope="{row}">{{ row.routeDate || '--' }}</template></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="page">
        <span class="FloatLeft TextColorGlay">共{{totalRecords}}条</span><el-pagination @current-change="handleCurrentChange"  :page-size="SearchData.pageSize" background layout="prev, pager, next,jumper" :total="totalRecords"> </el-pagination>
      </el-col>
<!--      <div class="TaskInfo">-->
<!--        <div class="InfoTitle">-->
<!--          <span class="line"></span>-->
<!--          <span class="text TextColorGlay">基本信息</span>-->
<!--        </div>-->
<!--        <div class="InfoFlex">-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>出库单号：{{datainfo.orderOutnum || '&#45;&#45;'}}</span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>标的号：{{datainfo.orderTarget || '&#45;&#45;'}}</span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>合同号：{{datainfo.orderContract || '&#45;&#45;'}}</span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span></span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span></span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span></span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span></span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span></span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>标的金额：{{datainfo.orderTargetprice || '&#45;&#45;'}}元</span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>数量：{{datainfo.orderNumber || '&#45;&#45;'}}吨</span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>买方交易商：{{datainfo.buyUserName || '&#45;&#45;'}}</span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>卖方交易商：{{datainfo.sellUserName || '&#45;&#45;'}}</span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>承储库：{{datainfo.depotName || '&#45;&#45;'}}</span>-->
<!--          </div>-->
<!--          <div class="InfoFlexItem">-->
<!--            <span>仓号：{{datainfo.depotNum || '&#45;&#45;'}}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="InfoTitle">-->
<!--          <span class="line"></span>-->
<!--          <span class="text TextColorGlay">任务信息</span>-->
<!--        </div>-->
<!--        <div class="TaskInfo">-->
<!--          <div class="TaskInfoItem">-->
<!--            <span></span>-->
<!--          </div>-->
<!--          <div class="TaskInfoRemarks">-->
<!--            <p class="Remarkstitle">任务内容：</p>-->
<!--            <p class="Remarksinfo"></p>-->
<!--          </div>-->
<!--          <div class="TaskInfoItem " style="width: 100%;">-->
<!--            <span v-if="datainfo.departNames"></span>-->
<!--          </div>-->
<!--          <div class="TaskInfoItem" style="width: 100%;">-->
<!--            <span v-if="datainfo.userAgentNames"></span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </el-row>
    </el-row>
  </div>
</template>

<script>
  import AdminApi from '@/api/AdminApi.js'

  export default{
    data(){
      return{
        dataloading:false,
        datainfo:{},
        SearchData:{
          orderOutnum:'',
          carLicense:'',
          currentPage:1,
          pageSize:10
        },
        listloading:false,
        tableData:[],
        totalRecords:0,
        percentage:0,
        active:1,
      }
    },
    filters:{
      filtersStatus: function(value) {
        if(!value) return '--';
        let StatusArr = {1:'待接收', 2:'进行中',  3:'进行中', 4:'进行中', 5:'进行中', 6:'进行中', 7:'已完成', 8:'已取消'}
        return StatusArr[value]
      }
    },
    methods:{
      handleCurrentChange:function(val){
        this.SearchData.currentPage = val;
        this.GetList()
      },
      Getinfo:function(){
        this.dataloading = true;
        let  taskId =  this.$route.query.taskId;
        let Params = {'taskId':taskId};
        AdminApi.getTaskOrder(Params).then(data=>{
          this.dataloading = false;
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.datainfo = message;
            this.percentage = (this.datainfo.status/7)*100;
            if(message.status==8){
              this.datainfo.setstatus = 1
            }else{
              this.datainfo.setstatus = message.status
            }
          }else{
            if(statusCode != 100){
              this.$message.error(message);
            }
          }
        })
      },
      GetList:function(){
        this.listloading = true;
        this.SearchData.orderOutnum = this.$route.query.orderOutnum;
        let Params = this.SearchData;
        AdminApi.getCarList(Params).then(data=>{
          this.listloading = false;
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.tableData = message.records;
            this.totalRecords = message.totalRecords
          }else{
            this.$message.error(message);
          }
        })
      },

      resetData:function(){
        this.$refs['SearchData'].resetFields();
        this.GetList()
      },
    },
    mounted() {
      this.Getinfo();
      this.GetList();
    }
  }
</script>

<style scoped>
  .TaskInfo{background: #FFFFFF;margin: 20px auto;width: 98%;}
  .InfoFlex{display: flex;justify-content: flex-start;flex-flow: wrap;padding-left:1.25rem;}
  .InfoFlex .InfoFlexItem,.TaskInfo .TaskInfoItem{width: 30%;color: #333333;line-height: 3.125rem;font-size: 0.875rem;}
  .TaskInfo .TaskInfoRemarks{width: 80%;color: #333333;font-size: 0.875rem;display: flex;line-height: 3.125rem;}
  .TaskInfo .TaskInfoRemarks .Remarkstitle{width: 70px;}
  .TaskInfo .TaskInfoRemarks .Remarksinfo{width: 85%;}
  .StatusCirclePrimit{border-color: #def0f9;color: #1492D3;}
  .StatusCirclePrimitText{color: #1492D3;}
  .paddBotton{padding-bottom: 0.5rem;}
  /*.title h3{color: #333333;padding-left: 1.25rem;}*/

  .Backgroundcolor{background: #F6F6F6;padding: 1.25rem;}
  .el-tag.el-tag--info{border: 0rem;margin:0.625rem 1.25rem 0.625rem 0;}
  /*.title h3 span{color: #999999;}*/
  /*.title .tiips{color: #999999;line-height: 3.4375rem;}*/
  .Backgroundcolor .text{font-size: 1rem;color: #333333;line-height: 1.875rem;}
  .windth84{width: 5.25rem;}
  .title_one{
    width: 98%;
    margin: 0 auto;
  }
</style>
