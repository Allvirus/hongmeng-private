<template lang='pug'>
  div
    div(style='position: fixed;top: 0px;left: 0;bottom: 0;right: 0;')
      img(
        style='object-fit:cover; position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);height: 70%; min-width: 100%',
        :src='isPc ? pcBg : mobileBg'
      )
      .auth-layout
        .form-layout.page-content.border-radius
          img(:src="logoTitle" class="logo-title")
          h2.tac(:class="isPc?'mgy5':'mgy3'") 用户登录
          component(:is='$route.name', ref='form')

    .copyright {{ $WD.$globalconfig.COPYRIGHT }}
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/plugins/utils'
export default {
  name: 'Auth',
  components: {
    Login: _ => import('./Login'),
  },
  data () {
    return {
      pcBg: require('@/assets/img/login_bg.jpg'),
      mobileBg: require('@/assets/img/mobile_login_bg.jpg'),
      logoTitle: require('@/assets/img/login-title.png'),
      isPc: true,
    }
  },
  computed: {
    ...mapGetters(['OS', 'myDptList', 'userInfo']),
  },
  created () {
    this.isPc = utils.UAis('pc')
  },
  methods: {
    switchLoginType () {
    },
    refreshVcode () {
    },
    showError (message) {
    },
    clearError () {
    },
    login () {
    },
    sendCode () {
    },
    findPassword () {
    },
  },
}
</script>
<style lang='stylus' scoped>
header
  height 60px
  width 100%
  line-height 59px
  border-bottom 1px solid #e0e0e0
  padding 0 30px
  position fixed
  top 0
  left 0
  width 100%

.logo
  height 100%
  display inline-block
  position relative

.menu
  float right
  .item
    margin-left 25px
    float left
  .item a
    font-size 14px
    color #333
    line-height 59px
    height 59px

.vertical-center
  position absolute
  top 50%
  transform translateY(-50%)

.auth-layout
  margin 0 auto
  height 100%
  position relative

  .logo-title
    position absolute
    top -15%

.pc-mode .form-layout
  position absolute
  width 380px
  border 1px solid #e0e0e0
  right 150px
  padding 15px 30px
  top 45%
  left 50%
  transform translate(-50%, -50%)

.mobile-mode .form-layout
  position absolute
  width calc(100% - 50px)
  border 1px solid #e0e0e0
  left 25px
  padding 15px 30px
  top 41%
  transform translateY(-50%)

.switch-login-type
  position absolute
  right 15px
  top 15px
  cursor pointer

.find-pwd
  color #409ffe
  float right
  margin-right 20px

.sms-vcode input
  width 216px
  margin-right 15px

.error
  width 350px
  font-size 14px
  margin-left 20px
  border-radius 4px
  line-height 30px
  color #f78e8e

.vcode input
  width 230px
  margin-right 10px

.vcode .vcode-img
  width 100px
  height 38px
  vertical-align top
  cursor pointer

.scan-login-qrcode
  width 200px
  height 200px
  margin-bottom 15px
  border 1px solid #dcdfe6

.copyright
  position absolute
  bottom 10px
  text-align center
  width 100%
  color #999

.ie-kill
  position fixed
  width 400px
  height 200px
  padding 10px
  padding-top 40px
  left 40%
  top 40%
  background-color #fff
  border 5px solid #409eff
  text-align center
  line-height 50px
  font-size 26px

.error-msg
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  text-align center

.copyright
  position fixed
  left 0
  bottom 0
  padding 10px
  text-align center
  width 100%
  color #eee

.impowerBox #wx_default_tip p
  font-size 16px !important
</style>
