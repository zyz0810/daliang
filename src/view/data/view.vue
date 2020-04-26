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
      <div class="TaskInfo">
        <div class="InfoTitle">
          <span class="line"></span>
          <span class="text TextColorGlay">基本信息</span>
        </div>
        <div class="InfoFlex">
          <div class="InfoFlexItem">
            <span>出库单号：{{datainfo.orderOutnum || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>标的号：{{datainfo.orderTarget || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>合同号：{{datainfo.orderContract || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>品类：{{datainfo.grainName || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>品种：{{datainfo.grainVarietyName || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>等级：{{datainfo.orderGbgrade || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>产地：{{datainfo.orderCountry || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>买入单价：{{datainfo.orderBugprice || '--'}}元/吨</span>
          </div>
          <div class="InfoFlexItem">
            <span>标的金额：{{datainfo.orderTargetprice || '--'}}元</span>
          </div>
          <div class="InfoFlexItem">
            <span>数量：{{datainfo.orderNumber || '--'}}吨</span>
          </div>
          <div class="InfoFlexItem">
            <span>买方交易商：{{datainfo.buyUserName || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>卖方交易商：{{datainfo.sellUserName || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>承储库：{{datainfo.depotName || '--'}}</span>
          </div>
          <div class="InfoFlexItem">
            <span>仓号：{{datainfo.depotNum || '--'}}</span>
          </div>
        </div>
        <div class="InfoTitle">
          <span class="line"></span>
          <span class="text TextColorGlay">任务信息</span>
        </div>
        <div class="TaskInfo">
          <div class="TaskInfoItem">
            <span>执行营业部：{{datainfo.departName || '--'}}</span>
          </div>
          <div class="TaskInfoRemarks">
            <p class="Remarkstitle">任务内容：</p>
            <p class="Remarksinfo">{{datainfo.taskContent || '--'}}</p>
          </div>
          <div class="TaskInfoItem " style="width: 100%;">
            <span v-if="datainfo.departNames">转发到营业部：{{datainfo.departNames || '--'}}</span>
          </div>
          <div class="TaskInfoItem" style="width: 100%;">
            <span v-if="datainfo.userAgentNames">执行经纪人：{{datainfo.userAgentNames || '--'}}</span>
          </div>
        </div>
      </div>
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
    },
    mounted() {
      this.Getinfo()
    }
  }
</script>

<style scoped>
  .TaskInfo{background: #FFFFFF;margin: 20px auto;width: 97%;}
  .InfoFlex{display: flex;justify-content: flex-start;flex-flow: wrap;padding-left:1.25rem;}
  .InfoFlex .InfoFlexItem,.TaskInfo .TaskInfoItem{width: 30%;color: #333333;line-height: 3.125rem;font-size: 0.875rem;}
  .TaskInfo .TaskInfoRemarks{width: 80%;color: #333333;font-size: 0.875rem;display: flex;line-height: 3.125rem;}
  .TaskInfo .TaskInfoRemarks .Remarkstitle{width: 70px;}
  .TaskInfo .TaskInfoRemarks .Remarksinfo{width: 85%;}
  .StatusCirclePrimit{border-color: #def0f9;color: #1492D3;}
  .StatusCirclePrimitText{color: #1492D3;}
  .paddBotton{padding-bottom: 0.5rem;}
  .title h3{color: #333333;padding-left: 1.25rem;}

  .Backgroundcolor{background: #F6F6F6;padding: 1.25rem;}
  .el-tag.el-tag--info{border: 0rem;margin:0.625rem 1.25rem 0.625rem 0;}
  .title h3 span{color: #999999;}
  .title .tiips{color: #999999;line-height: 3.4375rem;}
  .Backgroundcolor .text{font-size: 1rem;color: #333333;line-height: 1.875rem;}
  .windth84{width: 5.25rem;}
</style>
