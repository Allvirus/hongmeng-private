<template lang='pug'>
.tree-selector
  el-select(:value='label', placeholder='请选择')
    el-option(
      :label='label',
      :value='value',
      key='tree-selector',
      :style='{ padding: "0px", height: "auto" }'
    )
      el-tree(
        :data='data',
        :props='defProps',
        @node-click='handleNodeClick',
        :node-key='nodeKey'
      )
</template>
<script>
export default {
  name: '',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    defProps: {
      type: Object,
      default: null,
    },
    nodeKey: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      value: '',
      label: ' ',
    }
  },
  methods: {
    handleNodeClick (item) {
      if (item[this.defProps.children].length === 0) {
        this.value = item[this.defProps.valKey]
        this.label = item[this.defProps.label]
        this.$emit('change', this.value)
      }
    },
  },
}
</script>
<style lang='stylus' scoped></style>
