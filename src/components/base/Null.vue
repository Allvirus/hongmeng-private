<template lang="pug">
.vgo-null.fc-w1.ff-cn.pdy3.flex-center
  i.el-icon-warning.mgb1.fs-xxl
  span {{text}}
</template>
<script>
export default {
  name: 'Null',
  props: {
    text: {
      type: String,
      default: '暂无数据',
    },
  },
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
</style>
