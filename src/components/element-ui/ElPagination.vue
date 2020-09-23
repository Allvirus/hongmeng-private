<template lang="pug">
ele-pagination(
  :layout="base ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
  background
  :page-sizes="getPagesizes"
  @size-change='() => $listeners["current-change"](1)'
  v-if="$attrs.total"
  v-bind="$attrs"
  v-on="$listeners")

//- 分页组件标准使用
//- BGWrap()
//-   el-pagination.margin-spacing(
//-     :total="todoList.count"
//-     :page-size.sync='model.pageSize'
//-     :current-page.sync='model.page'
//-     @current-change="getTodoList")

</template>
<script>
import { Pagination } from 'element-ui'
export default {
  name: 'ElPagination',
  components: {
    ElePagination: Pagination,
  },
  props: {
    base: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      isProduction: process.env.NODE_ENV === 'production',
    }
  },
  computed: {
    getPagesizes () {
      if (this.isProduction) {
        return Array.from(new Set([10, 20, 30, 50, this.$attrs['page-size']])).sort((a, b) => a < b)
      } else {
        return Array.from(new Set([2, 10, 20, this.$attrs['page-size']])).sort((a, b) => a < b)
      }
    },
  },
}

</script>
<style lang="stylus">
@import '~@/assets/style/var'

.el-pagination.is-background .el-pager li:not(.disabled).active
  background-color $theme
</style>
