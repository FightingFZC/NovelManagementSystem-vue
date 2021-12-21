<template>
  <div class="register-component-page" :style="dynamicSetHeight()">
    <div class="register-component">
      <el-form :model="formData" label-width="80px">
        <h2><center>文章管理系统注册</center></h2>
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="验证码">
          <el-input v-model="formData.verificationCode" placeholder="验证码" style="width: 80px"></el-input>
          <el-button style="margin-left: 4px" @click="getVerificationCode" :disabled="codeButton.disabled">{{
            codeButton.text
          }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">注册</el-button>
        </el-form-item>

        <div id="to-login">
          <span>
            已有账户，
            <a href="/#/view/sign/Login" id="toLogin">立即登录</a>
          </span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        email: '1378799690@qq.com',
        verificationCode: '',
      },
      codeButton: {
        text: '获取验证码',
        timer: '',
        disabled: false,
        disabledTime: 5,
        currendDisabledTime: 5,
      },
    }
  },
  methods: {
    /* 提交表单，注册验证去 */
    submit() {
      this.$axios.post('http://localhost:8080/sign/register', this.formData).then((res) => {
        let r = res.data
        if (r.state) {
          this.$message.success(r.msg)
          this.$router.push("/view/sign/Login")
        }else {
          this.$message.error(r.msg)
        }
      }).catch((err) => {
        this.$message.error("请重新注册！" + err.message)
      })
    },
    /* 根据显示器高度设置login-component-page的高度 */
    dynamicSetHeight() {
      return { height: screen.height + 'px' }
    },
    getVerificationCode() {
      this.$axios.get('http://localhost:8080/sign/getVerificationCode/' + this.formData.email).then((res) => {
        let r = res.data
        if (r.state) {
          this.$message.success(r.msg)
          this.codeButton.disabled = true

          this.codeButton.currendDisabledTime = this.codeButton.disabledTime
          this.codeButton.timer = setInterval(this.timerFunc, 1000)
        } else {
          this.$message.error(r.msg)
        }
      })
    },
    timerFunc() {
      if (this.codeButton.currendDisabledTime > 0) {
        this.codeButton.text = '重新发送(' + this.codeButton.currendDisabledTime + 's)'
        this.codeButton.currendDisabledTime--
      } else {
        this.codeButton.text = '获取验证码'
        this.codeButton.disabled = false
        clearInterval(this.codeButton.timer)
      }
    },
  },
}
</script>

<style scoped>
.register-component-page {
  background-color: rgb(224, 228, 232);
}
.register-component {
  width: 300px;
  background-color: #fff;
  padding: 50px 50px;
  margin: 0 auto;
  position: relative;
  top: 100px;
}
#to-login {
  margin: 20px 0px 0px;
}
#to-login a {
  color: #59a8fd;
}
</style>