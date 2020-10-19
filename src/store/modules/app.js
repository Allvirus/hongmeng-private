// import vgo from '@/plugins/bus'
import api from '@/api/'
export default {
  state: {
    regions: [],
    userInfo: {},
    projectTagList: [],
    myDptList: {
      list: [],
      props: {
        children: 'departments',
        label: 'name',
        valKey: 'id',
      },
      ready: false,
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
      return api.getDepartById(state.userInfo.resDepartmentId).then(data => {
        commit('myDptList', data)
      })
    },
    clearStore ({ commit, state }) {
      return commit('clearStore')
    },
  },
  mutations: {
    userInfo (state, data) {
      if (data.photo) {
        data.photo = data.photo.slice(1, data.photo.length)
        data.photo = $globalconfig.API + data.photo
      }
      state.userInfo = data
      if (data.resDepartmentId) {
        state.userInfo.isLeader = data.resDepartmentId !== 0
      }
    },
    projectTagList (state, data) {
      state.projectTagList = data
    },
    myDptList (state, data) {
      const list = state.myDptList.list
      list.splice(0, list.length)
      list.push(data)
      state.myDptList.ready = true
    },
    clearStore (state) {
      state.regions = []
      state.userInfo = {}
      state.projectTagList = []
      state.myDptList = {
        list: [],
        props: {
          children: 'departments',
          label: 'name',
          valKey: 'id',
        },
        ready: false,
      }
    },
  },
}
