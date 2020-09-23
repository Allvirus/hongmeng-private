<template lang="pug">
  EleImage(
    :preview-src-list="previewSrcList || [$attrs.src]"
    v-bind="$attrs"
    v-on="$listeners")

</template>
<script>
import { Image } from 'element-ui'
export default {
  name: 'ElImage',
  components: {
    EleImage: Image,
  },
  props: {
    previewSrcList: {
      type: Array,
      default: () => null,
    },
  },
  methods: {

  },
}
</script>
