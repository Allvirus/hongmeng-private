<template lang='pug'>
el-form(label-width='0px' :model='model' :rules='rules' ref='form' @keyup.enter.native="submit")
  el-form-item(prop='username')
    el-input.w100p(v-model="model.username" placeholder="请输入用户名" size='large' prefix-icon="el-icon-user" )
  el-form-item(prop='password')
    el-input.w100p(v-model="model.password" type='password' placeholder="请输入密码" size='large' prefix-icon="el-icon-lock" )
  el-form-item()
    router-link.theme.mgb2(:to="$route.name === 'Login' ? 'Register' : 'Login'" ) 没有账号? 立即注册→
    el-button.w100p.mgt1(@click='submit' type='primary' size='large') 登 录

  //- .input-wrap
  //-   img.icon.vertical-center(src='/content/images/phone.png')
  //-   input(type='text', placeholder='请输入用户名', v-model.trim='loginForm.username', maxlength='20', @focus='clearError')
  //- .input-wrap
  //-   img.icon.vertical-center(src='/content/images/pwd.png')
  //-   input(type='password', placeholder='请输入密码', v-model.trim='loginForm.password', maxlength='18', @focus='clearError')
  //- .input-wrap.vcode
  //-   img.icon.vertical-center(src='/content/images/code.png')
  //-   input(type='text', placeholder='请输入验证码', maxlength='5', v-model.trim='loginForm.vcode', @keyup.enter='login', @focus='clearError')
  //-   img.vcode-img(@click='refreshVcode', :src='vcode_url')
</template>

<script>
import { EUIRule } from '@/plugins/utils'
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
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.userLogin(this.model).then(data => {
            this.$utils.setToken(data.token)
            this.$vgo.tip('登录成功!', 'success')
            let { redirect_uri } = this.$route.query
            if (redirect_uri) {
              redirect_uri += redirect_uri.includes('?') ? '&' : '?' + 'access_token=' + data.token
              location.replace(redirect_uri)
            } else {
              this.$router.replace({ name: 'RoamProjectManage' })
            }
          }).catch(({ data }) => {
            this.$vgo.tip(data.errorMsg, 'error')
          })
        }
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
>>>i.el-icon-user, >>>i.el-icon-lock
  font-size 20px
</style>
