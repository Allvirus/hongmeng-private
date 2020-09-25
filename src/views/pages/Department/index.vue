<template lang='pug'>
  .Depart
    .ff-rn
      .org-tree
        el-tree(:data="departsList" :props="props" @node-click="handleNodeClick")
      .members.mgl2
        el-table(:data='members')
            el-table-column(prop="created" label="姓名")
            el-table-column(prop="amount" label="部门")
            el-table-column(prop="type_text" label="岗位")
            el-table-column(prop="remark" label="工龄")
            el-table-column(prop="remark" label="手机号")
            el-table-column(prop="balance" label="住址")

</template>
<script>
export default {
  name: '',
  data () {
    return {
      props: {
        children: 'departments',
        label: 'name',
      },
      members: [],
      departsList: [],
    }
  },
  computed: {
  },
  created: function () {
    this.getAllDeparts()
  },
  methods: {
    getAllDeparts () {
      const id = 1
      this.$api.getDepartById(id).then(res => {
        console.log('getAllDeparts', res)
        this.departsList.push(res)
      })
    },
    handleNodeClick (data) {
      console.log('handleNodeClick', data)
      this.$vgo.tip(data.name, 'success')
    },
  },
}
</script>
<style lang='stylus' scoped>
.Depart
  .org-tree
    width 20%
    .el-tree-node__content
      background-color orange

  .members
    width 80%
</style>
