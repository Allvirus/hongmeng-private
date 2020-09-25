// import vgo from '@/plugins/bus'
import api from '@/api/'
export default {
  state: {
    regions: [],
    userInfo: {},
    projectTagList: [],
  },
  getters: {
    regions: state => state.regions,
    userInfo: state => state.userInfo,
    projectTagList: state => state.projectTagList,
  },
  actions: {
    // 获取服务器城市数据
    getRegions ({ commit, state }) {
      !state.regions.length && api.getRegions().then(data => {
        commit('regions', data)
      })
    },
    // 用户信息
    getUserInfo ({ commit, state }) {
      return api.getUserInfo().then(data => {
        commit('userInfo', data)
      })
    },
    // 标签列表
    getProjectTagList ({ commit, state }) {
      if (state.projectTagList.length) {
        return state.projectTagList
      }
      return api.getProjectTagList().then(data => {
        commit('projectTagList', data)
      })
    },
  },
  mutations: {
    userInfo (state, data) {
      state.userInfo = data
    },
    projectTagList (state, data) {
      state.projectTagList = data
    },
  },
}
