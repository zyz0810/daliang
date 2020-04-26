// //定义常量
// const SET_NAME = 'SET_NAME'
// const SET_AGE = 'SET_AGE'
// const SET_AVATAR = 'SET_AVATAR'
// const SET_PERMISSIONS = 'SET_PERMISSIONS'
//
// const user = {
//   state:{
//     username: '',
//     avatar: '',
//     permissions: ''
//   },
//   mutations: {
//     [SET_NAME](state, username) {
//       state.username = username
//     },
//     [SET_AVATAR](state, avatar) {
//       state.avatar = avatar
//     },
//     [SET_PERMISSIONS](state, permissions) {
//       state.permissions = permissions
//     }
//   },
//   actions:{
//     login({ commit }, userInfo){
//       commit(SET_AVATAR, userInfo.avatar)
//       commit(SET_NAME, userInfo.userName)
//       commit(SET_PERMISSIONS, userInfo.userType)
//     },
//     // 用户退出登录
//     logout({ commit }) {
//       commit(SET_AVATAR, '')
//       commit(SET_NAME, '')
//       commit(SET_PERMISSIONS, '')
//     },
//     getuserinfo({ commit }, userInfo){
//       commit(SET_AVATAR, userInfo.avatar)
//       commit(SET_NAME, userInfo.userName)
//       commit(SET_PERMISSIONS, userInfo.userType)
//       return userInfo
//     }
//   },
//   getters: {
//     username: state => state.username,
//     avatar: state => state.avatar,
//     permissions: state => state.permissions
//   }
// }
// export default user

import { Message } from 'element-ui';
import AdminApi from '@/api/AdminApi'
const state = {
  token: '', // 用户token
  userName: '',
  userId:''
};

const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_USERNAME(state, name) {
    state.token = name
  },
  SET_USERID(state, userId) {
    state.token = userId
  }
};

const actions = {
  login ({ commit }, userInfo) {
    const { userName, passWord } = userInfo;
    return new Promise((resolve, reject) => {
      AdminApi.Login({userName:userName,passWord:passWord}).then(res => {
        if (res.statusCode === 200) {
          commit('SET_TOKEN', res.message.UserToken);
          commit('SET_USERNAME', res.message.UserName);
          commit('SET_USERID',res.message.UserId);
          let user = {
            userToken: res.message.UserToken,
            userName: res.message.UserName,
            userId:res.message.UserId,
          };
          sessionStorage.setItem('UserInfo', JSON.stringify(user));
          resolve()
        } else {
          Message.error(res.message);
          reject()
        }
      }).catch(()=>{reject()})
    })
  },
  // 用户退出登录
  logout({ commit }) {
    commit('SET_TOKEN','');
    commit('SET_USERNAME','');
    commit('SET_USERID','');
    sessionStorage.removeItem('UserInfo')
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

