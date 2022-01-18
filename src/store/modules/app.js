// import vgo from '@/plugins/bus'
import api from '@/api/'
import utils from '@/plugins/utils'
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
    OS: {
      isPc: true,
    },
  },
  getters: {
    regions: state => state.regions,
    userInfo: state => state.userInfo,
    projectTagList: state => state.projectTagList,
    myDptList: state => state.myDptList,
    OS: state => state.OS,
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
    getMyDptList ({ commit, state }, id = null) {
      if (id !== null) {
        return api.getDepartById(id).then(data => {
          commit('myDptList', data)
        })
      } else {
        return api.getDepartById(state.userInfo.resDepartmentId).then(data => {
          commit('myDptList', data)
        })
      }
    },
    clearStore ({ commit, state }) {
      return commit('clearStore')
    },
    checkOS ({ commit, state }) {
      return commit('checkOS')
    },
  },
  mutations: {
    userInfo (state, data) {
      if (data.photo) {
        data.originPhotoPath = JSON.parse(JSON.stringify(data.photo))
        data.photo = data.photo.slice(1, data.photo.length)
        data.photo = $globalconfig.API + data.photo
      }
      state.userInfo = data
      state.userInfo.isLeader = data.resDepartmentId !== 0
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
    checkOS (state) {
      state.OS.isPc = utils.UAis('pc')
    },
  },
}
