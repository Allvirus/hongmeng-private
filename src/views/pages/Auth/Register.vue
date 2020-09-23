<template lang='pug'>
el-form(label-width='0px' :model='model' :rules='rules' ref='form' @keyup.enter.native="submit")
  el-form-item(prop='username')
    el-input.w100p(v-model="model.username" placeholder="请输入用户名" size='large' prefix-icon="el-icon-user" )
  el-form-item(prop='password')
    el-input.w100p(v-model="model.password" type='password' placeholder="请输入密码" size='large' prefix-icon="el-icon-lock" )
  el-form-item(prop='passwordre')
    el-input.w100p(v-model="model.passwordre" type='password' placeholder="请再次输入密码" size='large' prefix-icon="el-icon-lock" )
  el-form-item()
    router-link.theme.mgb2(:to="$route.name === 'Login' ? 'Register' : 'Login'" ) 已有账号, 立即登录→
    el-button.w100p.mgt1(@click='submit'  type='primary' size='large') 注 册

</template>

<script>
import { EUIRule } from '@/plugins/utils'
export default {
  name: 'Register',
  data () {
    return {
      rules: {
        username: [EUIRule('required', '用户名'), { min: 4, max: 20, message: '长度在 6 到 12 个字符', trigger: 'blur' }],
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
      model: {
        username: '',
        password: '',
        passwordre: '',
      },
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.userRegister(this.model).then(data => {
            this.$vgo.tip('注册成功!', 'success')
            this.$router.push({ name: 'Login' })
          }).catch((arr) => {
            arr.map(item => {
              this.$vgo.tip(item.description, 'error')
            })
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
