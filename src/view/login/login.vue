<template>
  <div class="LoginConten">
    <div class="LogoImage"><img src="../../assets/img/Logo.png"/></div>
    <div class="LoginContenItem">
<!--      <div class="ChangeTitle Flex">-->
<!--        <div class="ChangeTitleItem" :class="{isactive:userType==1}">-->
<!--          <div class="cursor" @click="ExchangeType(1)">单位用户</div>-->
<!--          <div><span></span></div>-->
<!--        </div>-->
<!--        <div class="ChangeTitleItem" :class="{isactive:userType==2}">-->
<!--          <div class="cursor" @click="ExchangeType(2)">营业部</div>-->
<!--          <div><span></span></div>-->
<!--        </div>-->
<!--      </div>-->
      <el-form :model="LoginForm" :rules="rulesLogin" ref="LoginForm" class="demo-ruleForm">
      	<el-form-item prop="userName">
      		<el-input v-model.lazy="LoginForm.userName" autocomplete="off" placeholder="请输入登录账号">
            <i slot="prepend" class="el-icon-user"></i>
          </el-input>
      	</el-form-item>
      	<el-form-item prop="passWord" class="MarginTop">
      		<el-input type="password" v-model="LoginForm.passWord" autocomplete="new-password" placeholder="请输入密码" @keyup.enter.native="submitForm()">
            <i slot="prepend" class="el-icon-lock"></i>
          </el-input>
      	</el-form-item>
      	<el-form-item class="TextCenter MarginTop">
      		<el-button class="LoginButton" type="primary" :loading="Loginloading" @click="submitForm()">登录</el-button>
      	</el-form-item>
        <div class="TextCenter">
        	<span class="about" @click="AboutdialogVisible=true">关于我们</span>
        </div>
      </el-form>
    </div>
    <!-- 关于我们 -->
    <el-dialog title="关于我们" class="AboutUs" :visible.sync="AboutdialogVisible" :close-on-click-modal="false" width="800px">
      <div class="TextItem">
        <p>粮食现货流向流量业务后台管理系统是一款基于粮食大数据分析技术开发的粮食流向流量追溯平台，是为了全面完善政策性粮食出库流向、流量追踪机制建设，有效解决粮食流通领域存在的粮食交易后交收服务不完善、出库追踪机制不够健全、企业购粮入库真实性无法考证、粮食跨省流通的量级不可跟踪统计等难题。</p>
        <p>安徽大粮粮食批发市场经营管理有限公司创立于2016年7月投资创立，注册资本6000万元人民币，现安徽16个地级市均有营业部或代表处。经营范围：粮油及其副产品、农副产品的现货交易、供应、收购、储存、批发及物流中转、配送；物流代理、粮食交割代理；市场经营管理；信息技术服务；粮食贸易的转让、过户、结算代理；粮食经纪业务；粮油商品合同的管理和中介服务，粮食贸易信息咨询服务，仓储监管服务（除危险品），粮食贸易和粮食收购；自营或代理各类商品和技术的进出口业务。</p>
        <p>安徽大粮粮食批发市场经营管理有限公司是中国首家专注于粮食现货流通的创新平台，提供专业粮食现货交易场所及信息化工具；中国首家粮食现货交易第三方经纪人服务机构，用具备国际化标准的经纪人服务理念，加速粮食现货健康、稳健的流通，规避粮食现货交易中的风险，降低企业粮食采购成本；中国首家专业粮食流通大数据研究机构，深挖全球粮食行情一手数据，专业行情分析、政策解读，打好粮食市场信息战，提高市场行情的把控力度和认知度，为企业正确决策提供帮助；专注于粮食产业的信息化技术开发，从产业实际出发设计符合粮食产业相关机构使用习惯的信息化产品，打造粮食产业信息化领军品牌。</p>
        <p class="TextRight">安徽大粮粮食批发市场经营管理有限公司</p>
        <p class="TextRight">电话：400-069-6996</p>
        <p class="TextRight">网址：www.idaliang.cn</p>
      </div>
      <div class="TextCenter">
        <el-button type="primary" @click="AboutdialogVisible = false">已阅读</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import AdminApi from '@/api/AdminApi.js'
  import { mapActions , mapGetters} from 'vuex'
  import { validatePassword } from '@/assets/js/validator';
  export default{
    data(){
      return{
        userType:'1',
        Loginloading:false,
        AboutdialogVisible:false,
        LoginForm:{
          userName:'',
          passWord:'',
        },
        rulesLogin:{
          userName:[{required:true,message:'请输入登录账号',trigger:'blur'}],
          passWord:[{required:true,message:'请输入密码',trigger:'blur'}, { validator:validatePassword, trigger:'blur'},]
        },
      }
    },
    computed: {
      ...mapGetters([
        'addRouters'
      ])
    },
    methods:{
      ...mapActions([
        'login'
      ]),
      submitForm() {
        this.$refs.LoginForm.validate(valid => {
          if (valid) {
            this.Loginloading = true;
            let Params = this.LoginForm;
            this.$store.dispatch("user/login", Params)
              .then(() => {
                this.$router.push("/");
                // 延迟一分钟使得获取到动态路由数据
                setTimeout(() => {
                  this.loading = false;
                }, 1000);
              })
              .catch(() => (this.Loginloading = false));
          } else {
            this.$message.error("请输入正确的用户名和密码");
          }
        });
      },
      ExchangeType:function(type){
        this.userType = type;
        this.LoginForm.userName = "";
        this.LoginForm.passWord = "";
        this.Loginloading = false;
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .LoginConten{
    width: 100%;
    height: 100vh;
    background: url(../../assets/img/loginbackground.png) no-repeat;
    background-size:  100%  100%;
  }
  .LoginContenItem{
    width: 430px;
    height: 30rem;
    float: right;
    margin-right: 14.0625rem;
    background: #FFFFFF;
    box-shadow: 0 0 0.625rem #1492D3;
    border-radius: 0.625rem;
    margin-top: 4rem;
    }
  .LogoImage{text-align: right;padding: 5.8125rem 2% 0 0;}
  .LogoImage img{width: 25%;}
  .ChangeTitle{width: 80%;margin: 0 auto;justify-content: space-around;margin-top: 3.75rem;}
  .ChangeTitle .ChangeTitleItem{display: flex;justify-content: center;flex-flow: column;width: 25%;text-align: center;font-size:1rem;color: #999999;}
  .ChangeTitle .isactive{color: #1492D3;font-size:1.125rem;font-weight: bold;}
  .ChangeTitle .isactive div span{border-bottom: 0.1875rem solid #1492D3;display: inline-block;width: 70%;}
  .TextCenter{text-align: center;}
  .LoginConten .LoginButton{width: 360px;margin: 0 auto;font-size:1.25rem ;}
  .about{color: #1492D3;font-size: 0.75rem;cursor: pointer;}
  .cursor{cursor: pointer;}
  .TextItem{font-size: 16px;line-height: 35px;}
  .TextItem p{text-indent:32px}
  .TextRight{text-align: right;}
</style>
