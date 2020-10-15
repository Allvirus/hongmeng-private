// import fetchListMixin from '@/mixins/fetchListMixin'
// mixins: [fetchListMixin],

// created 执行ajax获取列表
// listApiForMixin: 'getDemandList',

// 自定义执行ajax获取列表 若自定义执行获取, created 不会执行ajax获取
// customExeListApiForMixin: 'getDemandList',

// BGWrap()
// el-pagination.margin-spacing(
//   :total="listMixin.count"
//   :page-size.sync='model.pageSize'
//   :current-page.sync='model.page'
//   @current-change="getListMixin")

export default {
  data () {
    return {
      listMixin: { list: [], count: 0 },
      userList: [], // 如果是领导，自己部门的员工
    }
  },
  async created () {
    // 在列表请求前预处理
    this.preMethodMixin && await this.preMethodMixin()
    // 记录重置操作 所需源数据
    this.modelCopyMixin = JSON.parse(JSON.stringify(this.model))
    // 若是返回列表 获取销毁前的状态
    if (this.$route.params.back) {
      this.model = JSON.parse(localStorage.getItem('model')) || this.model
    }
    !this.customExeListApiForMixin && this.getListMixin()
  },

  beforeDestroy () {
    // 销毁前存储状态
    localStorage.setItem('model', JSON.stringify(this.model))
  },
  methods: {
    // 获取列表
    getListMixin (page, opts = {}) {
      const { loading = true } = opts
      page && (this.model.page = page)
      return this.$api[this.listApiForMixin || this.customExeListApiForMixin](this.model, loading).then(data => {
        console.log('getListMixin', data)
        this.listMixin.list = data.list
        this.listMixin.count = data.count
        if (data.list.length <= 0 && this.model.page > 1) this.getListMixin(this.model.page - 1)
      })
    },
    /**
     * 列表修改或添加或删除 后刷新
     * @param {*} isSuccess 是否成功提示
     * @param {number} [delNum=1] 删除的数量, 超过当前页数量后 page> 1 && page -1
     */
    afterModifyGetListMixin (isSuccess, delNum = 1) {
      isSuccess && this.$vgo.tip('操作成功!', 'success')
      // 删除后页面为空情况
      if (this.model.page > 1 && this.listMixin.list.length <= delNum) this.model.page -= 1
      this.getListMixin()
    },
    // 条件筛选后 初始页面方法
    resetPageMixin () {
      if (this.userInfo.isLeader) {
        this.userList.splice(0, this.userList.length)
        this.$refs.dtptree.reset()
      }
      this.listApiForMixin = this.myApi
      this.model = JSON.parse(JSON.stringify(this.modelCopyMixin))
      this.getListMixin()
    },
    // 饿了么表格 排序 el-table(@sort-change='sortElTableMixin'
    sortElTableMixin (row) {
      if (row.order === 'descending') this.model.orderBy = row.prop + '_DESC'
      else if (row.order === 'ascending') this.model.orderBy = row.prop + '_ASC'
      else this.model.orderBy = ''
      this.getListMixin(1)
    },
    // 搜索列表
    search () {
      this.listApiForMixin =
      (this.model.resDepId !== '' && this.userInfo.isLeader)
        ? this.dtpApi : this.myApi
      this.$utils.autoFillDateTime(this.model)
      this.getListMixin()
    },
    // 部门改变
    onDepartChange (dtpId) {
      this.model.resDepId = dtpId
      this.model.userId = ''
      this.userList.splice(0, this.userList.length)
      this.$api.getDepartMembers(dtpId).then(data => {
        this.userList = data
      })
    },
  },
}
