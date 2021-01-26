<template lang='pug'>
.games
  .selector.border.border-radius.bg-white.ff-cn
    .item(
      v-for='(item, index) in conditList',
      :class='index < conditList.length - 1 ? "border-bottom-dot" : ""',
      :key='index'
    )
      TypeFilter(:data.sync='item')
</template>
<script>
export default {
  name: '',
  components: {
    TypeFilter: () => import('@/components/TypeFilter'),
  },
  data () {
    return {
      checkedItem: [],
      conditList: [],
    }
  },
  created () {
    this.initFake()
  },
  methods: {
    handleCheckedChange () {

    },
    initFake () {
      let count = 4
      while (count-- > 0) {
        const item = {
          title: '设备类型' + count,
          list: [],
        }
        let i = 0
        while (i++ < 20) {
          item.list.push({
            id: i,
            isCheck: false,
            name: '安卓' + i,
          })
        }
        this.conditList.push(item)
      }
      console.log('---', this.conditList)
    },
  },
}
</script>
<style lang='stylus' scoped></style>
