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
      :class='item.id === selId ? "active" : ""',
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
    selName: {
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
      selItems: [],
      noLimit: true,
      selId: -1,
    }
  },
  created () {
    if (this.isMulti) {
      this.channel = JSON.parse(JSON.stringify(this.data))
      this.onNoLimitClick()
    }
  },
  methods: {
    onNoLimitClick () {
      this.noLimit = true
      this.selId = -1
      this.channel.map((item) => {
        item.isCheck = false
      })
      this.$emit('update:selName', '')
      this.$emit('onChange')
    },
    onItemClick (item) {
      if (this.isMulti) {
        item.isCheck = !item.isCheck
        this.updateSelIds(item)
        this.noLimit = this.selItems.length === 0
      } else {
        this.noLimit = false
        this.selId = item.id
        this.$emit('update:selName', item[this.propKey])
        this.$emit('onChange')
      }
    },
    updateSelIds (item) {
      this.selItems.splice(0, this.selItems.length)
      if (this.isMulti) {
        this.channel.map((obj) => {
          if (obj.isCheck) {
            this.selItems.push(obj[this.propKey])
          }
        })
      }
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
