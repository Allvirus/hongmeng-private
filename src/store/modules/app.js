// import vgo from '@/plugins/bus'
import api from "@/api/";
import utils from "@/plugins/utils";

function getManagedDepartmentIds(userInfo = {}) {
  if (
    Array.isArray(userInfo.resDepartmentIds) &&
    userInfo.resDepartmentIds.length
  ) {
    return userInfo.resDepartmentIds.filter(id => id !== 0);
  }
  if (userInfo.resDepartmentId && userInfo.resDepartmentId !== 0) {
    return [userInfo.resDepartmentId];
  }
  return [];
}

function isAdminUser(userInfo = {}) {
  const isAdmin =
    userInfo.isAdmin !== undefined ? userInfo.isAdmin : userInfo.IsAdmin;
  return (
    isAdmin === true ||
    isAdmin === 1 ||
    isAdmin === "1" ||
    isAdmin === "true"
  );
}

function buildDepartmentTree(departments = []) {
  if (
    departments.some(
      item => Array.isArray(item.departments) && item.departments.length > 0
    )
  ) {
    return departments;
  }

  const nodes = departments.map(item => ({
    ...item,
    departments: []
  }));
  const byId = new Map(nodes.map(item => [item.id, item]));
  const roots = [];

  nodes.forEach(item => {
    const parentId =
      item.superiorDepartmentId !== undefined
        ? item.superiorDepartmentId
        : item.SuperiorDepartmentId;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId).departments.push(item);
    } else {
      roots.push(item);
    }
  });

  return roots;
}

export default {
  state: {
    regions: [],
    userInfo: {},
    levelNameMap: {},
    projectTagList: [],
    myDptList: {
      list: [],
      props: {
        children: "departments",
        label: "name",
        valKey: "id"
      },
      ready: false
    },
    OS: {
      isPc: true
    }
  },
  getters: {
    regions: state => state.regions,
    userInfo: state => state.userInfo,
    levelNameMap: state => state.levelNameMap,
    projectTagList: state => state.projectTagList,
    myDptList: state => state.myDptList,
    OS: state => state.OS
  },
  actions: {
    // 获取服务器城市数据
    getRegions({ commit, state }) {
      !state.regions.length &&
        api.getRegions().then(data => {
          commit("regions", data);
        });
    },
    // 用户信息
    getUserInfo({ commit, state }) {
      return api.getUserInfo().then(data => {
        commit("userInfo", data);
      });
    },
    getLevelNameMap({ commit }) {
      return api.getAllLevel().then(data => {
        commit("levelNameMap", data);
        return data;
      });
    },
    // 标签列表
    getProjectTagList({ commit, state }) {
      if (state.projectTagList.length) {
        return state.projectTagList;
      }
      return api.getProjectTagList().then(data => {
        commit("projectTagList", data);
      });
    },
    getMyDptList({ commit, state }, id = null) {
      if (id !== null) {
        return api.getDepartById(id).then(data => {
          commit("myDptList", data);
        });
      } else {
        if (isAdminUser(state.userInfo)) {
          return api.getAllDeparts().then(data => {
            const treeData = buildDepartmentTree(data || []);
            commit("myDptList", treeData);
            return treeData;
          });
        }
        const departmentIds = getManagedDepartmentIds(state.userInfo);
        if (!departmentIds.length) {
          commit("myDptList", []);
          return Promise.resolve([]);
        }
        return Promise.all(
          departmentIds.map(departmentId => api.getDepartById(departmentId))
        ).then(data => {
          commit("myDptList", data);
          return data;
        });
      }
    },
    clearStore({ commit, state }) {
      return commit("clearStore");
    },
    checkOS({ commit, state }) {
      return commit("checkOS");
    }
  },
  mutations: {
    userInfo(state, data) {
      const resDepartmentIds = getManagedDepartmentIds(data);
      if (data.photo) {
        data.originPhotoPath = JSON.parse(JSON.stringify(data.photo));
        data.photo = data.photo.slice(1, data.photo.length);
        data.photo = $globalconfig.API + data.photo;
      }
      data.resDepartmentIds = resDepartmentIds;
      data.resDepartmentId = resDepartmentIds[0] || 0;
      state.userInfo = data;
      state.userInfo.isLeader = resDepartmentIds.length > 0;
      state.userInfo.isAdmin = isAdminUser(data);
    },
    projectTagList(state, data) {
      state.projectTagList = data;
    },
    levelNameMap(state, data) {
      const map = {};
      (data || []).forEach(item => {
        const level = item.level !== undefined ? item.level : item.Level;
        const levelName =
          item.levelName !== undefined ? item.levelName : item.LevelName;
        if (level !== undefined && level !== null) {
          map[level] = levelName;
        }
      });
      state.levelNameMap = map;
    },
    myDptList(state, data) {
      const list = state.myDptList.list;
      list.splice(0, list.length);
      if (Array.isArray(data)) {
        list.push(...data);
      } else if (data) {
        list.push(data);
      }
      state.myDptList.ready = true;
    },
    clearStore(state) {
      state.regions = [];
      state.userInfo = {};
      state.levelNameMap = {};
      state.projectTagList = [];
      state.myDptList = {
        list: [],
        props: {
          children: "departments",
          label: "name",
          valKey: "id"
        },
        ready: false
      };
    },
    checkOS(state) {
      state.OS.isPc = utils.UAis("pc");
    }
  }
};
