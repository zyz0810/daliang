import AdminApi from '@/api/AdminApi.js'
import { Message } from 'element-ui'
//定义常量
const GRAON_OPTION = 'GRAON_OPTION'
const VARIETY_OPTION = 'VARIETY_OPTION'
const DEPART_OPTION = 'DEPART_OPTION'
const COMPANY_OPTION = 'COMPANY_OPTION'

const state={
    GrainOption: [],
    SalesOption:[],
    GradeOption:{1:'一等', 2:'二等', 3:'三等', 4:'四等', 5:'五等', 6:'等外'},
    VarietyOption:[],
    StatusOption:[{value:1,label:'待接收'}, {value:2,label:'进行中'}, {value:7,label:'已完成'},{value:8,label:'已取消'}],
    DepartOption:[],
    ComUserOption:[],
  },
  mutations= {
    [GRAON_OPTION](state, GrainOption) {
      state.GrainOption = GrainOption
    },
    [VARIETY_OPTION](state, VarietyOption) {
      state.VarietyOption = VarietyOption
    },

    [DEPART_OPTION](state, DepartOption) {
      state.DepartOption = DepartOption
    },
    [COMPANY_OPTION](state, CompanyOption) {
      state.ComUserOption = CompanyOption
    },
  },
  actions={
    //品类
    GetGrainOption({ commit }){
      AdminApi.getGrainList().then(data=>{
        let {message,statusCode} = data
        if(statusCode == 200){
          commit(GRAON_OPTION, message.grain)
        }else{
          Message.error(message);
        }
      })
    },

    //品种
    GetVatietyOption({ commit,state },Value){
      state.VarietyOption = []
      if(Value){
        let grainVarietyoptions = state.GrainOption.find(item => item.key == Value)
        commit(VARIETY_OPTION, grainVarietyoptions.list)
      }else{
        state.VarietyOption = []
      }
    },
    //营业部
    GetDepartOption({ commit },Value){
      // let Params = {'userType':Value}
      console.log('一一 的')
      AdminApi.getAllDepartList().then(data=>{
        let {message,statusCode} = data
        if(statusCode == 200){
          console.log('请求发 的')
          commit(DEPART_OPTION, message)
        }else{
          Message.error(message);
        }
      })
    },
    //执行单位
    GetCompanyOption({ commit },Value){
      // let Params = {'userType':Value}
      AdminApi.getAllCompanyList().then(data=>{
        let {message,statusCode} = data
        if(statusCode == 200){
          commit(COMPANY_OPTION, message)
        }else{
          Message.error(message);
        }
      })
    },
  }


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
