<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
      <!--      <el-button type="primary" icon="iconfont icon-tianjiayonghu" class="reset_button" @click="handleData()">全部数据</el-button>-->
      <div class="select_button">
        <el-cascader v-model="implementSelected" :show-all-levels="false" :options="options" :props="{ expandTrigger: 'hover' }" ref="myCascader" @change="handleChange"></el-cascader>
      </div>
    </div>
    <!-- 图表 -->
    <div class="EchartContent Flex">
      <div class="EchartPie">
        <div class="DataItem">
          <p class="title">数据信息自2020年2月10日起</p>
          <div class="Flex MarginTop30">
            <div class="DataItem-item">
              <div class="icon"><span class="iconitem"><svg-icon icon-class="MoneyPock"></svg-icon></span></div>
              <div class="dataShow">
                <p>总交易金额（元）</p>
                <h4><countTo :startVal='0' :endVal='totalTransactionAmoun' :duration='3000' :decimals='2'></countTo></h4>
              </div>
            </div>
            <div class="DataItem-item">
              <div class="icon"><span class="iconitem blurcolor"><svg-icon icon-class="dataMoneyPock"></svg-icon></span></div>
              <div class="dataShow">
                <p>总交易数量（吨）</p>
                <h4><countTo :startVal='0' :endVal='totalWeight' :duration='3000' :decimals='2'></countTo></h4>
              </div>
            </div>
          </div>
        </div>
        <div class="EchartPieitem Flex">
          <div class="EchartPieitem-item-pie">
            <div id="myechart" style="height: 180px;" ref="myEchart">
            </div>
          </div>
          <div class="EchartPieitem-item">
            <div v-for="(item,index) in tradingVolumeListOption"><span :style="{'background': echartColor[item.color*1-1]}"></span>{{item.name}}</div>
          </div>
        </div>
      </div>
      <div class="EchartBar">
        <div class="SearchData">
          <div class="ChoseOption-item">
            <el-select v-model="TotalQuery.diagramType" @change="ChangeNumberChose()">
              <el-option value="1" label="交易量"></el-option>
              <el-option value="2" label="交易金额"></el-option>
              <el-option value="3" label="交易均价"></el-option>
            </el-select>
            <span>单位：{{unit}}</span>
          </div>
          <div class="rightFlex">
            <div class="ChoseOption-item tagItem">
              <span :class="timeSelected == '0' ? 'isActive':''" data-id="0" @click="chooseTime('0')">全部</span>
              <span :class="timeSelected == '1' ? 'isActive':''" data-id="1" @click="chooseTime('1')">本年</span>
              <span :class="timeSelected == '2' ? 'isActive':''" data-id="2" @click="chooseTime('2')">本月</span>
            </div>
            <div class="ChoseOption-item dataChose" style="width: 300px;">
              <el-date-picker class="time_input" v-model="TotalQuery.startTime" type="date" @change="ChangeData" value-format="yyyy-MM-dd" placeholder="选择开始日期"> </el-date-picker>
              <span class="zhi">至</span>
              <el-date-picker class="time_input" v-model="TotalQuery.endTime" type="date" @change="ChangeData" value-format="yyyy-MM-dd" placeholder="选择结束日期"> </el-date-picker>
            </div>
            <div class="ChoseOption-item button">
              <el-button type="primary" size="mini" @click="getEchart()">查询</el-button>
            </div>
          </div>
        </div>
        <div class="ShowPinzhong">
          <span @click="ChoseShow(item.name,item.tab)"  v-for="(item,index) in ChoseOptionList" :key="index" :class="{isactive:item.tab!=1}" :style="{'background': echartColor[item.color*1]}">{{item.name}}</span>
        </div>
        <div id="EchartBarData" ref="myBarEchart" style="width: 100%;height: 300px;overflow: hidden;"></div>
      </div>
    </div>
    <!-- 图表结束 -->
    <el-row class="content">
      <el-col :span="24" class="search">
        <el-form :inline="true" :model="SearchData" ref="SearchData" class="demo-form-inline">
          <el-form-item label="品类" prop="grainId">
            <el-select v-model="SearchData.grainId" @change="changeGrainId">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in GrainOption" :label="item.value" :value="item.key" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品种" prop="grainVariety">
            <el-select v-model="SearchData.grainVariety">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in VarietyOption" :label="item.value" :key="item.key" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="等级" prop="orderGbgrade">
            <el-select v-model="SearchData.orderGbgrade">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in GradeOption" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="departId" label="执行营业部">
            <el-select v-model="SearchData.departId">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in DepartOption" :key="index" :label="item.userName" :value="item.userID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userId" label="任务单位">
            <el-select v-model="SearchData.userId">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in CompanyOption" :key="index" :label="item.userName" :value="item.userID"></el-option>
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
          <el-table-column label="品类" align="center"><template slot-scope="{row}">{{ row.grainName || '--' }}</template></el-table-column>
          <el-table-column label="品种" align="center"><template slot-scope="{row}">{{ row.grainVarietyName || '--' }}</template></el-table-column>
          <el-table-column label="等级" align="center"><template slot-scope="{row}">{{ row.orderGbgrade || '--' }}</template></el-table-column>
          <el-table-column label="价格(元/吨)" align="center"><template slot-scope="{row}">{{ row.orderBugprice || '0' }}</template></el-table-column>
          <el-table-column label="数量(吨)" align="center"><template slot-scope="{row}">{{ row.orderNumber || '0' }}</template></el-table-column>
          <el-table-column label="买方交易商" align="center"><template slot-scope="{row}">{{ row.buyUserName || '--' }}</template></el-table-column>
          <el-table-column label="卖方交易商" align="center"><template slot-scope="{row}">{{ row.sellUserName || '--' }}</template></el-table-column>
          <el-table-column label="承储库" align="center"><template slot-scope="{row}">{{ row.depotName || '--' }}</template></el-table-column>
          <el-table-column label="任务单位" align="center"><template slot-scope="{row}">{{ row.userName || '--' }}</template></el-table-column>
          <el-table-column label="执行营业部" align="center"><template slot-scope="{row}">{{ row.departName || '--' }}</template></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="{row}"><span :class="[row.status<=1 ? 'primaryText' : '' , row.status>1&& row.status<7 ? 'SuccessText' : '',row.status>1&& row.status==7 ? 'FilshText' : '' ,row.status>=8? 'WarnText' : '']">{{ row.status | filtersStatus }}</span></template>
          </el-table-column>
          <el-table-column label="任务时间" align="center"><template slot-scope="{row}">{{ row.taskTime || '--' }}</template></el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="GetInfo(row.taskId)">查看</el-button>
              <el-button type="danger" size="mini" @click="download(row.orderOutnum)">下载</el-button>
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
  import echarts from "echarts";
  import AdminApi from '@/api/AdminApi.js'
  import countTo from 'vue-count-to'
  export default{
    components: { countTo },
    data(){
      return{
        tradingVolumeListOption:[],
        unit:'吨',
        TotalQuery:{
          userId:'',
          startTime:'',
          endTime:'',
          type:'1',
          diagramType:'1',
        },
        options: [{
          value: '1',
          label: '全部数据',
        }, {
          value: '2',
          label: '营业部',
          children: []
        }, {
          value: '3',
          label: '任务单位',
          children: []
        }],
        implementSelected: [],
        timeSelected:'0',
        GrainOption:[],
        DepartOption:[],
        GradeOption:{1:'一等', 2:'二等', 3:'三等', 4:'四等', 5:'五等', 6:'等外'},
        VarietyOption:[],
        StatusOption:[{value:1,label:'待接收'}, {value:2,label:'进行中'}, {value:7,label:'已完成'},{value:8,label:'已取消'}],
        CompanyOption:[],
        SearchData:{
          grainId:'',
          grainVariety:'',
          orderGbgrade:'',
          status:'7',
          userId:'',
          departId:'',
          orderOutnum:'',
          currentPage:1,
          pageSize:10
        },
        ChoseOptionList:[],
        dataloading:false,
        tableData:[],
        totalRecords:0,
        totalTransactionAmoun:0,
        totalWeight:0,
        echartColor:['#5FDAC0', '#F25859', '#F8B652', '#2DB8EF', '#7F85E4', '#D1CED1'],
        BarData:[20,30,50,62,59,36],
      }
    },
    filters: {
      filtersStatus: function(value) {
        if(!value) return '--';
        let StatusArr = {1:'待接收', 2:'进行中',  3:'进行中', 4:'进行中', 5:'进行中', 6:'进行中', 7:'已完成', 8:'已取消'}
        return StatusArr[value]
      }
    },
    methods:{
      // 品种品类
      getGrain:function(){
        this.implementSelected= [this.options[0].value];
        AdminApi.getGrainList().then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.GrainOption = message.grain;
          }else{
            this.$message.error(message);
          }
        })
      },
      GetDepartList(){
        AdminApi.getAllDepartList().then(data=>{
          let {message,statusCode} = data
          if(statusCode == 200){
            // let roleIDs = message.map(item => item.roleID).join("#");
            let arrList = [];
            for(let i =0;i<message.length;i++){
              let arr={
                value: message[i].userID,
                label: message[i].userName,
              };
              arrList.push(arr)
            }
            this.options[1].children = arrList;

            this.DepartOption = message
          }else{
            this.$message.error(message);
          }
        })
      },
      GetCompanyList(){
        AdminApi.getAllCompanyList().then(data=>{
          let {message,statusCode} = data
          if(statusCode == 200){
            let arrList = [];
            for(let i =0;i<message.length;i++){
              let arr={
                value: message[i].userID,
                label: message[i].userName,
              };
              arrList.push(arr)
            }
            this.options[2].children = arrList;
            this.CompanyOption = message
          }else{
            this.$message.error(message);
          }
        })
      },
      GetTotal(){
        let Params = Object.assign({},this.TotalQuery);
        this.$delete(Params,'startTime');
        this.$delete(Params,'endTime');
        this.$delete(Params,'diagramType');
        AdminApi.getAllTaskResult(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            if(message == null ){
              this.totalWeight = 0;
              this.totalTransactionAmoun = 0;
            }else{
              this.totalWeight = message.totalWeight;
              this.totalTransactionAmoun = message.totalTransactionAmoun;
            }
          }else{
            this.$message.error(message);
          }
        })
      },
      ChangeData:function(){
        this.timeSelected = ""
      },
      GetList:function(){
        // this.implementSelected= [this.options[0].value];
        this.dataloading = true
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
      GetInfo:function(id){
        this.$router.push({name:'dataView',query:{taskId:id}})
      },
      download:function(id){
        let Params= Object.assign({},this.SearchData);
        this.$delete(Params,'currentPage');
        this.$delete(Params,'pageSize');
        Params.orderOutnum = id;
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
      changeGrainId(Value){
        this.SearchData.grainVariety='';
        this.VarietyOption =  this.GrainOption.find(item => item.key == Value).list
      },
      handleCurrentChange:function(val){
        this.SearchData.currentPage = val;
        this.GetList()
      },
      resetData:function(){
        this.$refs['SearchData'].resetFields();
        this.GetList()
      },

      //选择营业部、任务单位
      handleChange(value) {
        if(value.length == 1){
          this.TotalQuery.type = this.$refs.myCascader.getCheckedNodes()[0].value;
          this.TotalQuery.userId = '';
        }else if(value.length == 2){
          this.TotalQuery.type = value[0];
          this.TotalQuery.userId = this.$refs.myCascader.getCheckedNodes()[0].value;
        }
        this.GetTotal();
        this.getPieEchartData();
        this.getEchart();
      },
      //直接选择时间
      doHandleYear() {
        let myDate = new Date();
        let tYear = myDate.getFullYear();
        return tYear;
      },
      doHandleMonth(){
        let myDate = new Date();
        let tMonth = myDate.getMonth();
        let m = tMonth + 1;
        if (m.toString().length == 1) {
          m = "0" + m;
        }
        return m;
      },
      getCurrentMonthLast(){
        let date=new Date();
        let currentMonth=date.getMonth();
        let nextMonth=++currentMonth;
        let nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
        let oneDay=1000*60*60*24;
        let lastTime = new Date(nextMonthFirstDay-oneDay);
        let month = parseInt(lastTime.getMonth()+1);
        let day = lastTime.getDate();
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        return date.getFullYear() + '-' + month + '-' + day;
      },
      chooseTime(e){
        this.timeSelected = e;
        let year = this.doHandleYear();
        let mouth = this.doHandleMonth();
        if(e == '0'){
          this.TotalQuery.startTime = "";
          this.TotalQuery.endTime = "";
        }else if(e == '1'){
          this.TotalQuery.startTime = year+"-01-01";
          this.TotalQuery.endTime = year+"-12-31";
        }else if(e == '2'){
          this.TotalQuery.startTime = year + "-" + mouth + "-01";
          this.TotalQuery.endTime = this.getCurrentMonthLast();
        }
        this.getEchart();
      },
      ChangeNumberChose:function(){
        if(this.TotalQuery.diagramType==1){
          this.unit = '吨'
        }else if(this.TotalQuery.diagramType==2){
          this.unit = '万元'
        }else{
          this.unit = '元/吨'
        }
        this.getEchart()
      },

      //折线图种类隐藏显示
      ChoseShow:function(name,tab){
        let chartQuery = Object.assign({},this.TotalQuery);
        let userId = '';
        let type = chartQuery.type;
        if(type != '1'){
          userId = this.TotalQuery.userId;
          // if(chartQuery.type == '3'){
          type = '2';
          // }
        }
        let Params = {'userId':userId,'type': type,'status':tab==1?'2':'1','grainName':name,'diagramType':this.TotalQuery.diagramType};
        AdminApi.setShowGrain(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.getEchart()
          }else{
            this.$message.error(message);
          }
        })
      },
      getEchart(){
        let Params = Object.assign({},this.TotalQuery);
        // this.$delete(Params,'diagramType');
        AdminApi.getDiagram(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            let tradingMaxList = [];
            let tradingMinList = [];
            let tradingVolumeList = [];
            let tradingAveList = [];
            let tradingVolumeListXData = [];
            let ZData = [];
            let tradingAveListXdata = [];
            let tradingTotalList = [];
            let tradingTotalListXdata = [];
            let colorIndex = [];
            if(message.tradingVolumeList){
              message.tradingVolumeList.map((item,index)=>{
                if(item.tab == 1){
                  tradingVolumeListXData.push(item.name);
                  tradingVolumeList.push(item.value);
                  colorIndex.push(item.color);
                  ZData.push(1)
                }
              })
            }
            if(message.tradingMaxList){
              message.tradingMaxList.map(item=>{
                if(item.tab == 1){
                  tradingMaxList.push(item.value)
                }
              })
            }
            if(message.tradingMinList){
              message.tradingMinList.map(item=>{
                if(item.tab == 1){
                  tradingMinList.push(item.value)
                }
              })
            }
            if(message.tradingAveList){
              message.tradingAveList.map(item=>{
                if(item.tab == 1){
                  tradingAveListXdata.push(item.name);
                  tradingAveList.push(item.value)
                }
              })
            }
            if(message.tradingTotalList){
              message.tradingTotalList.map(item=>{
                if(item.tab == 1){
                  tradingTotalListXdata.push(item.name);
                  tradingTotalList.push(item.value)
                }
              })
            }
            if(this.TotalQuery.diagramType==3){
              this.ChoseOptionList = message.tradingAveList;
              this.getLineEchart(tradingMaxList,tradingMinList,tradingAveList,tradingAveListXdata)

            }
            else if(this.TotalQuery.diagramType==2){
              this.ChoseOptionList = message.tradingVolumeList
              this.getBarEchart(tradingVolumeList,tradingVolumeListXData,ZData,colorIndex)
            }
            else{
              this.ChoseOptionList = message.tradingVolumeList
              this.getBarEchart(tradingVolumeList,tradingVolumeListXData,ZData,colorIndex)
            }
          }else{
            this.$message.error(message);
          }
        })
      },
      getPieEchart:function(EchartColor,Piedata){
        let myChart = echarts.init(this.$refs.myEchart);
        window.onresize = myChart.resize;
        this.charts = echarts.init(document.getElementById('myechart'))
        this.charts.clear();
        this.charts.setOption({
          color:EchartColor,
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} 吨({d}%)'
          },
          title:{
            text:"品类占比",
            left:"center",
            top:"50%",
            textStyle:{
              color:"#333333",
              fontSize:14,
              align:"center"
            }
          },
          graphic:{
            type:"text",
            left:"center",
            top:"40%",
            style:{
              text:"总交易",
              textAlign:"center",
              color:"#333333",
              fontSize:16,
              fontWeight:700
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['55%', '80%'],
              label: {
                show: false,
                position: 'center'
              },
              data: Piedata
            }
          ]
        })
      },
      getBarEchart:function(BarData,XData,ZData,colorIndex){
        let colors = [{
          type: 'linear',
          x: 0, x2: 1, y: 0, y2: 0,
          colorStops: [{
            offset: 0,
            color: '#A1ECDA'
          }, {
            offset: 0.5,
            color: '#A1ECDA'
          }, {
            offset: 0.5,
            color: '#73DAC1'
          }, {
            offset: 1,
            color: '#73DAC1'
          }]
        },{
          type: 'linear',
          x: 0, x2: 1, y: 0, y2: 0,
          colorStops: [{
            offset: 0,
            color: '#F6A8A8'
          }, {
            offset: 0.5,
            color: '#F6A8A8'
          }, {
            offset: 0.5,
            color: '#F16868'
          }, {
            offset: 1,
            color: '#F16868'
          }]
        },{
          type: 'linear',
          x: 0, x2: 1, y: 0, y2: 0,
          colorStops: [{
            offset: 0,
            color: '#F3D4A7'
          }, {
            offset: 0.5,
            color: '#F3D4A7'
          }, {
            offset: 0.5,
            color: '#F1B966'
          }, {
            offset: 1,
            color: '#F1B966'
          }]
        },{
          type: 'linear',
          x: 0, x2: 1, y: 0, y2: 0,
          colorStops: [{
            offset: 0,
            color: '#A0DDF3'
          }, {
            offset: 0.5,
            color: '#A0DDF3'
          }, {
            offset: 0.5,
            color: '#48C1ED'
          }, {
            offset: 1,
            color: '#48C1ED'
          }]
        },{
          type: 'linear',
          x: 0, x2: 1, y: 0, y2: 0,
          colorStops: [{
            offset: 0,
            color: '#D7D8F9'
          }, {
            offset: 0.5,
            color: '#D7D8F9'
          }, {
            offset: 0.5,
            color: '#9A9CE3'
          }, {
            offset: 1,
            color: '#9A9CE3'
          }]
        },{
          type: 'linear',
          x: 0, x2: 1, y: 0, y2: 0,
          colorStops: [{
            offset: 0,
            color: '#E9E9E9'
          }, {
            offset: 0.5,
            color: '#E9E9E9'
          }, {
            offset: 0.5,
            color: '#D8D8D8'
          }, {
            offset: 1,
            color: '#D8D8D8'
          }]
        }];
        let barWidth = 30;


        // let colorLeft = ['#A2ECD8', '#F3A7A8', '#F2D5A6', '#9CDCF4', '#D5D9FB', '#EAE8EB']
        let colorTop = this.echartColor
        // let colorRight = ['#73D9C0', '#F4696C', '#EEBA67', '#4AC0EC', '#999CE2', '#DAD7DB']
        let myBarEchart = echarts.init(this.$refs.myBarEchart);
        window.onresize = myBarEchart.resize;
        this.charts = echarts.init(document.getElementById('EchartBarData'))
        this.charts.clear();
        this.charts.setOption({
          grid: {
            top: '40',
            bottom:'30%'
          },
          xAxis: {
            splitLine:{
              show:false //网格线
            },
            axisTick: {
              show: false //刻度线
            },
            data: XData
          },
          yAxis: {
            splitLine:{
              show:false //网格线
            },
            axisTick: {
              show: false //刻度线
            },
          },
          series: [{
            z:1,
            type: 'bar',
            barWidth:barWidth,
            data:BarData,
            itemStyle:{
              normal:{
                color:function(params) {
                  return colors[colorIndex[params.dataIndex]]
                },
              }
            },
          },{
            z:2,
            name:'底部',
            type:'pictorialBar',
            data :ZData,
            symbol :'diamond',
            symbolOffset:[0,'50%'],
            symbolSize:[barWidth,10],
            itemStyle:{
              normal:{
                color:function(params) {
                  return colors[colorIndex[params.dataIndex]]
                },
              }
            },
          },{
            z:3,
            name:'上部1',
            type:'pictorialBar',
            symbolPosition:'end',
            data:BarData,
            symbol :'diamond',
            symbolOffset:[0,'-50%'],
            symbolSize:[barWidth - 4,10 * (barWidth - 4) / barWidth],
            itemStyle:{
              normal:{
                color: function(params) {
                  return colorTop[colorIndex[params.dataIndex]]
                },
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}'
                },
              }
            },
          }]
        })
      },
      getLineEchart:function(tradingMaxList,tradingMinList,tradingAveList,XData){
        let myBarEchart = echarts.init(this.$refs.myBarEchart);
        window.onresize = myBarEchart.resize;
        this.charts = echarts.init(document.getElementById('EchartBarData'))
        this.charts.clear();
        this.charts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            icon: 'circle',
            data: ['最高成交价', '平均成交价', '最低成交价'],
            right:100,
            orient:'vertical',
            itemWidth: 8,
            itemHeight: 8,
          },
          grid: {
            top: '40',
            bottom:'30%'
          },
          xAxis:{
            type: 'category',
            splitLine:{
              show:false //网格线
            },
            axisTick: {
              show: false //刻度线
            },
            data: XData
          },
          yAxis: {
            type: 'value',
            splitLine:{
              show:false //网格线
            },
          },
          series: [{
            name: '最高成交价',
            type: 'line',
            data: tradingMaxList,
            itemStyle: {
              borderWidth: 3,
              borderColor: '#3ABDEE',
              color: '#3ABDEE'
            }
          },
            {
              name: '平均成交价',
              type: 'line',
              data: tradingAveList,
              itemStyle: {
                borderWidth: 3,
                borderColor: '#F45858',
                color: '#F45858'
              }
            },
            {
              name: '最低成交价',
              type: 'line',
              data: tradingMinList,
              itemStyle: {
                borderWidth: 3,
                borderColor: '#F7B759',
                color: '#F7B759'
              }
            }]
        })
      },
      getPieEchartData(){
        let Params = Object.assign({},this.TotalQuery);
        this.$delete(Params,'startTime');
        this.$delete(Params,'endTime');
        this.$delete(Params,'diagramType');
        AdminApi.getPieDiagram(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){

            // message.tradingVolumeList.map(item=>{
            //   echartColor.push(item.color)
            // });

            let echartColor = []
            if(message.tradingVolumeList){
              message.tradingVolumeList.map(item=>{
                echartColor.push(this.echartColor[item.color*1-1])
              })
            }

            this.tradingVolumeListOption = message.tradingVolumeList;
            this.getPieEchart(echartColor,message.tradingVolumeList)
          }else{
            this.$message.error(message);
          }
        })
      },
    },
    mounted() {
      //表格筛选条件 品类
      this.getGrain();
      this.GetDepartList();
      this.GetCompanyList();
      this.GetList();// 表格数据
      this.GetTotal();//总金额
      this.getPieEchartData();//饼图
      this.getEchart();//柱状图、折线图
    }
  }
