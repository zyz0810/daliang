<!-- 用户分页设置 -->
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
          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="search.userName" placeholder="请输入用户姓名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getlist()">查询</el-button>
            <el-button @click="resetData()" class="reset_button">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="list">
        <el-table :data="tableDataList" width="100%" v-loading="dataloading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#EBECED'}">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="userAccount" label="账号" align="center"></el-table-column>
          <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="operateText" label="操作" align="center"></el-table-column>
          <el-table-column prop="crttime" label="登录时间" align="center"></el-table-column>
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
import { GetAddressMap, choseAddress } from "@/common/common";
import {validateEMail, validatePhone, validatePassword} from "@/common/validate";
import http from "@/api/AdminApi";

export default {
  name: "listUser",
  data() {
    return {

      dataloading: true,
      userID: "",
      dialogVisible: false,
      dialogVisibleEdit: false,
      dialogVisibleRole: false, //分配角色
      totalRecords: 0,
      edit: {
        password: "",
        checkPass: ""
      },
      editRules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePassword, trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.edit.password) {
                callback(new Error("两次密码输入不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      roleID: "", // 修改Id
      roleIDs: "", // 批量Id
      cityAll: [],
      areaAll: [],
      Agentlist: [],
      province: "",
      search: {
        userName: "",
        userAccount:"",
        currentPage: 1,
        pageSize: 10
      },
      searchrules: {},
      tableData: [],
      tableDataList: [],
      isSubmit: false,
      ruleForm: {
        userProvince: "",
        userCity: "",
        userCounty: ""
      },
      choseRole: {
        userId: ""
      },
      userRoleList: {
        //绑定角色
        userID: "",
        choosedRoleID: ""
      },
      roleList: {
        roleName: "",
        currentPage: 1,
        pageSize: 10
      },
      rules: {
        userAccount: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        userPhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        userName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        userAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        userBirthday: [
          { required: true, message: "请选择出生日期", trigger: "change" }
        ],
        userEmail: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEMail, trigger: "blur" }
        ],
        userSex: [{ required: true, message: "请选择性别", trigger: "change" }],
        userProvince: [
          { required: true, message: "请选择省市区", trigger: "change" }
        ],
        userCity: [
          { required: true, message: "请选择省市区", trigger: "change" }
        ],
        userCounty: [
          { required: true, message: "请选择省市区", trigger: "change" }
        ]
      }
    };
  },
  created: function() {
    var self = this;
    GetAddressMap(self);
  },
  components: {},
  methods: {
    //获取列表
    getlist() {
      this.dataloading = true;
      var Params = this.search;
      http.getLoginLog(Params).then(res => {
        this.dataloading = false;
        this.tableDataList = res.message.records;
        this.totalRecords = res.message.totalRecords;
      });
      // http.getOperateLog(Params).then(res => {
      //   // this.dataloading = false;
      //   // this.tableDataList = res.message.records;
      //   // this.totalRecords = res.message.totalRecords;
      // });
    },


    handleCan() {
      this.dialogVisibleRole = false;
      // this.$Alert.hidden(this.$route.name);
    },
    //城市选择
    choseCity: function(e) {
      this.ruleForm.userCity = "";
      this.ruleForm.userCounty = "";
      let index2 = this.province.findIndex(item => item.value == e);
      var self = this;
      choseAddress(self, 0, this.province[index2].id);
    },
    choseBlock: function(e) {
      this.ruleForm.userCounty = "";
      let index = this.cityAll.findIndex(item => item.value == e);
      var self = this;
      choseAddress(self, 1, this.cityAll[index].id);
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
<style scoped>
.addMoney .el-select {
  width: 202px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 202px;
}
</style>
