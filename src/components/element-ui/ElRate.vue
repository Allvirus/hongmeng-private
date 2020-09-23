<template lang="pug">
ele-rate.el--rate(
  v-bind="$attrs"
  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
  v-on="$listeners")
</template>
<script>
import { Rate } from 'element-ui'
export default {
  name: 'ElRate',
  components: {
    EleRate: Rate,
  },
}
</script>
<style lang="stylus">
.el--rate
  text-shadow 0 0 1px #000
</style>
