<template lang='pug'>
.contacts.ff-cn
  .ff-rn
    el-input(placeholder='请输入姓名', v-model='model.RealName', clearable)
    el-button.mgl1(type='primary', @click='getContacts') 搜索
  .flex-1.mgt2.pd1
    .contact.ff-rn.h50.ai-center(
      v-for='(item, index) in contactData.list',
      :key='index'
    )
      img.w40.h40.avatar(:src='getAvatarUrl(item)')
      .ff-cn.mgl2.jc-around
        p {{ item.realName }}
        .ff-rn
          img.fit-contain.flex-center(:src='item.level | formatBadge')
          span.mgl1 {{ item.level | formatLevel }}
  .h30.flex-center
    el-pagination(
      :total='contactData.count',
      :page-size.sync='model.PageSize',
      :current-page.sync='model.Page',
      @current-change='getContacts',
      :base='true',
      :small='true'
    )
</template>
<script>
export default {
  name: 'Contacts',
  data () {
    return {
      model: {
        RealName: '',
        Page: 1,
        PageSize: 11,
      },
      contactData: [],
    }
  },
  created () {
    this.getContacts()
  },
  methods: {
    getContacts () {
      this.$api.getContacts(this.model).then(data => {
        this.contactData = data
      })
    },
    getAvatarUrl (item) {
      if (item.photo) {
        return $globalconfig.API + item.photo
      } else {
        return require('@/assets/img/ic_def_avatar.png')
      }
    },
  },
}
</script>
<style lang='stylus' scoped>
.contacts
  height 650px
  .avatar
    border-radius 50%
  img
    object-fit contain !important
</style>
