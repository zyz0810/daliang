import {request} from './ApiConfig'

const AdminServer = {
  // 登录
  Login (params) {
    return request({
      method: 'Post',
      url: '/api/login',
      params: params
    })
  },
  // 获取权限
  role () {
    return request({
      method: 'Get',
      url: '/api/functions',
    })
  },

  //修改登录密码
  updatePwdLogin(params) {
    return request({
      method: 'Post',
      url: '/api/user/updatePwd',
      params: params
    })
  },
/* 获取用户列表
 paras
 userName
 currentPage
 pageSize
 */
  getUserList (params) {
    return request({
      method: 'Get',
      url: '/api/user/userListView/getUserList',
      params: params
    })
  },
  //获取分配角色页面
  getChooseRoleView(params){
    return request({
      method: 'Get',
      url: '/api/user/getChooseRoleView',
      params: params
    })
  },
  updatePwd(params){
    return request({
      method: 'Post',
      url: '/api/user/updatePwd',
      params: params
    })
  },
  //添加用户
  addUser(params) {
    return request({
      method: 'Post',
      url: '/api/user/userListView/addUser',
      params: params
    })
  },

  //绑定选中角色到用户
  chooseRoleToUser(params) {
    return request({
      method: 'Post',
      url: '/api/user/user/chooseRoleToUser',
      params: params
    })
  },


  //获取角色列表：/api/user/role/getRolesList
  getRolesList(params){
    return request({
      method: 'Get',
      url: '/api/user/role/getRolesList',
      params: params
    })
  },
  //添加角色
  addRole(params) {
    return request({
      method: 'Post',
      url: '/api/user/role/addRole',
      params: params
    })
  },

  //获取角色列表：/api/user/role/getRolesList
  getRoleFunction(params){
    return request({
      method: 'Get',
      url: '/api/user/role/getRoleFunction',
      params: params
    })
  },
  //更新角色权限
  updateRoleFunction(params) {
    return request({
      method: 'Post',
      url: '/api/user/role/updateRoleFunction',
      params: params
    })
  },
  // 获取登录列表：
  getLoginLog(params){
    return request({
      method: 'Get',
      url: '/api/user/getLoginLog',
      params: params
    })
  },
  // 获取操作日志列表：
  getOperateLog(params){
    return request({
      method: 'Get',
      url: '/api/user/getOperateLog',
      params: params
    })
  },

  //单位用户接口
  // 获取单位用户列表：
  getCompanyList(params){
    return request({
      method: 'Get',
      url: '/api/flow/getCompanyList',
      params: params
    })
  },
  //添加单位用户
  addCompanyUser(params) {
    return request({
      method: 'Post',
      url: '/api/flow/addCompanyUser',
      params: params
    })
  },
  // 获取营业部数据
  getAllDepartList(){
    return request({
      method: 'Get',
      url: '/api/flow/getAllDepartList',
    })
  },
  // 获取单位拥有的营业部用户数据
  getCompanyDepartList(params){
    return request({
      method: 'Get',
      url: '/api/flow/getCompanyDepartList',
      params: params
    })
  },
  // 设置营业部：/api/flow/setUserDepart
  setUserDepart(params){
    return request({
      method: 'Post',
      url: '/api/flow/setUserDepart',
      params: params
    })
  },
// 修改单位（营业部）用户密码：/api/flow/updateUserPassword
  updateUserPassword(params) {
    return request({
      method: 'Put',
      url: '/api/flow/updateUserPassword',
      params: params
    })
  },
  // 冻结单位（营业部）用户：
  frozenUser(params) {
    return request({
      method: 'Put',
      url: '/api/flow/frozenUser',
      params: params
    })
  },
  //单位用户接口
  //  获取营业部用户列表
  getDepartList(params){
    return request({
      method: 'Get',
      url: '/api/flow/getDepartList',
      params: params
    })
  },
  // 添加营业部用户
  addDepartUse(params){
    return request({
      method: 'Post',
      url: '/api/flow/addDepartUser',
      params: params
    })
  },
  // 获取营业部下的经纪人：/api/flow/getAgentList
  getAgentList(params){
    return request({
      method: 'Get',
      url: '/api/flow/getAgentList',
      params: params
    })
  },
  // 获取任务列表数据
  getTaskOrderList(params){
    return request({
      method: 'Get',
      url: '/api/flow/getTaskOrderList',
      params: params
    })
  },
// /api/flow/getContractTaskOrderList  get   orderContract, status,userId,departId, orderOutnum, currentPage, pageSize
  getContractTaskOrderList(params){
    return request({
      method: 'Get',
      url: '/api/flow/getContractTaskOrderList',
      params: params
    })
  },
  // 获取车辆信息列表/api/flow/getCarList   get       carLicense, orderOutnum,currentPage, pageSize
  getCarList(params){
    return request({
      method: 'Get',
      url: '/api/flow/getCarList',
      params: params
    })
  },
  // 获取所有的单位用户数据
  getAllCompanyList(){
    return request({
      method: 'Get',
      url: '/api/flow/getAllCompanyList',
    })
  },
  //品种和品类都是这个接口
  getGrainList(){
    return request({
      method: 'Get',
      url: '/api/flow/getGrainList',
    })
  },

  // 根据任务id获取详情信息：
  getTaskOrder(params){
    return request({
      method: 'Get',
      url: '/api/flow/getTaskOrder',
      params:params
    })
  },
  // 获取总的 总重量、总交易额:/api/flow/getAllTaskResult   get     type 1:全部营业部，2某个营业部，3某个单位   userId
  getAllTaskResult(params){
    return request({
      method: 'Get',
      url: '/api/flow/getAllTaskResult',
      params:params
    })
  },
  // 合同：/api/flow/getContractResult   get  type,userId
  getContractResult(params){
    return request({
      method: 'Get',
      url: '/api/flow/getContractResult',
      params:params
    })
  },
  // 实际：/api/flow/getActualCompletionResult        get    type,userId
  getActualCompletionResult(params){
    return request({
      method: 'Get',
      url: '/api/flow/getActualCompletionResult',
      params:params
    })
  },
  // 获取饼状图:/api/flow/getPieDiagram  get     type 1:全部营业部，2某个营业部，3某个单位   userId
  getPieDiagram(params){
    return request({
      method: 'Get',
      url: '/api/flow/getPieDiagram',
      params:params
    })
  },
  // 获取柱状图:/api/flow/getDiagram  get     type 1:全部营业部，2某个营业部，3某个单位   userId  startTime  endTime diagramType 1、交易量 2、交易金额 3、交易均价
  getDiagram(params){
    return request({
      method: 'Get',
      url: '/api/flow/getDiagram',
      params:params
    })
  },
  // 获取折线图：/api/flow/getLineDiagram    get      参数 type,userId, grainId, startTime, endTime
  getLineDiagram(params){
    return request({
      method: 'Get',
      url: '/api/flow/getLineDiagram',
      params:params
    })
  },
  // 图表中粮食品类的显示隐藏:/api/flow/setShowGrain  get     userId,  type类型1交易量 2交易金额 3交易均价, status状态1显示 2隐藏,grainName品类名称 diagramType
  setShowGrain(params){
    return request({
      method: 'Put',
      url: '/api/flow/setShowGrain',
      params:params
    })
  },
  //下载 /api/flow/download   post   orderOutnum
  download(params){
    return request({
      method: 'Liu',
      url: '/api/flow/download',
      params:params
    })
  },

};
export default AdminServer