</script>

<style>
  .EchartContent{
    width: 98%;
    margin: 0 auto 1.25rem auto;
  }
  .EchartBar{width: 59%;height: 350px;}
  .EchartBar,.EchartPieitem,.DataItem{background: #FFFFFF;}
  .EchartPie{display: flex;flex-direction: column;justify-content: space-between;width: 40%;height: 350px;}
  .EchartPieitem{width: 100%;margin-top: 0.625rem;height: 12rem;}
  .DataItem{height: 180px;width: 100%;padding:15px;}
  .DataItem p{font-size: 14px;color: #999999;}
  .DataItem .DataItem-item{width: 50%;height: 3rem;display: flex;flex-direction: row;justify-content: flex-start;}
  .DataItem .DataItem-item .icon{width: 3.75rem;text-align: center;font-size: 1.5rem;line-height: 3rem;}
  .DataItem .DataItem-item .icon .iconitem{border-radius: 50%;background: #FFF6EE;padding: 0.625rem;}
  .DataItem .DataItem-item .icon .iconitem.blurcolor{background: #EAF3FF;}
  .DataItem .DataItem-item .dataShow h4{margin: 0;line-height: 2.5rem;color: #333333;font-size: 1.25rem;font-weight: initial;}
  .MarginTop30{margin-top: 1.875rem;}
  .DataItem .title{padding-left:0.3125rem;}
  .EchartPieitem-item{width: 35%;display: flex;flex-flow: row;justify-content: space-between;flex-wrap: wrap;margin-top: 1.875rem;}
  .EchartPieitem-item div{width: 50%;color: #333333;font-size: 0.875rem;}
  .EchartPieitem-item div span{border-radius: 50%;width: 10px;height: 10px;display: inline-block;margin-right: 10px;}
  .EchartPieitem-item-pie{width: 65%;height: 200px;}
  .SearchData{margin: 0.625rem 1.5625rem;overflow: hidden;display: flex;flex-flow: row;flex-wrap: wrap;justify-content: space-between;}
  .SearchData .tagItem{margin-right: 0.625rem;}
  .SearchData .tagItem span{color: #333333;font-size: 0.875rem;cursor: pointer;line-height: 36px;padding: 2px 8px;border-radius: 14px;}
  .SearchData .tagItem span.isActive{background: #E8F4FF;color: #1492D3;}
  .SearchData .rightFlex{display: flex;justify-content: flex-start;flex-wrap: nowrap;flex-flow: row;}
  .content{height: auto;}
  .ShowPinzhong {margin-left: 1.5625rem;}
  .ShowPinzhong .isactive{background: #eaeaea !important;color: #666666;}
  .ShowPinzhong span{color: #fff;padding: 0.3rem 0.5rem;margin-right: 0.625rem;border-radius: 5px;cursor: pointer;font-size: 14px;}

  .time_input.el-input--prefix .el-input__inner{
    padding-right: 10px !important;
  }
  .el-date-editor.el-input.time_input{
    width: 130px;
  }
  .select_button{
    text-align: right;
  }
  .select_button .el-cascader .el-input .el-input__inner{
    color: #fff;
    background: #1492D3;
  }
</style>
