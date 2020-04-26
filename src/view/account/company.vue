<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
      <el-button type="primary" icon="iconfont icon-tianjiayonghu" class="reset_button" @click="handleAddUser()">添加账号</el-button>
    </div>
    <el-row class="content">
      <el-col :span="24" class="search">
        <el-form :inline="true" :model="SearchData" ref="SearchData" class="demo-form-inline">
          <el-form-item label="账号" prop="userAccount">
            <el-input v-model="SearchData.userAccount" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="单位名称" prop="userName">
            <el-input v-model="SearchData.userName" placeholder="请输入单位名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号状态" prop="userStatus">
            <el-select v-model="SearchData.userStatus" placeholder="请选择">
              <el-option label="请选择" value=""></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="冻结" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="GetList()">查询</el-button>
            <el-button @click="resetData()" class="reset_button">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="list">
        <el-table :data="tableData" width="100%" v-loading="dataloading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#EBECED'}">
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column label="账号" prop="userAccount" align="center"> </el-table-column>
          <el-table-column label="单位名称" prop="userName" align="center"> </el-table-column>
          <el-table-column label="账号状态" align="center">
            <template slot-scope="scope" >
              <span :class="scope.row.status=='1'?'green01':'red01'">{{scope.row.status=='1'?'正常':'冻结'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" prop="crttime" align="center"> </el-table-column>
          <el-table-column label="冻结" prop="userStatus" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.userStatus" active-color="#ff4949" inactive-color="#EBECED" @change="handelUpdate(scope.$index, scope.row)" :active-value="2" :inactive-value="1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row,$index}" >
              <el-button type="text" @click="handleSales(row,$index)">营业部设置</el-button>
              <el-button type="text" class="orange01" @click="handlePassword(row,$index)">修改密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="page">
        <span class="FloatLeft TextColorGlay">共{{total}}条</span><el-pagination @current-change="handleCurrentChange"  :page-size="SearchData.pageSize" background layout="prev, pager, next,jumper" :total="total"> </el-pagination>
      </el-col>
    </el-row>
    <!-- 添加账号 -->
    <el-dialog :modal-append-to-body="false" center title="添加账号" :close-on-click-modal="false" class="dialog" :visible.sync="dialogVisible" width="600px" >
      <div class="dialog-box addMoney">
        <div>
          <el-form :model="addForm" :rules="rules" ref="addDataForm" class="addForm" label-width="100px">
            <el-form-item label="单位名称" prop="userName">
              <el-input v-model="addForm.userName" placeholder="请输入单位名称"></el-input>
            </el-form-item>
            <el-form-item label="设置账号" prop="userAccount">
              <el-input v-model="addForm.userAccount" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="设置密码" prop="password">
              <el-input type="password" v-model="addForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="设置营业部">
              <el-checkbox :indeterminate="isIndeterminate" v-model="addForm.checkAll" @change="handleCheckAllChange('add',$event)">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="addForm.departIdselsect" @change="handleCheckedCitiesChange('add',$event)">
                <el-checkbox v-for="item in salesList" :label="item.userID" :key="item.userID">{{item.userName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()" v-loading="isSubmit" :disabled="isSubmit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 营业部设置 -->
    <el-dialog :modal-append-to-body="false" center title="营业部设置" :close-on-click-modal="false" class="dialog" :visible.sync="dialogSalesVisible" width="600px" >
      <div class="dialog-box addMoney">
        <div>
          <el-form :model="salesForm" :rules="rules" ref="salesDataForm" class="addForm" label-width="100px">
            <el-form-item label="设置营业部">
              <el-checkbox :indeterminate="salesForm.isIndeterminate" v-model="salesForm.checkAll" @change="handleCheckAllChange('user',$event)">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="salesForm.departIdselsect" @change="handleCheckedCitiesChange('user',$event)">
                <el-checkbox v-for="item in salesListUser" :label="item.userID" :key="item.userID">{{item.userName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogSalesVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateSales()">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog :modal-append-to-body="false" center title="提示" :close-on-click-modal="false" class="dialog" :visible.sync="dialogFrozenVisible" width="600px" >
      <div class="dialog-box addMoney">
        <h2 class="tc">确认冻结后，该账号将无法使用</h2>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFrozenVisible = false">取 消</el-button>
          <el-button type="primary" @click="swithFalse(a)">确定</el-button>
        </span>
    </el-dialog>
    <!-- 修改密码-->
    <el-dialog :modal-append-to-body="false" title="修改密码" center :close-on-click-modal="false" class="dialog" :visible.sync="dialogPasswordVisible" width="600px" >
      <div class="dialog-box addMoney">
        <el-form :model="passwordForm" :rules="rules" ref="passwordDataForm" class="addForm" label-width="100px">
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="passwordForm.password" placeholder="请输入6位数新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newPassword">
            <el-input type="password" v-model="passwordForm.newPassword" placeholder="请再次输入6位数新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPasswordVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatePassword()">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import AdminApi from '@/api/AdminApi.js'
  import {validatePassword} from "@/common/validate";

  export default{
    data(){
      return{
        dialogSalesVisible:false,
        dialogPasswordVisible:false,
        isIndeterminate: false,
        isSubmit:false,
        rules:{
          password: [
            { required: true, message: "请输入新密码", trigger: "blur" },
            { validator: validatePassword, trigger: "blur" }
          ],
          newPassword: [
            { required: true, message: "请再次输入密码", trigger: "blur" },
            {
              validator: (rule, value, callback) => {
                if (value !== this.passwordForm.password) {
                  callback(new Error("两次密码输入不一致"));
                } else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ],
          userAccount: [{ required: true, message: "请输入账号", trigger: "blur" }],
          userName: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
        },
        salesListUser:[],
        salesForm:{
          userId:'',
          departIdselsect:[],
          userIds:'',
          checkAll: false,
          isIndeterminate:false
        },
        passwordForm:{
          userId:'',
          password:'',
          newPassword:''
        },
        addForm:{
          userAccount:'',
          userName:'',
          password:'',
          departIds:'',
          departIdselsect:[],
          checkAll: false,
        },
        a:true,
        dialogVisible:false,
        dialogFrozenVisible:false,
        SearchData:{
          userAccount:'',
          userName:'',
          userStatus:'',
          currentPage:1,
          pageSize:10
        },
        departList:{},
        dataloading:false,
        tableData:[],
        total:0,
        salesList:[],
        salesIdList:[],
        salesIdListUser:[]
      }
    },

    methods:{
      handleCurrentChange:function(val){
        this.SearchData.currentPage = val;
        this.GetList()
      },
      handleSelectionChange(val) {
        let roleIDs = val.map(item => item.roleID).join("#");
        this.roleIDs = roleIDs;
        this.userRoleList.choosedRoleID = this.roleIDs;
      },
      handleSales(row,index){
        this.dialogSalesVisible = true;
        this.salesForm.userId = row.userID; // copy obj
        this.$nextTick(() => {
          this.$refs['salesDataForm'].clearValidate()
        });
        this.salesListUser = [];
        AdminApi.getCompanyDepartList({userId:row.userID}).then(data=>{
          this.salesListUser = data.message;
          let list = data.message.filter(item => {
            if (item.checked === '1') {
              return item
            }
          });
          let salesIdListUser = [];
          for(let i =0;i<data.message.length;i++){
            let salesId = data.message[i].userID;
            salesIdListUser.push(salesId);
          }
          this.salesIdListUser = salesIdListUser;
          if(list.length == 0){
            this.salesForm.isIndeterminate = false
          }else if(list.length<data.message.length){
            this.salesForm.isIndeterminate = true
          }else if(list.length == data.message.length){
            this.salesForm.checkAll = true
          }
          this.salesForm.departIdselsect = list.map(item => item.userID);
        })
      },
      updateSales(){
        let paras = Object.assign({}, this.salesForm); // copy obj
          if(paras.departIdselsect.length>0){
            paras.userIds = paras.departIdselsect.join(",");
          }
          this.$delete(paras,'checkAll');
          this.$delete(paras,'departIdselsect');
          this.$delete(paras,'isIndeterminate');
        AdminApi.setUserDepart(paras)
          .then(res => {
            this.isSubmit = false;
            if (res.statusCode === 200) {
              this.$message({ type: "success", message: res.message });
              this.dialogSalesVisible = false;
              this.GetList();
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(() => {
            this.isSubmit = false;
          });
      },
      resetTemp() {
        this.passwordForm={
          userId:'',
          password:'',
          newPassword:''
        }
      },
      handlePassword(row,index){
        this.resetTemp();
        this.dialogPasswordVisible = true;
        this.passwordForm.userId = row.userID; // copy obj
        this.$nextTick(() => {
          this.$refs['passwordDataForm'].clearValidate()
        })
      },
      updatePassword(){
        this.$refs['passwordDataForm'].validate((valid) => {
          if (valid) {
            let Params = Object.assign({},this.passwordForm);
            this.$delete(Params,'password');
            AdminApi.updateUserPassword(Params).then((res) => {
              if (res.statusCode === 200) {
                this.$message({ type: "success", message: res.message });
                this.dialogPasswordVisible = false;
              } else {
                this.$message.error(res.message);
              }
            })
          }
        })
      },
      handelUpdate(index,row){
        // ：active-value得为true
        // ：inactive-value得为false
        let flag = row.userStatus //保存点击之后v-modeld的值(true，false)
        // row.userStatus = !row.userStatus //保持switch点击前的状态
        if(row.userStatus == '2'){
          row.userStatus = 1
        }else{
          row.userStatus =2
        }
        let paras = {
          userId:row.userID,
          userStatus:flag,
        };

        this.$confirm('是否确认此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(flag == '2'){
            AdminApi.frozenUser(paras).then(res => {
                if (res.statusCode === 200) {
                  row.userStatus = 2;
                  // 逻辑处理
                  this.$message.success('账号冻结成功!');
                  this.GetList();
                } else {
                  this.$message.error(res.message);
                }
              }).catch(() => {

            });
          }else{

            AdminApi.frozenUser(paras).then(res => {
              if (res.statusCode === 200) {
                row.userStatus = 1;
                // 逻辑处理
                this.$message.success('账号解冻结成功！');
                this.GetList();
              } else {
                this.$message.error(res.message);
              }
            }).catch(() => {

            });

          }
        }).catch(() => {
          this.$message.info('取消操作！')
        });
      },
      handleCheckAllChange(type,val) {
        if(type=='add'){
          this.addForm.departIdselsect = val ? this.salesIdList : [];
          this.isIndeterminate = false;
        }else if(type=='user'){
          this.salesForm.departIdselsect = val ? this.salesIdListUser : [];
          this.salesForm.isIndeterminate = false;
        }
      },
      handleCheckedCitiesChange(type,value) {
        if(type=='add'){
          let checkedCount = value.length;
          this.addForm.checkAll = checkedCount === this.salesList.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.salesList.length;
        }else if(type=='user'){
          let checkedCount = value.length;
          this.salesForm.checkAll = checkedCount === this.salesIdListUser.length;
          this.salesForm.isIndeterminate = checkedCount > 0 && checkedCount < this.salesIdListUser.length;
        }
      },
      GetList:function(){
        this.dataloading = true;
        let Params = this.SearchData;
        AdminApi.getCompanyList(Params).then(data=>{
          this.dataloading = false;
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.tableData = message.records;
            this.total = message.totalRecords
          }else{
            this.$message.error(message);
          }
        })
      },
      //重置
      resetData:function(){
        this.$refs['SearchData'].resetFields();
        this.GetList()
      },
      getSales:function(){
        AdminApi.getAllDepartList().then(data=>{
          this.dataloading = false;
          let {message,statusCode} = data;
          if(statusCode == 200){
            this.salesList = message;
            let salesIdList = [];
            for(let i =0;i<message.length;i++){
              let salesId = message[i].userID;
              salesIdList.push(salesId);
            }
            this.salesIdList = salesIdList
          }else{
            this.$message.error(message);
          }
        })
      },

      // 添加单位账号
      handleAddUser() {
        this.isIndeterminate = false;
        this.addForm={
          userAccount:'',
            userName:'',
            password:'',
            departIds:'',
            departIdselsect:[],
            checkAll: false,
        };
        this.dialogVisible = true;
        // if (this.$refs["ruleForm"] !== undefined) {
          this.$nextTick(() => {
            this.$refs["addDataForm"].resetFields();
          });
        // }
      },
      //添加单位账号
      addUser() {
        this.$refs["addDataForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            let paras = Object.assign({}, this.addForm); // copy obj
            if(paras.departIdselsect.length>0){
              paras.departIds = paras.departIdselsect.join(",");
            }
            this.$delete(paras,'checkAll');
            this.$delete(paras,'departIdselsect');
            AdminApi.addCompanyUser(paras)
              .then(res => {
                this.isSubmit = false;
                if (res.statusCode === 200) {
                  this.$message({ type: "success", message: res.message });
                  this.dialogVisible = false;
                  this.GetList();
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch(() => {
                this.isSubmit = false;
              });
          }
        });
      },

    },
    mounted() {
      this.getSales();
      this.GetList()
    }
  }
</script>

<style scoped>
</style>
