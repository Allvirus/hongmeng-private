<template lang='pug'>
.phone-layout()
  TopBar
</template>
<script>
export default {
  name: '',
  components: {
    TopBar: () => import('./TopBar.vue'),
  },
  data () {
    return {
    }
  },
}
</script>
<style lang='stylus' scoped></style>
