<template lang="pug">
.top-bar.box-shadow
  .banner.jc-between.pr
    .user-info.ff-rn.ai-center.pdl2
      el-popover(
        placement='top-start',
        width='150',
        trigger='hover',
      )
        template()
          ul.mgl2
            li.hand.h30.full.ai-center.hover
              el-upload(
                displayType='button',
                action='true',
                accept='.jpg,.jpeg,.png,.bmp,.gif',
                :crop='true',
                @avatarUrl='onUploaded'
              )
                i.el-icon-user.fs-l
                span.mgl1 修改头像
            li.hand.h30.full.ai-center.hover(@click='editPswdDlg = true')
              i.el-icon-key.fs-l
              span.mgl1 修改密码
            li.hand.warning.h30.full.ai-center.hover(@click='logout')
              i.el-icon-close.fs-l
              span.mgl1 退出登录
        img.avatar(
          :class="OS.isPc?'mg3':''"
          slot='reference',
          :src='userInfo.photo !== null ? userInfo.photo : require("@/assets/img/ic_def_avatar.png")'
        )
      .ff-cn.mgl2
        .ff-rn.ai-center(:class="OS.isPc?'fs-b':'fs-s'")
          span {{ userInfo.realName }}
          img.mgl2.fit-contain.flex-center(:src='userInfo.level | formatBadge')
          span.mgl1.omit {{ userInfo.level | formatLevel }}

        .ff-rn.ai-center.mgt2(:class="OS.isPc?'fs-m':'fs-s'")
          img(:src='require("@/assets/img/ic_job.png")', fit='contain')
          span.mgl1 {{ userInfo.job | formatJob }}
          span.mgl1 经验值 {{ userInfo.experiences }}
    .swiper.pa.omit
      scroll-notice(:data='noticeList', :rows='3' v-if="OS.isPc")
    .ai-center
      img.logo(:src='require("@/assets/img/logo_zl.png")' :class="OS.isPc?'mgr3':'mgr2'")
  .menu-list.jc-between.bg-white
    el-tabs(
      v-model='activeTab',
      @tab-click='(cmp) => $router.replace({ name: cmp.name })'
    )
      el-tab-pane(label='首页', name='HomeMyAchievement')
      el-tab-pane(label='排行', name='Ranking')
    .notice.ai-center.omit.w400
      p(@click="showDptNotice" v-if="OS.isPc") {{dptNotices}}
    .menu.ai-center.jc-center(v-if="!OS.isPc && (activeTab === 'HomeMyAchievement')")
      ms-menu(derection="bottom")
  .edit-pswd
    el-dialog(
      title='修改密码',
      :visible.sync='editPswdDlg',
      :width='OS.isPc?"600px":"300px"',
      @close='cancelPswdEdit'
    )
      .flex-center
        el-form(
          :label-width='OS.isPc?"100px":""',
          ref='form',
          :rules='rules',
          :model='model'
        )
          el-form-item(prop='oldpswd', :label='OS.isPc?"旧密码:":""')
            el-input(
              v-model='model.oldpswd',
              type='password',
              placeholder='请输入旧密码'
              :class="OS.isPc?'':'winput'"
            )
          el-form-item(prop='password', :label='OS.isPc?"新密码:":""')
            el-input(
              v-model='model.password',
              type='password',
              placeholder='请输入新密码'
              :class="OS.isPc?'':'winput'"
            )
          el-form-item(prop='passwordre', :label='OS.isPc?"确认新密码:":""')
            el-input(
              v-model='model.passwordre',
              type='password',
              placeholder='请再次输入新密码'
              :class="OS.isPc?'':'winput'"
            )
      span.dialog-footer(slot='footer')
        el-button.mgl3(type='warning', @click='cancelPswdEdit') 取消
        el-button.mgl3(type='primary', @click='submitPswd') 提交
</template>
<script>
import { mapGetters } from 'vuex'
import { EUIRule } from '@/plugins/utils'
import { MessageBox } from 'element-ui'
export default {
  name: 'TopBar',
  components: {
    MsMenu: () => import('./MsMenu'),
  },
  data () {
    return {
      rules: {
        oldpswd: [EUIRule('required', '旧密码'), { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }],
        password: [EUIRule('required', '密码'), { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }],
        passwordre: [EUIRule('required', '密码'), { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              this.model.password && this.model.password !== this.model.passwordre
                ? cb(new Error('两次输入密码不一致!'))
                : cb()
            },
            trigger: 'blur',
          }],
      },
      activeTab: 'HomeMyAchievement',
      noticeList: [],
      dptNotices: '',
      editPswdDlg: false,
      model: {
        oldpswd: '',
        password: '',
        passwordre: '',
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'OS']),
  },
  created () {
    if (this.$route.name.slice(0, 4) === 'Home') {
      this.activeTab = 'HomeMyAchievement'
    } else {
      this.activeTab = this.$route.name
    }
    this.getNotice()
  },
  methods: {
    getNotice () {
      this.$api.getTop10().then(data => {
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          item.id = i
          this.noticeList.push(item)
        }
      })

      this.$api.getNotices().then(data => {
        this.dptNotices = data
      })
    },
    onUploaded (fileUrl) {
      this.$api.updateAvatar(fileUrl).then(data => {
        this.$store.dispatch('getUserInfo')
      })
    },
    submitPswd () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.updatePswd(this.model).then(data => {
            this.$vgo.tip('密码修改成功!', 'success')
            this.cancelPswdEdit()
          })
        }
      })
    },
    logout () {
      this.$utils.clearCookie()
      this.$router.replace({ name: 'Login' })

      // 清除store里面的数据
      this.$store.dispatch('clearStore')
    },
    cancelPswdEdit () {
      this.editPswdDlg = false
      for (const key in this.model) {
        this.model[key] = ''
      }
    },
    showDptNotice () {
      MessageBox.confirm(this.dptNotices, '公告', {
        confirmButtonText: '确定',
        type: 'info',
        showCancelButton: false,
      })
    },
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'

.top-bar
  .banner
    height 120px
    background-image url('../../assets/img/topbar-bg.jpg')
    .avatar
      width 60px
      height 60px
      border-radius 50%
    .user-info
      #ctxMenu
        position fixed
        display block
        z-index 3
        background-color #fff
        transform translateX(15px)
        box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      ul li
        padding 8px 15px
      ul li:hover
        background-color #ebeef5
  .swiper
    width 50%
    height 100%
    top 0%
    left 50%
    transform translateX(-30%)
  .menu-list
    height 50px
    padding 0 70px
    .el-tabs__item
      font-size 18px

.mobile-mode
  .banner
    height 90px
    background-image url('../../assets/img/mobile_top_bg.jpg')
    background-size cover
  .menu-list
    padding 0 10px
  .avatar
    width 40px !important
    height 40px !important
  .logo
    width 100px
    height 26px
</style>
