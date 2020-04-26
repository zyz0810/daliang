<template>
  <el-row>
    <el-col :span="24">
      <el-menu class="top-navbar" mode="horizontal" text-color="#fff" active-text-color="#fff">
        <!-- 系统标题 -->
        <router-link to="/admin" style="display: table;">
          <el-menu-item index="1" class="title-name"><img src="../assets/img/logo_top.png" class="logo_top"/>欢迎登录粮食现货流向流量业务后台管理系统</el-menu-item>
        </router-link>
        <!-- 管理者信息 -->
        <el-dropdown class="avatar-container" trigger="click" @command="Passworddialog">
          <div class="avatar-wrapper">
            <i class="el-icon-s-custom"></i>
            <div class="username-wrapper">
              <span class="user-name">{{sysUserInfo.userName}}</span>
              <i class="el-icon-caret-bottom"></i>
            </div>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <el-dropdown-item command="password">
                <i class="el-icon-lock"></i>修改登录密码
              </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="LogOut" @click="logout()"><svg-icon icon-class="SignOut"></svg-icon> 退出</span>
      </el-menu>
    </el-col>
    <el-dialog class="dialog" title="修改登录密码" :visible.sync="PassworddialogFormVisible" width="400px" :close-on-click-modal="false">
      <el-form :model="PasswordFrom" class="demo-ruleForm" :rules="rulesPasswordFrom" ref="PasswordFrom" label-width="100px" >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="PasswordFrom.oldPassword" placeholder="请输入6-20位旧密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="PasswordFrom.password" placeholder="请输入6-20位新密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="RenewPassword">
          <el-input type="password" v-model="PasswordFrom.RenewPassword" placeholder="请再次输入6-20位新密码" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="TextCenter">
        <el-button type="primary" :loading="Loginloading" @click="SubmitPassword()">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
  import AdminApi from '@/api/AdminApi.js'
  import { validatePassword } from '@/assets/js/validator';
  export default{
    data(){
      return {
        PassworddialogFormVisible:false,
        Loginloading:false,
        PasswordFrom:{
          userId:'',
          oldPassword:'',
          password:'',
          RenewPassword:''
        },
        rulesPasswordFrom:{
          oldPassword:[
            {required:true,message:'请输入6位旧密码',trigger:'blur'}
          ],
          password:[
            {required:true,message:'请输入6位新密码',trigger:'blur'},
            { validator:validatePassword, trigger:'blur'},
          ],
          RenewPassword:[
            {required:true,message:'请再次输入6位新密码',trigger:'blur'},
            { validator:validatePassword, trigger:'blur'},
            { validator:(rule,value,callback)=>{ if(value != this.PasswordFrom.password){ callback(new Error('两次密码输入不一致')); } else { callback(); } }, trigger:'blur' },
          ]
        }
      }
    },
    components:{
    },
    computed:{
      sysUserInfo(){
        if(sessionStorage.getItem('UserInfo')) {
          return JSON.parse(sessionStorage.getItem('UserInfo'))
        } else {
          return ''
        }
      },
    },
    methods:{
      logout(){
        this.$store.dispatch('user/logout').then(() => {
          location.reload()
        })
      },
      Passworddialog(command){
        this.PassworddialogFormVisible = true;
        this.PasswordFrom.oldPassword = '';
        this.PasswordFrom.password = '';
        this.PasswordFrom.RenewPassword = '';
        this.Loginloading = false
      },
      SubmitPassword:function(){
        this.$refs['PasswordFrom'].validate((valid)=>{
          if(valid){
            this.Loginloading = true;
            let Params = this.PasswordFrom;
            Params.userId = JSON.parse(sessionStorage.getItem('UserInfo')).userId;
            // this.Params.userId = '11';
            this.$delete(Params,'RenewPassword');
            AdminApi.updatePwdLogin(Params).then(data => {
              this.Loginloading = false;
              let { message , statusCode } = data;
              if(statusCode == 200){
                this.PassworddialogFormVisible = false;
                this.$message.success(message);
              }else{
                this.$message.error(message);
              }
            })
          }else{
            this.$message.error('请输入正确的信息');
          }
        })
      }
    },
  }
</script>

<style lang="stylus">
.top-navbar {
  position:fixed;
  width:100%;
  z-index:10;
  border-bottom:none !important;
}
.top-navbar .el-menu-item {
  font-size 20px
  &:hover {
    background-color:transparent;
  }
  &:focus {
    background-color:transparent;
  }
}
.avatar-container {
  position: absolute;
  top: 15px;
  right: 90px;
  color: #fff;
  .avatar-wrapper {
    cursor: pointer;
    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .username-wrapper {
      display: inline-block;
      height: 30px;
      line-height: 30px;
    }
  }
}
.LogOut{
    position: absolute;
    top: 20px;
    right: 20px;
    color: #fff;
    font-size 0.875rem
    cursor pointer
}
.TextCenter{
  text-align center
}
  .logo_top{
    width 50px;
    height 50px;
  }
</style>
