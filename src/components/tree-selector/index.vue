<template lang='pug'>
.tree-selector
  el-select.full(
    ref='selector',
    v-model='value',
    placeholder='请选择',
    v-bind='$attrs',
    @clear='onClear'
  )
    el-option(
      :label='label',
      :value='value',
      key='tree-selector',
      :style='{ padding: "0px", height: "auto" }'
    )
      el-tree(
        :data='data',
        :props='defProps',
        default-expand-all,
        :expand-on-click-node="false"
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
    deflabel: {
      type: String,
      delault: '',
    },
  },
  data () {
    return {
      value: '',
      label: '',
    }
  },
  watch: {
    deflabel (newValue, oldValue) {
      this.value = ''
      this.label = newValue
    },
    immediate: true,
  },
  created () {
    if (this.deflabel) {
      this.label = this.deflabel
    }
  },
  methods: {
    reset (dflb) {
      if (dflb) {
        this.label = dflb
        console.log('reset', dflb, this.label)
      }
      this.value = ''
    },
    handleNodeClick (item) {
      this.value = item[this.defProps.valKey]
      this.label = item[this.defProps.label]
      const dtpInfo = {
        id: this.value,
        name: this.label,
      }
      this.$emit('change', dtpInfo)
      this.$refs.selector.blur()
    },
    onClear () {
      this.label = ''
      this.value = ''
      const dtpInfo = {
        id: this.value,
        name: this.label,
      }
      this.$emit('change', dtpInfo)
    },
  },
}
</script>
<style lang='stylus' scoped>
>>>.el-tree-node__label
  font-weight normal !important
</style>
