<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4><span class="date" v-if="startDate!=''"><i class="el-icon-warning title_warn"></i>数据信息自{{startDate}}起</span></div>
      <div class="select_button">
        <el-cascader v-model="implementSelected" :show-all-levels="false" :options="options" :props="{ expandTrigger: 'hover' }" ref="myCascader" @change="handleChange"></el-cascader>
      </div>
    </div>
    <div class="EchartContent">
      <el-row class="sum" :gutter="10" style="margin-left: 0;margin-right: 0;">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6" style="padding-left: 0;" class="sum_item">
          <div class="Flex DataItem">
            <div class="DataItem-item">
              <div class="icon"><span class="iconitem"><svg-icon icon-class="MoneyPock"></svg-icon></span></div>
              <div class="dataShow">
                <p>合同总金额（元）</p>
                <h4><countTo :startVal='0' :endVal='contractTotalAmoun' :duration='3000' :decimals='2'></countTo></h4>
              </div>
            </div>
            <div class="DataItem-item">
              <div class="icon"><span class="iconitem blurcolor"><svg-icon icon-class="dataMoneyPock"></svg-icon></span></div>
              <div class="dataShow">
                <p>合同总交易数量（吨）</p>
                <h4><countTo :startVal='0' :endVal='contractTotalWeight' :duration='3000' :decimals='2'></countTo></h4>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6" class="sum_item">
          <div class="Flex DataItem">
            <div class="DataItem-item">
              <div class="icon"><span class="iconitem"><svg-icon icon-class="MoneyPock"></svg-icon></span></div>
              <div class="dataShow">
                <p>任务总金额（元）</p>
                <h4><countTo :startVal='0' :endVal='taskTotalAmoun' :duration='3000' :decimals='2'></countTo></h4>
              </div>
            </div>
            <div class="DataItem-item">
              <div class="icon"><span class="iconitem blurcolor"><svg-icon icon-class="dataMoneyPock"></svg-icon></span></div>
              <div class="dataShow">
                <p>任务总交易数量（吨）</p>
                <h4><countTo :startVal='0' :endVal='taskTotalWeight' :duration='3000' :decimals='2'></countTo></h4>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6" class="sum_item">
          <div class="Flex DataItem">
            <div class="DataItem-item">
              <div class="icon"><span class="iconitem"><svg-icon icon-class="MoneyPock"></svg-icon></span></div>
              <div class="dataShow">
                <p>实际完成金额（元）</p>
                <h4><countTo :startVal='0' :endVal='completionTotalAmoun' :duration='3000' :decimals='2'></countTo></h4>
              </div>
            </div>
            <div class="DataItem-item">
              <div class="icon"><span class="iconitem blurcolor"><svg-icon icon-class="dataMoneyPock"></svg-icon></span></div>
              <div class="dataShow">
                <p>实际交易数量（吨）</p>
                <h4><countTo :startVal='0' :endVal='completionTotalWeight' :duration='3000' :decimals='2'></countTo></h4>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6" class="EchartPieitem sum_item">
          <div class="Flex DataItem">
          <div class="EchartPieitem-item-pie">
            <div id="myechart" style="height: 180px;" ref="myEchart"></div>
          </div>
          <div class="EchartPieitem-item">
            <div v-for="(item,index) in tradingVolumeListOption"><span :style="{'background': echartColor[item.color*1-1]}"></span>{{item.name}}</div>
          </div>
          </div>
        </el-col>
      </el-row>
      <!--柱形图-->
      <el-row :gutter="10" style="margin-left: 0;margin-right: 0;">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" style="padding-left: 0;">
          <div class="EchartBar">
            <div class="SearchData">
              <h3>交易量分析</h3>
              <div class="rightFlex">
                <div class="ChoseOption-item tagItem">
                  <span :class="countTimeSelected == '0' ? 'isActive':''" data-id="0" @click="chooseTime('count','0')">全部</span>
                  <span :class="countTimeSelected == '1' ? 'isActive':''" data-id="1" @click="chooseTime('count','1')">本年</span>
                  <span :class="countTimeSelected == '2' ? 'isActive':''" data-id="2" @click="chooseTime('count','2')">本月</span>
                </div>
                <div class="ChoseOption-item dataChose" style="width: 300px;">
                  <el-date-picker class="time_input" v-model="TotalQuery.startTime" type="date" @change="ChangeData('1')" value-format="yyyy-MM-dd" placeholder="选择开始日期"> </el-date-picker>
                  <span class="zhi">至</span>
                  <el-date-picker class="time_input" v-model="TotalQuery.endTime" type="date" @change="ChangeData('1')" value-format="yyyy-MM-dd" placeholder="选择结束日期"> </el-date-picker>
                </div>
                <div class="ChoseOption-item button">
                  <el-button type="primary" size="mini" @click="getEchart()">查询</el-button>
                </div>
              </div>
            </div>
            <div class="ShowPinzhong">
              <span @click="ChoseShow(item.name,item.tab,'1')"  v-for="(item,index) in ChoseCountList" :key="index" :class="{isactive:item.tab!=1}" :style="{'background': echartColor[item.color*1]}">{{item.name}}</span>
            </div>
            <div id="EchartBarData" ref="myBarEchart" style="width: 100%;height: 300px;overflow: hidden;"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" style="padding-right: 0 !important;">
          <div class="EchartBar">
            <div class="SearchData">
              <h3>交易金额分析</h3>
              <div class="rightFlex">
                <div class="ChoseOption-item tagItem">
                  <span :class="moneyTimeSelected == '0' ? 'isActive':''" data-id="0" @click="chooseTime('money','0')">全部</span>
                  <span :class="moneyTimeSelected == '1' ? 'isActive':''" data-id="1" @click="chooseTime('money','1')">本年</span>
                  <span :class="moneyTimeSelected == '2' ? 'isActive':''" data-id="2" @click="chooseTime('money','2')">本月</span>
                </div>
                <div class="ChoseOption-item dataChose" style="width: 300px;">
                  <el-date-picker class="time_input" v-model="moneyQuery.startTime" type="date" @change="ChangeData('2')" value-format="yyyy-MM-dd" placeholder="选择开始日期"> </el-date-picker>
                  <span class="zhi">至</span>
                  <el-date-picker class="time_input" v-model="moneyQuery.endTime" type="date" @change="ChangeData('2')" value-format="yyyy-MM-dd" placeholder="选择结束日期"> </el-date-picker>
                </div>
                <div class="ChoseOption-item button">
                  <el-button type="primary" size="mini" @click="MoneyEchart()">查询</el-button>
                </div>
              </div>
            </div>
            <div class="ShowPinzhong">
              <span @click="ChoseShow(item.name,item.tab,'2')"  v-for="(item,index) in ChoseOptionList" :key="index" :class="{isactive:item.tab!=1}" :style="{'background': echartColor[item.color*1]}">{{item.name}}</span>
            </div>
            <div id="moneyBarData" ref="myMoneyEchart" style="width: 100%;height: 300px;overflow: hidden;"></div>
          </div>
        </el-col>
      </el-row>
      <!--折线图-->
      <el-row class="line_echart">
          <div class="EchartBar">
            <div class="SearchData">
              <div>
                <h3 style="display: inline-block;">交易价格走势分析</h3>
                <div class="ChoseOption-item price_select">
                  <el-select v-model="priceQuery.grainId" @change="ChangeGain()">
                    <el-option v-for="(item,index) in GrainOption" :label="item.value" :value="item.key" :key="item.key"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="rightFlex">
                <div class="ChoseOption-item tagItem">
                  <span :class="priceTimeSelected == '0' ? 'isActive':''" data-id="0" @click="chooseTime('price','0')">全部</span>
                  <span :class="priceTimeSelected == '1' ? 'isActive':''" data-id="1" @click="chooseTime('price','1')">本年</span>
                  <span :class="priceTimeSelected == '2' ? 'isActive':''" data-id="2" @click="chooseTime('price','2')">本月</span>
                </div>
                <div class="ChoseOption-item dataChose" style="width: 300px;">
                  <el-date-picker class="time_input" v-model="priceQuery.startTime" type="date" @change="ChangeData('3')" value-format="yyyy-MM-dd" placeholder="选择开始日期"> </el-date-picker>
                  <span class="zhi">至</span>
                  <el-date-picker class="time_input" v-model="priceQuery.endTime" type="date" @change="ChangeData('3')" value-format="yyyy-MM-dd" placeholder="选择结束日期"> </el-date-picker>
                </div>
                <div class="ChoseOption-item button">
                  <el-button type="primary" size="mini" @click="lineEchart()">查询</el-button>
                </div>
              </div>
            </div>
            <div id="EchartLineData" ref="myLineEchart" style="width: 100%;height: 300px;overflow: hidden;"></div>
          </div>
      </el-row>
    </div>
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
        moneyQuery:{
          userId:'',
          startTime:'',
          endTime:'',
          type:'1',
          diagramType:'2',
        },
        priceQuery:{
          userId:'',
          startTime:'',
          endTime:'',
          type:'1',
          grainId:'',
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
        countTimeSelected:'0',
        moneyTimeSelected:'0',
        priceTimeSelected:'0',
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
        ChoseCountList:[],
        dataloading:false,
        tableData:[],
        totalRecords:0,
        echartColor:['#5FDAC0', '#F25859', '#F8B652', '#2DB8EF', '#7F85E4', '#D1CED1'],
        BarData:[20,30,50,62,59,36],
        taskTotalWeight: 0,
        taskTotalAmoun: 0,
        contractTotalWeight: 0,
        contractTotalAmoun: 0,
        completionTotalWeight: 0,
        completionTotalAmoun: 0,
        startDate:'',
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
            this.priceQuery.grainId = message.grain[0].key;
            this.lineEchart();
          }else{
            this.$message.error(message);
          }
        })
      },
      GetDepartList(){
        AdminApi.getAllDepartList().then(data=>{
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
            this.options[1].children = arrList;
            this.DepartOption = message
          }else{
            this.$message.error(message);
          }
        })
      },
      GetCompanyList(){
        AdminApi.getAllCompanyList().then(data=>{
          let {message,statusCode} = data;
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
              this.taskTotalWeight = 0;
              this.taskTotalAmoun = 0;
              this.contractTotalWeight = 0;
              this.contractTotalAmoun = 0;
              this.completionTotalWeight = 0;
              this.completionTotalAmoun = 0;
              this.startDate = ''
            }else{
              if(message.startDate){
                this.startDate = message.startDate;
              }
              if(message.taskTotalWeight){
                this.taskTotalWeight = message.taskTotalWeight;
              }
              if(message.taskTotalAmoun){
                this.taskTotalAmoun = message.taskTotalAmoun;
              }
              if(message.contractTotalWeight){
                this.contractTotalWeight = message.contractTotalWeight;
              }
              if(message.contractTotalAmoun){
                this.contractTotalAmoun = message.contractTotalAmoun;
              }
              if(message.completionTotalWeight){
                this.completionTotalWeight = message.completionTotalWeight;
              }
              if(message.completionTotalAmoun){
                this.completionTotalAmoun = message.completionTotalAmoun;
              }
            }
          }else{
            this.$message.error(message);
          }
        });

      },
      ChangeData:function(val){
        if(val == '1'){
          this.countTimeSelected = ""
        }else if(val == '2'){
          this.moneyTimeSelected = ""
        }else if(val == '3'){
          this.priceTimeSelected = ""
        }
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
          this.moneyQuery.type = this.$refs.myCascader.getCheckedNodes()[0].value;
          this.moneyQuery.userId = '';
          this.priceQuery.type = this.$refs.myCascader.getCheckedNodes()[0].value;
          this.priceQuery.userId = '';
        }else if(value.length == 2){
          this.TotalQuery.type = value[0];
          this.TotalQuery.userId = this.$refs.myCascader.getCheckedNodes()[0].value;
          this.moneyQuery.type = value[0];
          this.moneyQuery.userId = this.$refs.myCascader.getCheckedNodes()[0].value;
          this.priceQuery.type = value[0];
          this.priceQuery.userId = this.$refs.myCascader.getCheckedNodes()[0].value;
        }
        this.GetTotal();
        this.getPieEchartData();
        this.getEchart();
        this.MoneyEchart();
        this.lineEchart();
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
      chooseTime(name,e){
        if(name == 'count'){
          this.countTimeSelected = e;
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
        }else if(name == 'money'){
          this.moneyTimeSelected = e;
          let year = this.doHandleYear();
          let mouth = this.doHandleMonth();
          if(e == '0'){
            this.moneyQuery.startTime = "";
            this.moneyQuery.endTime = "";
          }else if(e == '1'){
            this.moneyQuery.startTime = year+"-01-01";
            this.moneyQuery.endTime = year+"-12-31";
          }else if(e == '2'){
            this.moneyQuery.startTime = year + "-" + mouth + "-01";
            this.moneyQuery.endTime = this.getCurrentMonthLast();
          }
          this.MoneyEchart();
        }else if(name == 'price'){
          this.priceTimeSelected = e;
          let year = this.doHandleYear();
          let mouth = this.doHandleMonth();
          if(e == '0'){
            this.priceQuery.startTime = "";
            this.priceQuery.endTime = "";
          }else if(e == '1'){
            this.priceQuery.startTime = year+"-01-01";
            this.priceQuery.endTime = year+"-12-31";
          }else if(e == '2'){
            this.priceQuery.startTime = year + "-" + mouth + "-01";
            this.priceQuery.endTime = this.getCurrentMonthLast();
          }
          this.lineEchart();
        }

      },
      ChangeGain:function(){
        this.lineEchart()
      },

      //图表X轴种类隐藏显示
      ChoseShow:function(name,tab,chart){
        let chartQuery = Object.assign({},this.TotalQuery);
        let userId = '';
        let type = chartQuery.type;
        if(type != '1'){
          userId = this.TotalQuery.userId;
          // if(chartQuery.type == '3'){
            type = '2';
          // }
        }
        let Params = {'userId':userId,'type': type,'status':tab==1?'2':'1','grainName':name,'diagramType':chart};
        AdminApi.setShowGrain(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            if(chart == '1'){
              this.getEchart();
            }else if(chart == '2'){
              this.MoneyEchart();
            }
          }else{
            this.$message.error(message);
          }
        })
      },
      //饼图数据交互
      getPieEchartData(){
        let Params = Object.assign({},this.TotalQuery);
        this.$delete(Params,'startTime');
        this.$delete(Params,'endTime');
        this.$delete(Params,'diagramType');
        AdminApi.getPieDiagram(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            let echartColor = [];
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
      // 交易量分析数据交互
      getEchart(){
        let Params = Object.assign({},this.TotalQuery);
        Params.diagramType = '1';
        AdminApi.getDiagram(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            let tradingVolumeList = [];
            let tradingVolumeListXData = [];
            let ZData = [];
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
            this.ChoseCountList = message.tradingVolumeList
            this.getBarEchart(tradingVolumeList,tradingVolumeListXData,ZData,colorIndex)
          }else{
            this.$message.error(message);
          }
        })
      },
      // 交易金额分析数据交互
      MoneyEchart(){
        let Params = Object.assign({},this.moneyQuery);
        // this.$delete(Params,'diagramType');
        AdminApi.getDiagram(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            let tradingVolumeList = [];
            let tradingVolumeListXData = [];
            let ZData = [];
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
            this.ChoseOptionList = message.tradingVolumeList;
            this.getMoneyEchart(tradingVolumeList,tradingVolumeListXData,ZData,colorIndex)
          }else{
            this.$message.error(message);
          }
        })
      },
      //交易均价分析数据交互
      lineEchart(){
        let Params = Object.assign({},this.priceQuery);
        // this.$delete(Params,'diagramType');
        AdminApi.getLineDiagram(Params).then(data=>{
          let {message,statusCode} = data;
          if(statusCode == 200){
            let tradingAveListXdata = [];
            let tradingTotalList = [];
            let tradingTotalListXdata = [];
            // dayAveList
            if(message.dayAveList){
              message.dayAveList.map(item=>{
                tradingTotalListXdata.push(item.name);
                tradingTotalList.push(item.value);
                tradingAveListXdata.push(message.historyAve);
              })
            }
            this.getLineEchart(tradingTotalListXdata,tradingTotalList,tradingAveListXdata)

          }else{
            this.$message.error(message);
          }
        })
      },
      //饼图
      getPieEchart:function(EchartColor,Piedata){
        let pieCharts = echarts.init(this.$refs.myEchart);
        window.onresize = pieCharts.resize;
        this.charts = echarts.init(document.getElementById('myechart'));
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
          gird:{
            left:'0',
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
              radius: ['45%', '65%'],
              label: {
                show: false,
                position: 'center'
              },
              data: Piedata
            }
          ]
        })
      },
      //交易量柱形图
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
        let colorTop = this.echartColor;
        let myCountCharts = echarts.init(this.$refs.myBarEchart);
        window.onresize = myCountCharts.resize;
        this.chartsCount = echarts.init(document.getElementById('EchartBarData'))
        this.chartsCount.clear();
        this.chartsCount.setOption({
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
            name:'单位：吨',
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
      //交易金额柱形图
      getMoneyEchart:function(BarData,XData,ZData,colorIndex){
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
        let colorTop = this.echartColor;
        let myMoneyEchart = echarts.init(this.$refs.myMoneyEchart);
        window.onresize = myMoneyEchart.resize;
        this.chartsMoney = echarts.init(document.getElementById('moneyBarData'))
        this.chartsMoney.clear();
        this.chartsMoney.setOption({
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
            name:'单位：万元',
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
      //折线图
      getLineEchart(tradingTotalListXdata,tradingTotalList,tradingAveListXdata) {
        let colors = this.echartColor;
        let myLineEchart = echarts.init(this.$refs.myLineEchart);
        window.onresize = myLineEchart.resize;
        this.chartsPrice = echarts.init(document.getElementById('EchartLineData'));
        this.chartsPrice.clear();
        // 基于准备好的dom，初始化echarts实例
        this.chartsPrice.setOption({
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            icon: 'circle',
            data: ['单日均价', '历史平均成交价'],
            right:10,
            orient:'vertical',
            itemWidth: 8,
            itemHeight: 8,
          },
          grid:{
            top:40,
            // bottom:20,
            left:'4%',
            right:'3%'
          },
          xAxis: {
            type: 'category', // category为一级分类,适用于离散的类目数据
            boundaryGap: false,  // 无间隙
            splitLine:{
              show:false //网格线
            },
            axisTick: {
              show: false //刻度线
            },
            data: tradingTotalListXdata
          },
          yAxis: {
            name:'单位：元/吨',
            type: 'value', // 'value' 数值轴，适用于连续数据。
            splitLine:{
              show:false //网格线
            },
            axisTick: {
              show: false //刻度线
            },
            boundaryGap: [0, '100%'] // 分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比，
          },
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'empty',
              show:false
            },
            {
              type: 'inside',
              xAxisIndex: 0,
              filterMode: 'empty',
              // show:false
            },
          ],
          series: [{
              name: '单日均价',
              type: 'line',
              smooth: false,  // 开启平滑处理。true的平滑程度相当于0.5
              symbol: 'circle', // 标记的图形。
              // sampling: 'average', //  取过滤点的平均值
              symbolSize: 10,
              itemStyle: {
                normal: {
                  color:colors[0],
                  lineStyle: {
                    color:colors[0],
                  }
                }
              },
              data: tradingTotalList
            }, {
              name: '历史平均成交价',
              type: 'line',
              smooth: false,  // 开启平滑处理。true的平滑程度相当于0.5
              symbol: 'none', // 标记的图形。
              itemStyle: {
                normal: {
                  color:colors[1],
                  lineStyle: {
                    color:colors[1],
                  }
                }
              },
              data: tradingAveListXdata
            }]
        });
      }
    },
    mounted() {
      //表格筛选条件 品类
      this.getGrain();
      this.GetDepartList();
      this.GetCompanyList();
      this.GetTotal();//总金额
      this.getPieEchartData();//饼图
      this.getEchart();//柱状图、折线图
      this.MoneyEchart();
      // this.lineEchart();
      window.addEventListener("resize", () => {
        this.charts.resize();
        this.chartsCount.resize();
        this.chartsMoney.resize();
        this.chartsPrice.resize();
      });
    }
  }
