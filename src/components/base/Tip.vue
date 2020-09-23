<template lang="pug">
el-popover(
  v-if='popover.title || popover.content || $slots.popover'
  :placement='placement'
  :title='popover.title || "Tips"'
  width='350'
  trigger='hover'
  :content='popover.content')
  slot(name='popover')
  i.el-icon-question.info.fs-b.pdl1.hover-success(slot="reference")
</template>
<script>
export default {
  name: 'Tip',
  props: {
    placement: {
      type: String,
      default: 'right-start',
    },
    // tips 问号hover弹窗
    popover: {
      type: Object,
      default: () => ({ title: '', content: '' }),
    },
  },
}
</script>
