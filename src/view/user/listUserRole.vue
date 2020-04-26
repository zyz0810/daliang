<!-- 角色分页设置 -->
<template>
  <div>
    <div class="Flex breadcrumbDiv MarginTop">
      <div><h4 class="TextColorGlay">{{$route.meta.title}}</h4></div>
      <el-button type="primary" icon="iconfont icon-tianjiayonghu" class="reset_button" @click="handleAddUser()">添加账号</el-button>
    </div>
    <el-row class="content">
      <el-col :span="24" class="search">
        <el-form :inline="true" :model="search" ref="search" :rules="searchrules" class="demo-form-inline">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="search.roleName" placeholder="请输入角色名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getlist()">查询</el-button>
            <el-button @click="resetData()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="list">
        <el-table :data="tableData" width="100%" v-loading="dataloading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#EBECED'}">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
          <!-- <el-table-column prop="roleID" label="角色类型"></el-table-column> -->
          <el-table-column prop="roleRemark" label="角色备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="handleRole(scope.$index, scope.row)" type="text">配置权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="page">
        <span class="FloatLeft TextColorGlay">共{{totalRecords}}条</span>
        <el-pagination :page-size="search.pageSize" @current-change="handleCurrentChange" :total="totalRecords" :background="true"> </el-pagination>
      </el-col>
    </el-row>
    <!-- 添加角色 -->
    <el-dialog :modal-append-to-body="false" center title="添加角色" :close-on-click-modal="false" :visible.sync="dialogVisible" width="600px" class="dialog" :before-close="handleClose">
<!--      <h2>添加角色</h2>-->
      <div class="dialog-box addMoney">
        <el-form :inline="true" :model="ruleForm" :rules="authRule" ref="ruleForm" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色备注" prop="roleRemark">
            <el-input v-model="ruleForm.roleRemark" placeholder="请输入角色备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addUserCancel">取 消</el-button>
          <el-button type="primary" v-loading="isSubmit" :disabled="isSubmit" @click="addUserSubmit">确定</el-button>
        </span>
    </el-dialog>

    <!-- 配置权限 -->
    <el-dialog :modal-append-to-body="false" center title="配置权限" :close-on-click-modal="false" :visible.sync="dialogVisibleRole" width="600px" class="dialog" :before-close="handleCloseRole">
      <div v-loading="authLoading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading">
        <el-button size="small" @click="handleCheckedAll">全选</el-button>
        <div class="nav_list">
          <div v-for="(item,index) in authorityLists" class="nav">
            <div class="nav_one">{{item.functionName}}</div>
            <!--二级-->
            <div class="nav_two">
              <div v-for="(child, index) in item.menuList" class="nav_last">
                <!--只有二级导航的情况-->
                <div v-if="child.menuList==null">
                  <el-checkbox-group v-model="checkAuth" class="p10">
                    <el-checkbox :label="child.functionID" :class="child.menuList == null ? 'noMenuList':'hasMenuList'">
                      <span class="menu-title"> {{child.functionName}}</span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

                <div class="flex_row" v-if="child.menuList!=null">
                  <div class="nav_txt">{{child.functionName}}5555</div>
                  <div class="nav_three">
                    <!-- 三级 -->
                    <span class="">
                       <el-checkbox-group v-model="checkAuth" class="p10">
                         <el-checkbox v-for="(childs, index) in child.menuList" :key="index" :label="childs.functionID" :class="childs.menuList == null ? 'noMenuList':'hasMenuList'">
                           <span class="menu-title"> {{childs.functionName}} </span>
                             <el-checkbox-group v-model="checkAuth2" class="menu-list-forth">
                               <el-checkbox v-for="(childss, key) in childs.menuList" :key="key" :label="childss.functionID" >
                                   {{childss.functionName}}
                               </el-checkbox>
                             </el-checkbox-group>
                         </el-checkbox>
                       </el-checkbox-group>
                     </span>
                    <!-- 四级 -->
                    <!-- <div class="menu-last">
                      <span v-for="(childs, index) in child.menuList" :key="index"  v-if="childs.menuList != null" >
                        <div class="menu-last-title">{{childs.functionName}}</div>
                        <el-checkbox-group v-model="checkAuth2">
                          <el-checkbox v-for="(childss, key) in childs.menuList" :key="key" :label="childss.functionID" v-if="childs.menuList != null">
                              {{childss.functionName}}
                          </el-checkbox>
                        </el-checkbox-group>
                      </span>
                    </div> -->
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class=""></div>
        </div>
        <div class="btns text-center mt30 tc">
          <el-button type="primary" @click="handleAuthSubmit">确认</el-button>
          <el-button type="primary" @click="handleCancleAuth">取消全选</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import http from "@/api/AdminApi";