</script>

<style>
  .EchartContent{
    width: 98%;
    margin: 0 auto 1.25rem auto;
  }
  .EchartContent .el-col{
    border-radius: 20px;
  }
  /*.EchartBar{width: 59%;height: 350px;}*/
  .EchartBar{height: 350px;}
  .EchartBar,.DataItem{background: #FFFFFF;}
  .EchartPie{display: flex;flex-direction: column;justify-content: space-between;width: 40%;height: 350px;}
  .EchartPieitem{display: flex;padding-right: 0 !important;}
  .DataItem{height: 180px;width: 100%;}
  .DataItem p{font-size: 14px;color: #999999;}
  .DataItem .DataItem-item{width: 50%;height: 3rem;display: flex;flex-direction: row;justify-content: center; align-items:center;background: #fff;}
  .DataItem .DataItem-item .icon{width: 3.75rem;text-align: center;font-size: 1.5rem;line-height: 3rem;}
  .DataItem .DataItem-item .icon .iconitem{border-radius: 50%;background: #FFF6EE;padding: 0.625rem;}
  .DataItem .DataItem-item .icon .iconitem.blurcolor{background: #EAF3FF;}
  .DataItem .DataItem-item .dataShow h4{margin: 0;line-height: 2.5rem;color: #333333;font-size: 1.25rem;font-weight: initial;}
  .MarginTop30{margin-top: 1.875rem;}
  /*.DataItem .title{padding-left:0.3125rem;}*/
  .date{padding-left:0.3125rem;font-size: 14px;color: #999999;}
  .EchartPieitem-item{width: 60%;display: flex;flex-flow: row;justify-content: space-between;flex-wrap: wrap;line-height: 2em;}
  .EchartPieitem-item div{width: 50%;color: #333333;font-size: 0.875rem;}
  .EchartPieitem-item div span{border-radius: 50%;width: 10px;height: 10px;display: inline-block;margin-right: 10px;}
  .EchartPieitem-item-pie{width: 40%;}
  .SearchData{margin: 0 1rem;overflow: hidden;padding:0.625rem 0;display: flex;flex-flow: row;flex-wrap: wrap;justify-content: space-between;align-items: center;}
  .SearchData .tagItem{margin-right: 0.625rem;}
  .SearchData .tagItem span{color: #333333;font-size: 0.875rem;cursor: pointer;line-height: 36px;padding: 2px 8px;border-radius: 14px;}
  .SearchData .tagItem span.isActive{background: #E8F4FF;color: #1492D3;}
  .SearchData .rightFlex{display: flex;justify-content: flex-start;flex-wrap: nowrap;flex-flow: row;}
  .content{height: auto;}
  .ShowPinzhong {margin-left: 1.5625rem;}
  .ShowPinzhong .isactive{background: #eaeaea !important;color: #666666;}
  .ShowPinzhong span{color: #fff;padding: 0.3rem 0.5rem;margin-right: 0.625rem;border-radius: 5px;cursor: pointer;font-size: 14px;}
  h4{ display: inline-block;}
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
  .sum_item{
    height: 12rem;
  }
  .Flex{
    align-items: center;
  }
  .price_select{
    display: inline-block;
    margin-left: 10px;
  }
  .line_echart{
    padding-bottom: 40px;
    margin: 20px 0 0;
    /*background: #fff;*/
  }
  .title_warn{
    color: #1492D3;
    margin: 0 3px 0 5px;
  }
  @media only screen and (min-width: 1700px){
    .el-col-xl-6 {
      width: 25%;
    }
    .el-col-lg-24 {
      width: 50%;
    }
  }

</style>
