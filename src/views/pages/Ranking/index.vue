<template lang='pug'>
  .Ranking
    .ff-rn.jc-around
      ranking-list
      ranking-list.mgl3
      ranking-list.mgl3
      ranking-list.mgl3
</template>
<script>
import RankingList from './comps/RankingList'
export default {
  name: '',
  components: {
    RankingList,
  },
  data () {
    return {
      rankList: [],
    }
  },
  computed: {
  },
  created: function () {
    this.getRank()
  },
  methods: {
    getRank () {
      this.$api.getRankMonth().then(data => {
        console.log('getRank', data)
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
