// import vgo from '@/plugins/bus'
import api from '@/api/'
export default {
  state: {
    regions: [],
    userInfo: {},
    projectTagList: [],
    myDptList: {
      list: [],
      props: {},
    },
  },
  getters: {
    regions: state => state.regions,
    userInfo: state => state.userInfo,
    projectTagList: state => state.projectTagList,
    myDptList: state => state.myDptList,
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
    getMyDptList ({ commit, state }) {
      return api.getDepartById(1).then(data => {
        commit('myDptList', data)
      })
    },
  },
  mutations: {
    userInfo (state, data) {
      if (data.photo) {
        data.photo = data.photo.slice(1, data.photo.length)
        data.photo = $globalconfig.API + data.photo
      }
      state.userInfo = data
    },
    projectTagList (state, data) {
      state.projectTagList = data
    },
    myDptList (state, data) {
      state.myDptList.list.push(data)
      state.myDptList.props = {
        children: 'departments',
        label: 'name',
        valKey: 'id',
      }
    },
  },
}
