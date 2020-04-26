<!-- 用户分页设置 -->
<template>
  <div>
      <!-- 添加用户 -->
      <el-dialog :modal-append-to-body="false" center title="添加用户" :close-on-click-modal="false" class="dialog" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
        <div class="dialog-box addMoney">
          <div>
            <el-form :inline="true" :model="ruleForm" class="addForm" :rules="rules" ref="ruleForm" label-width="100px">
              <el-form-item label="账号" prop="userAccount">
                <el-input v-model="ruleForm.userAccount" placeholder="请输入账号"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="userName">
                <el-input v-model="ruleForm.userName" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="userSex">
                <el-select v-model="ruleForm.userSex" placeholder="请选择">
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="2"></el-option>
                  <el-option label="保密" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="详细地址" prop="userAddress">
                <el-input v-model="ruleForm.userAddress" placeholder="请输入详细地址"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="userPhone">
                <el-input v-model="ruleForm.userPhone" placeholder="请输入电话"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" prop="userBirthday">
                <el-date-picker v-model="ruleForm.userBirthday" type="date" placeholder="请选择出生日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item label="邮箱" prop="userEmail">
                <el-input v-model="ruleForm.userEmail" placeholder="请输入邮箱"></el-input>
              </el-form-item>
<!--              <div class="clear"></div>-->
              <el-form-item label="地址" prop="userProvince">
                <el-select v-model="ruleForm.userProvince" @change="choseCity">
                  <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.value"></el-option>
                </el-select>
<!--                <el-select v-model="ruleForm.userCity" @change="choseBlock">-->
<!--                  <el-option v-for="item in cityAll" :key="item.id" :label="item.value" :value="item.value"></el-option>-->
<!--                </el-select>-->
<!--                <el-select v-model="ruleForm.userCounty">-->
<!--                  <el-option v-for="item in areaAll" :key="item.id" :label="item.value" :value="item.value"></el-option>-->
<!--                </el-select>-->
              </el-form-item>
              <el-form-item prop="userCity">
                <el-select v-model="ruleForm.userCity" @change="choseBlock">
                  <el-option v-for="item in cityAll" :key="item.id" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="userCounty">
                <el-select v-model="ruleForm.userCounty">
                  <el-option v-for="item in areaAll" :key="item.id" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="addUser()" v-loading="isSubmit" :disabled="isSubmit">确定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色 -->
      <el-dialog :modal-append-to-body="false" center title="分配角色" :close-on-click-modal="false" class="dialog" :visible.sync="dialogVisibleRole" width="600px" :before-close="handleCloseRole">
        <div class="dialog-box addMoney">
          <div>
            <el-table :data="tableData" ref="multipleTable" style="width: 100%" stripe v-loading="dataloading" @selection-change="handleSelectionChange" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading">
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
              <el-table-column prop="roleID" label="角色名称" align="center"></el-table-column>
              <el-table-column prop="roleRemark" label="角色备注" align="center"></el-table-column>
              <el-table-column type="selection" prop="isChoosed" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCan">取 消</el-button>
          <el-button type="primary" @click="addUserRole()">绑 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改密码 -->
      <el-dialog :modal-append-to-body="false" title="修改密码" :close-on-click-modal="false" class="dialog" :visible.sync="dialogVisibleEdit" :before-close="handleCloseRole" width="450px">
        <el-form :inline="true" :model="edit" ref="editForm" :rules="editRules" label-width="100px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="edit.oldPassword" type="password" placeholder="请输入6-20位旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="edit.password" type="password" placeholder="请输入6-20位新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="RenewPassword">
            <el-input v-model="edit.RenewPassword" type="password" placeholder="请再次输入6-20位新密码"></el-input>
          </el-form-item>
          <div class="btns mt50 tc">
            <el-button type="primary" @click="handleEditPass">确定</el-button>
          </div>
        </el-form>
      </el-dialog>

    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
      <el-button type="primary" icon="iconfont icon-tianjiayonghu" class="reset_button" @click="handleAddUser()">添加账号</el-button>
    </div>
    <el-row class="content">
      <el-col :span="24" class="search">
        <el-form :inline="true" :model="search" ref="search" :rules="searchrules" class="demo-form-inline">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="search.userName" placeholder="请输入用户名称" clearable></el-input>
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
          <el-table-column prop="userAccount" label="用户账号" align="center"></el-table-column>
          <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
          <el-table-column prop="userPhone" label="电话号码" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRole(scope.$index, scope.row)">权限设置</el-button>
              <el-button type="text" @click="handleEdit(scope.row)" class="orange01">修改密码</el-button>
            </template>
          </el-table-column>
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
// var user = sessionStorage.getItem("userInfo");
// user = JSON.parse(user);
// var userToken = user.userToken;

