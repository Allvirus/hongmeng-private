<template lang='pug'>
  .MyContacts.pd3
    .search.ff-rn
      el-input(suffix-icon="el-icon-search" placeholder="请输入内容" v-model="keyword")
      el-button.mgl1.flex-center(type="primary" @click="search") 搜索
    .ff-cn.mgt2
      .item.ff-rn.ai-center(v-for="(item,idx) in searchRet" :key="idx")
        el-image.avatar.mg1.border-radius(:src="item.avtarUrl")
        .ff-cn
          .ff-rn.ai-center
            span {{item.name}}
            el-image.mgl2.flex-center(:src="require('@/assets/img/badge.png')" fit="contain")
            span.mgl1 {{item.level | formatLevel}}

          .ff-rn.ai-center.mgt2
            el-image(:src="require('@/assets/img/ic_job.png')" fit="contain")
            span.mgl1 {{item.job | formatJob}}
</template>
<script>
export default {
  name: '',
  data () {
    return {
      keyword: '',
      searchRet: [],
    }
  },
  created: function () {
    this.createTestData()
  },
  methods: {
    createTestData () {
      const item = {
        avtarUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3851340580,2590830970&fm=26&gp=0.jpg',
        name: '何元生',
        job: 2,
        level: 3,
      }
      let count = 10
      while (count-- > 0) {
        this.searchRet.push(item)
      }
    },
    search () {
      this.$vgo.tip('开始搜索', 'success')
    },
  },
}
</script>
<style lang='stylus' scoped>
.MyContacts
  button
    width 50px
  .avatar
    width 50px
    height 50px
</style>
