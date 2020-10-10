<template lang='pug'>
.tree-selector
  el-select(
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
      if (newValue === '') {
        this.label = ''
        this.value = ''
      } else {
        this.value = ''
        this.label = newValue
      }
    },
    immediate: true,
  },
  methods: {
    reset () {
      this.label = ''
      this.value = ''
    },
    handleNodeClick (item) {
      if (item[this.defProps.children].length === 0) {
        this.value = item[this.defProps.valKey]
        this.label = item[this.defProps.label]
        this.$emit('change', this.value)
        this.$refs.selector.blur()
      }
    },
    onClear () {
      console.log('onClear')
      this.label = ''
      this.value = ''
      this.$emit('change', this.value)
    },
  },
}
</script>
<style lang='stylus' scoped>
>>>.el-tree-node__label
  font-weight normal !important
</style>
