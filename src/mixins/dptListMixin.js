export default {
  data () {
    return {
      userList: [], // 如果是领导，自己部门的员工
      searchMyData: false,
    }
  },
  async created () {
    // 获取默认部门人员列表
    if (this.userInfo && this.myDptList && this.userInfo.isLeader) {
      this.onDepartChange({ id: this.myDptList.list[0].id })
    } else {
      this.listApiForMixin = this.myApi
    }
    if (this.isMyTarget) {
      this.$utils.autoFillDateTime(this.model)
    }
  },
  methods: {
    reset () {
      this.listApiForMixin = this.myApi
      this.searchMyData = false
      this.model = JSON.parse(JSON.stringify(this.modelCopyMixin))
      this.model.resDepId = this.myDptList.list[0].id
      if (this.userInfo && this.userInfo.isLeader) {
        this.listApiForMixin = this.dtpApi
        this.userList.splice(0, this.userList.length)
        if (this.$refs.dtptree) {
          this.$refs.dtptree.reset(this.myDptList.list[0].name)
        }
        this.onDepartChange({ id: this.myDptList.list[0].id })
      }
      if (this.isMyTarget) {
        this.$utils.autoFillDateTime(this.model)
      }
      this.getListMixin()
    },
    // 搜索列表
    search (cb = null) {
      this.listApiForMixin = (!this.searchMyData && this.userInfo.isLeader)
        ? this.dtpApi : this.myApi
      if (this.isMyTarget) {
        // if (!this.userInfo.menu.wechatAuthority) {
        //   this.listApiForMixin = this.myApi
        // }
      }
      this.$utils.autoFillDateTime(this.model)
      this.getListMixin()
      if (cb !== null && typeof cb === 'function') {
        cb()
      }
    },
    // 部门改变
    onDepartChange (dtpInfo) {
      this.model.resDepId = dtpInfo.id
      this.model.userId = ''
      this.userList.splice(0, this.userList.length)
      this.$api.getDepartMembers(dtpInfo.id).then(data => {
        this.userList = data
      })
    },
  },
}
