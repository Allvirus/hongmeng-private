<template lang='pug'>
el-form(
  label-width='0px',
  :model='model',
  :rules='rules',
  ref='form',
  @keyup.enter.native='submit'
)
  el-form-item(prop='username', :class='isPc ? "mgb5" : ""')
    el-input.w100p(
      v-model='model.username',
      placeholder='请输入用户名',
      size='large',
      prefix-icon='el-icon-user'
    )
  el-form-item(prop='password', :class='isPc ? "mgb5" : ""')
    el-input.w100p(
      v-model='model.password',
      type='password',
      placeholder='请输入密码',
      size='large',
      prefix-icon='el-icon-lock'
    )
  el-form-item
    el-button.w100p.mgt1(@click='submit', type='primary', size='large') 登 录
</template>

<script>
import { mapGetters } from 'vuex'
import utils, { EUIRule } from '@/plugins/utils'

export default {
  name: 'Login',
  data () {
    return {
      rules: {
        username: [EUIRule('required', '用户名'), { min: 4, max: 20, message: '长度在 6 到 12 个字符', trigger: 'blur' }],
        password: [EUIRule('required', '密码'), { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }],
      },
      model: {
        username: '',
        password: '',
      },
      isPc: true,
    }
  },
  computed: {
    ...mapGetters(['OS']),
  },
  created () {
    this.isPc = utils.UAis('pc')
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.userLogin(this.model).then(data => {
            this.$utils.setToken(data.token)
            this.$vgo.tip('登录成功!', 'success')
            const { redirect_uri } = this.$route.query
            if (redirect_uri) {
              location.replace(redirect_uri)
            } else {
              this.$router.replace({ name: 'Home' })
            }
          }).catch(({ data }) => {
            if (data && data.errorMsg) {
              // this.$vgo.tip(data.errorMsg, 'error')
            }
          })
        }
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
>>>i.el-icon-user, >>>i.el-icon-lock {
  font-size: 20px;
}
</style>
