<template lang="pug">
ele-pagination(
  :layout='base ? "prev, pager, next" : "total, sizes, prev, pager, next, jumper"',
  background,
  :page-sizes='getPagesizes',
  @size-change='handleSizeChange',
  v-if='$attrs.total',
  v-bind='paginationAttrs',
  v-on='$listeners'
)

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
    paginationAttrs () {
      const attrs = { ...this.$attrs }
      delete attrs['page-sizes']
      return attrs
    },
    getPagesizes () {
      const customPageSizes = this.normalizePageSizes(this.$attrs['page-sizes'])
      const defaultPageSizes = this.isProduction ? [10, 20, 30, 50] : [2, 10, 20]
      const currentPageSize = Number(this.$attrs['page-size'])
      const pageSizes = customPageSizes.length ? customPageSizes : defaultPageSizes

      return Array.from(new Set([...pageSizes, currentPageSize].filter(item => item > 0)))
        .sort((a, b) => a - b)
    },
  },
  methods: {
    normalizePageSizes (pageSizes) {
      if (Array.isArray(pageSizes)) {
        return pageSizes.map(item => Number(item)).filter(item => item > 0)
      }

      if (typeof pageSizes === 'string') {
        return pageSizes
          .split(',')
          .map(item => Number(item.trim()))
          .filter(item => item > 0)
      }

      return []
    },
    handleSizeChange () {
      const onCurrentChange = this.$listeners['current-change']

      if (typeof onCurrentChange === 'function') {
        onCurrentChange(1)
      }
    },
  },
}

</script>
<style lang="stylus">
@import '~@/assets/style/var';

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: $theme;
}
</style>
