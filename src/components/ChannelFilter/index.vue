<template lang='pug'>
.channel.pdt2.pdb1.ff-rn
  .w100
    p.mgl2.info {{ title }}：
  .ff-rw.flex-1
    p.item.hand.mgr4.mgb1(
      :class='noLimit ? "active" : ""',
      @click='onNoLimitClick'
    ) 不限
    p.item.hand.mgr4.mgb1(
      v-for='(item, index) in data',
      :key='index',
      :class='item.isCheck ? "active" : ""',
      @click='onItemClick(item)'
    ) {{ item[propKey] }}
</template>
<script>
export default {
  name: '',
  props: {
    data: {
      type: Array,
      default: () => { return [] },
    },
    title: {
      type: String,
      default: '',
    },
    propKey: {
      type: String,
      default: '',
    },
    isMulti: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      channel: [],
      selIds: [],
      noLimit: true,
    }
  },
  created () {
    this.channel = JSON.parse(JSON.stringify(this.data))
  },
  methods: {
    onNoLimitClick () {
      this.noLimit = true
      this.channel.map((item) => {
        item.isCheck = false
      })
    },
    onItemClick (item) {
      item.isCheck = !item.isCheck
      this.updateSelIds()
      this.noLimit = this.selIds.length === 0
    },
    updateSelIds () {
      this.selIds.splice(0, this.selIds.length)
      this.channel.map((item) => {
        if (item.isCheck) {
          this.selIds.push(item.ids)
        }
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
.channel
  .item
    padding 2px 6px
  .active
    padding 2px 6px
    color white
    background-color #0CAAFD
    border-radius 6px
</style>