export default {
  name: "listUserRole",
  data() {
    return {
      dataloading: true,
      dialogVisible: false, //添加角色
      dialogVisibleRole: false, //分配角色
      authorityLists: [], // 所有权限
      checkAuth: [], // 选中的权限
      checkAuth2:[],
      authLoading: false,
      totalRecords: 0,
      isSubmit: false,
      search: {
        roleName: "",
        currentPage: 1,
        pageSize: 10
      },
      searchrules: {},
      tableData: [],
      ruleForm: {
        roleName: "",
        roleRemark: ""
      },
      ss:'',
      authRule: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "submit" }
        ]
      }
    };
  },
  methods: {
    //获取列表
    getlist() {
      this.dataloading = true;
      var Params = this.search;
      http.getRolesList(Params).then(res => {
        if (res.statusCode === 200) {
          this.dataloading = false;
          this.tableData = res.message.records;
          this.totalRecords = res.message.totalRecords;
        }
      });
    },
    handleAddUser() {
      // this.$Alert.show(this.$route.name)
      this.dialogVisible = true;
    },
    // 添加确定
    addUserSubmit() {
      this.$refs["ruleForm"].validate(vaild => {
        if (vaild) {
          this.isSubmit = true;
          let data = Object.assign({}, this.ruleForm);
          http
            .addRole(data)
            .then(res => {
              this.dialogVisible = false;
              if (res.statusCode === 200) {
                 this.isSubmit = false;
                // this.$Alert.hidden(this.$route.name)
                this.$message.success(res.message);
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
    // 添加取消
    addUserCancel() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
    },
    handleCancleAuth(){
      this.checkAuth = []
      this.checkAuth2 = []
    },
    // 获取权限列表
    getRoleFunction(roleID) {
      this.authLoading = true;
      http.getRoleFunction({roleID:roleID}).then(res => {
        this.authLoading = false;
        if (res.statusCode === 200) {
          let arrChecked = [];
          for(let item of res.message) {
              if(item.menuList) {
                  arrChecked = arrChecked.concat(item.menuList);
              }
          }
          let m = [];
          for(let i = 0;i< arrChecked.length;i++){
            if(arrChecked[i].menuList){
              m = m.concat(arrChecked[i].menuList);
              for(let j in arrChecked[i].menuList){
                if(arrChecked[i].menuList[j].checked == '1'){
                  arrChecked[i].menuList[j].checked = true
                }else{
                  arrChecked[i].menuList[j].checked = false
                }
              }
            }else{
              m = m.concat(arrChecked[i]);

                if(arrChecked[i].checked == '1'){
                  arrChecked[i].checked = true
                }else{
                  arrChecked[i].checked = false
                }
            }
          }
          let f = [] //四级
          for(let i = 0;i< m.length;i++){
            if(m[i].menuList){
              f = f.concat(m[i].menuList);
            }
            for(let j in m[i].menuList){
                if(m[i].menuList[j].checked == '1'){
                  m[i].menuList[j].checked = true
                }else{
                   m[i].menuList[j].checked = false
                }
            }
          }
          let list = m.filter(item => {
            if (item.checked === true) {
              return item
            }
          });
          let list2 = f.filter(item =>{
            if (item.checked === true) {
              return item
            }
          });
          this.authorityLists = res.message;
          this.checkAuth = list.map(item => item.functionID);
          this.checkAuth2 = list2.map(item => item.functionID)
        }
      });
    },
    //分配权限
    handleRole(index, row) {
      // this.$Alert.show(this.$route.name)
      this.dialogVisibleRole = true;
      this.roleID = row.roleID;
      this.getRoleFunction(row.roleID);
    },
    // 更新权限
    handleAuthSubmit() {
      let allAuthList = this.checkAuth.concat(this.checkAuth2)
      let authLists = allAuthList.join(",")
      let data = {
        roleID: this.roleID,
        values: authLists
      };
      http.updateRoleFunction(data).then(res => {
        if (res.statusCode === 200) {
          this.dialogVisibleRole = false;
          // this.$Alert.hidden(this.$route.name)
          this.$message.success(res.message);
          this.getlist();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    checkAll(){
      function traverse(obj) {
        for (let a in obj) {
          if (typeof(obj[a]) == "object") {
            traverse(obj[a]); //递归遍历
          } else {
            console.log("44444=" + obj[a]); //如果是值就显示
          }
        }
      }
      traverse(this.authorityLists)
    },
    // 选中所有权限
    handleCheckedAll() {
      // this.checkAll()
      let arrChecked = [];
      let m = [];
      for(let item of this.authorityLists) {
          if(item.menuList) {
              arrChecked = arrChecked.concat(item.menuList);
          }
      }
      for(let i = 0;i< arrChecked.length;i++){
        if(arrChecked[i].menuList){
          m = m.concat(arrChecked[i].menuList);
          for(let j in arrChecked[i].menuList){
            arrChecked[i].menuList[j].checked = true
          }
        }else{
          m = m.concat(arrChecked[i]);
          arrChecked[i].checked = true
        }
      }

      let list = m.filter(item => {
        if (item.checked === true) {
          return item
        }
      });
      let f = [] //四级
      for(let i = 0;i< m.length;i++){
        if(m[i].menuList){
          f = f.concat(m[i].menuList);
        }
        for(let j in m[i].menuList){
          m[i].menuList[j].checked = true
        }
      }
      let list2 = f.filter(item =>{
        if (item.checked === true) {
          return item
        }
      });
      this.checkAuth = list.map(item => item.functionID);
      this.checkAuth2 = list2.map(item => item.functionID);
      //this.checkAuth = this.authorityLists.map(item => item.functionID);
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
      // this.$Alert.hidden(this.$route.name)
      done();
    },
    handleCloseRole(done) {
      // this.$Alert.hidden(this.$route.name)
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
  .p10{
    padding: 10px;
  }

  .nav{
    display: flex;
    /*align-items: center;*/
    align-items:stretch;
  }
  .nav_list{
    margin: 10px 0;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
  }
  .nav_one{
    width: 15%;
    /*flex: 1;*/
    padding: 10px 20px;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    display: flex;
    align-items: center;
  }
  .nav_one_txt{
    justify-content: center;
  }
  .nav_two{
    display: flex;
    flex: 1;
    flex-direction:column;
  }
  .nav_txt{
    flex: 1;
    padding: 10px 20px;
    border-right: 1px solid #ebeef5;
  }
  .nav_three{
    flex: 4;
  }
  .nav_last{
    border-bottom: 1px solid #ebeef5;
   }
  .flex_row{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
.addMoney .el-select {
  width: 202px;
}

.wrapper .el-checkbox {

    width: 25%;
    margin-right: 0;

}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 202px;
}

ul{
  border: 1px solid #EBEEF5;
  border-top: none;
  margin-top: 20px;
  position: relative;
}
li{
  box-sizing: border-box;
  border-top: 1px solid #EBEEF5;
  position: relative;
}
.left{
  width: 10%;
  box-sizing: border-box;
  text-align: center;
  /*position: absolute;*/
  float: left;
  position: relative;
  top:26%;
  left:0%;
  padding: 20px 0;
}

.left .el-checkbox {
  display: block !important;
}
.right-box{
  float: right;
  width: 60%;
  box-sizing: border-box;
  border-left: 1px solid #EBEEF5;
}
.menu-list{
  position: relative;
  border-bottom: 1px solid #EBEEF5;
  padding: 10px 0;
}
.middle{
  width: 12%;
  box-sizing: border-box;
  text-align: center;
  /*position: absolute;*/
  position: relative;
  top:30%;
  left:0%;
  float: left;

}
.right{
    float: right;
    width: 90%;
    box-sizing: border-box;
    border-left: 1px solid #EBEEF5;
}
.right-checkbox{
  width: 86%;
  float: right;
  border-left: 1px solid #EBEEF5;

}
/*.clearfix::after{*/
/*  clear: both;*/
/*  display: table;*/
/*  content:''*/
/*}*/
.right .menu-list:last-child{
  border-bottom: none;
}
.right .el-checkbox:nth-of-type(4){
  display: none;
}
.menu-list:nth-child(odd){
  background: #F9F9F9;
}
li:nth-last-child(2) .menu-list:first-child{
  background: none;
}
li:nth-last-child(2) .menu-list:last-child{
  background: #F9F9F9;
}
span.menu-three {
    width: 46%;
    width: 100%;
    float: left;
    display: inline-block;
    border-right: 1px solid #EBEEF5;
}
.menu-three .el-checkbox{
  width: 100%;
  border-bottom: 1px solid #EBEEF5;
  padding: 10px 10px 10px 20px;
  padding: 0px 10px 0px 20px;
  box-sizing: border-box;
}
.menu-three .el-checkbox:last-child{
  border-bottom: none;
}
.menu-three .el-checkbox-group{
  width: 100%;

}
.menu-last{
  width: 53.8%;
  display: inline-block;
  box-sizing: border-box;
  /*padding-left: center;*/
}
.menu-last-title{
    display: inline-block;
    width: 30%;
    position: absolute;
    top: 30%;
    box-sizing: border-box;
    padding-left: 9%;
}
.menu-last .el-checkbox-group{
  float: right;
  width: 50.6%;
}
.menu-last .el-checkbox{
  width: 100%;
  border-bottom: 1px solid #EBEEF5;
  padding: 10px 10px 10px 20px;
  box-sizing: border-box;
}
li.border-line{
    position: absolute;
    width: 1px;
    height: 100%;
    top: 0px;
    z-index: 999999;
    right: 21%;
    background: #EBEEF5;
}
.hasMenuList > span.el-checkbox__input{
  display: none;
}
.menu-three  .hasMenuList.el-checkbox{
  padding: 0px;
}
.menu-title{
  display: block;
}

.menu-list-forth .el-checkbox{
    display: block;
    border-bottom: 1px solid #EBEEF5;
    padding: 10px 20px;
}
.noMenuList .menu-title{
  width: 100%;
  padding-left: 10px;
}

.hasMenuList .menu-title{
    width: 50%;
    float: left;
    margin-top: 3%;
    padding-left: 4%;
    box-sizing: border-box
}

.hasMenuList .menu-list-forth{
  float: right;
  width: 48.5%;
  border-left:1px solid #EBEEF5;
  box-sizing: border-box;
}

.hasMenuList .el-checkbox__label{
  display: block;
}
.hasMenuList .el-checkbox__label:after{
  clear: both;
  display: table;
  content: "";
}
.hasMenuList .menu-list-forth .el-checkbox__label{
  display: inline-block;
}
.right-checkbox .el-checkbox{
  margin-bottom: 0px;
}
.noMenuList .el-checkbox__label{
  display: inline-block;
  width: 50%;
  border-right: 1px solid #EBEEF5;
  box-sizing: border-box;
  padding: 10px 0;
}
</style>
