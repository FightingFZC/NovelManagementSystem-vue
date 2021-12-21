<template>
  <div>
    <header class="text">
      <h1>个人信息</h1>
      <p>您在各种 NMS（文章管理系统） 服务中的个人信息和偏好设置</p>
    </header>
    <div class="main">
      <div class="info">
        <div class="text">
          <h1>您在 NMS 服务中的个人资料信息</h1>
          <p>个人信息以及用于管理这些信息的选项。您可以在这里修改你的头像，密码，邮箱。</p>
        </div>
        <div class="image">
          <img src="@/assets/account_header_01.png" />
        </div>
      </div>

      <div class="userAccount">
        <el-form :model="tempUser" label-width="80px">
          <div class="formHeader">
            <h2>基本信息</h2>
            <p>你在 nms 服务中的信息</p>
          </div>
          <el-form-item label="照片">
            <el-upload :action="uploadAction" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <button class="changeHeadImage" type="button">
                <img :src="tempUser.headImage" />
              </button>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="tempUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="tempUser.password" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="tempUser.email"></el-input>
          </el-form-item>
          <el-button type="primary" id="submitButton" @click="submit">提交</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data() {
    return {
      tempUser: {},
      uploadAction: '',
    }
  },
  created() {
    this.tempUser = Object.assign({}, this.$store.getters.getUser)
    this.uploadAction = 'http://localhost:8080/staticResource/imgPost/' + this.tempUser.username
  },
  methods: {
    beforeAvatarUpload(file) {
      const isImage = file.type.substr(0, file.type.indexOf('/')) === 'image';
      const isLt8M = file.size / 1024 / 1024 < 8;
      if (!isImage) {
        this.$message.error("上传头像只能是图片格式！");
      }
      if (!isLt8M) {
        this.$message.error("上传头像大小不能超过8MB！");
      }
      return isImage && isLt8M;                                                                                                                                                                                                                                                                                     
      
    },
    handleAvatarSuccess(res, file) {
      this.tempUser.headImage = res.data;
    },
    submit() {
      this.$axios.put('http://localhost:8080/user/modify', this.tempUser)
      .then((res) => {
        var r = res.data;
        if (r.state) {
          this.$message.success(r.msg)
          this.$store.commit('setUser', this.tempUser)
        }else {
          this.$message.error(r.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
header.text {
  text-align: center;
}

.text h1 {
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  font-size: 1.75rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 2.25rem;
  color: #202124;
}

.text p {
  letter-spacing: 0.00625em;
  font-family: Roboto, Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  color: #5f6368;
  margin-top: 16px;
}

div.text {
  display: inline-block;
  width: 45%;
  margin-left: 160px;
  vertical-align: middle;
}

div.image {
  display: inline-block;
  width: 30%;

  margin-right: 50px;
  vertical-align: middle;
}

/* 接下来写表单样式！！ */
form {
  border: solid 1px #babfc5;
  border-radius: 15px;
  width: 50%;
  margin: 20px auto;
  padding: 10px 10px;
}

form .formHeader {
  margin-left: 38px;
}

form .formHeader h2 {
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.75rem;
  color: #202124;
  margin: 15px 0;
}

form .formHeader p {
  letter-spacing: 0.01428571em;
  font-family: Roboto, Arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: #5f6368;
  margin-top: 8px;
}

.changeHeadImage img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
  border-radius: 100%;
}

.changeHeadImage {
  padding: 0 0;
  background-color: #fff;
  border-radius: 100%;
  border: solid 1px #babfc5;
}

.changeHeadImage:hover {
  box-shadow: 0px 0px 12.6px -22px rgba(0, 0, 0, 0.563), 0px 0px 34.9px -22px rgba(0, 0, 0, 0.597),
    0px 0px 84.1px -22px rgba(0, 0, 0, 0.555), 0px 0px 279px -22px rgba(0, 0, 0, 0.52);
}

#submitButton {
  margin-left: 45%;
}
</style>