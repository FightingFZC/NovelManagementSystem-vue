<template>
  <div class="login-component-page" :style="dynamicSetHeight()">
    <div class="login-component">
      <el-form :model="formData" label-width="80px" status-icon>
        <h2><center>文章管理系统登录</center></h2>
        <div class="icon-user">
          <i class="el-icon-user-solid" />
        </div>
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" show-password v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="选择身份">
          <el-radio-group v-model="formData.isAdmin">
            <el-radio-button label="false">普通用户</el-radio-button>
            <el-radio-button label="true">管理员</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">登录</el-button>
        </el-form-item>
        <div id="to-register">
          <span>
            没有账户，
            <a href="/#/view/sign/Register">立即注册</a>
          </span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        isAdmin: false,
      },
    }
  },
  methods: {
    /* 提交表单，登录验证去 */
    submit() {
      this.$axios.post('http://localhost:8080/sign/login', this.formData).then((res) => {
        var r = res.data
        if (r.state) {
          /* 之后的axios的请求需要再Header里带这个信息，在后端过滤 */
          this.$axios.defaults.headers.common.Authorization = r.token
          /* 再将token写入localStorage，这是前端用来过滤的 */
          window.localStorage.setItem('token', r.token)

          this.$message.success(r.msg)
          /* 登陆成功后要去跳转页面，并将返回的信息写入vuex中 */
          this.$store.commit('setUser', r.data)
          if (this.formData.isAdmin) {
            this.$router.push('/view/admin')
          } else {
            this.$router.push('/view/user')
          }
        } else {
          this.$message.error(r.msg)
        }
      })
    },
    /* 根据显示器高度设置login-component-page的高度 */
    dynamicSetHeight() {
      return { height: screen.height + 'px' }
    },
  },
}
</script>

<style scoped>
.login-component-page {
  background-color: rgb(224, 228, 232);
}
.login-component {
  width: 300px;
  background-color: #fff;
  padding: 50px 50px;
  margin: 0 auto;
  position: relative;
  top: 100px;
}
.icon-user {
  font-size: 50px;
  width: 50px;
  margin: 30px auto;
}
#to-register {
  margin: 20px 0px 0px;
}
#to-register a {
  color: #59a8fd;
}
</style>