export default {
  name: "listUser",
  data() {
    return {
      checked: true,
      noChecked: false,
      dataloading: true,
      userID: "",
      dialogVisible: false,
      dialogVisibleEdit: false,
      dialogVisibleRole: false, //分配角色
      totalRecords: 0,
      edit: {
        userId:'',
        oldPassword:'',
        password:'',
        RenewPassword:''
      },
      editRules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { validator: validatePassword, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: validatePassword, trigger: "blur" }
        ],
        RenewPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
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
    let self = this;
    GetAddressMap(self);
  },
  components: {},
  methods: {
    //获取列表
    getlist() {
      this.dataloading = true;
      let Params = this.search;
      http.getUserList(Params).then(res => {
        this.dataloading = false;
        this.tableDataList = res.message.records;
        this.totalRecords = res.message.totalRecords;
      });
    },
    // 修改密码
    handleEdit(row) {
      this.edit = {
        userId:'',
        oldPassword:'',
        password:'',
        RenewPassword:''
      };
      this.userId = row.userID;
      this.edit.userId = row.userID;
      this.dialogVisibleEdit = true;
    },
    handleCancel() {
      this.dialogVisible = false;
      // this.$Alert.hidden(this.$route.name);
    },
    handleEditPass() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let params = {
            userId: this.edit.userId,
            password: this.edit.password,
            oldPassword:this.edit.oldPassword,
          };
          http.updatePwd(params).then(res => {
            if (res.statusCode == 200) {
              this.$message.success(res.message)
              // this.$Alert.hidden(this.$route.name);
              this.dialogVisibleEdit = false
            }
          });
        }
      });
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
      let self = this;
      choseAddress(self, 0, this.province[index2].id);
    },
    choseBlock: function(e) {
      this.ruleForm.userCounty = "";
      let index = this.cityAll.findIndex(item => item.value == e);
      let self = this;
      choseAddress(self, 1, this.cityAll[index].id);
    },
    // 添加用户
    handleAddUser() {
      // this.$Alert.show(this.$route.name);
      this.dialogVisible = true;
      if (this.$refs["ruleForm"] !== undefined) {
        this.$nextTick(() => {
          this.$refs["ruleForm"].resetFields();
        });
      }
    },
    //添加用户
    addUser() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          http.addUser(this.ruleForm)
            .then(res => {
              this.isSubmit = false;
              if (res.statusCode === 200) {
                this.$message({ type: "success", message: res.message });
                this.dialogVisible = false;
                // this.$Alert.hidden(this.$route.name);
                this.getlist();
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
    //分配角色
    handleRole(index, row) {
      // this.$Alert.show(this.$route.name);
      this.choseRole.userId = row.userID;
      this.userRoleList.userID = row.userID;
      this.dialogVisibleRole = true;
      this.getChooseRoleView();
    },

    // 获取分配角色列表
    getChooseRoleView() {
      let params = this.choseRole;
      http.getChooseRoleView(params).then(res => {
        this.tableData = res.message;
        for (let i in this.tableData) {
          if (this.tableData[i].isChoosed === true) {
            this.$nextTick(function() {
              this.$refs.multipleTable.toggleRowSelection(this.tableData[i]);
            });
          }
        }
      });
    },

    handleSelectionChange(val) {
      let roleIDs = val.map(item => item.roleID).join("#");
      this.roleIDs = roleIDs;
      this.userRoleList.choosedRoleID = this.roleIDs;
    },

    //绑定角色列表
    addUserRole() {
      let params = this.userRoleList;
      http.chooseRoleToUser(params).then(res => {
        if (res.statusCode === 200) {
          this.$message({ type: "success", message: res.message });
          this.dialogVisibleRole = false;
          // this.$Alert.hidden(this.$route.name);
        } else {
          this.$message.error(res.message);
        }
      });
      this.getlist();
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
    handleClose(done) {
      // this.$Alert.hidden(this.$route.name);
      done();
    },
    handleCloseRole(done) {
      // this.$Alert.hidden(this.$route.name);
      done();
    }
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
