<template>
  <div>
    <el-row>
      <el-col :span="18" :offset="3">
        <el-container>
          <el-header>
            <el-menu default-active="/" mode="horizontal" class="head-nav">
              <el-menu-item index="/">首页</el-menu-item>
              <div class="sign-link-component">
                <a href="/#/view/sign/Login" class="sign-link">登录</a>
                <a href="/#/view/sign/Register" class="sign-link">注册</a>
              </div>
              <!-- 这个界面就算了吧，直接腰斩得了 -->
<!--               <div class="user-shortcut-component" hidden>
                <el-dropdown class="sign-link" @command="handleUserSettings">
                  <img src="@/assets/headImage_default.png" id="headImage" /> 
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="accountSetting">账号设置</el-dropdown-item>
                    <el-dropdown-item command="myNovel">我的文章</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div> -->
            </el-menu>
          </el-header>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HomeHead',
  data() {
    return {}
  },
  methods: {
/*      跳转到指定的设置界面 
    handleUserSettings(settingName) {
      this.$message(settingName)
    }, */
  },
  
}
</script>

<style scoped>
.sign-link {
  float: right;
  text-decoration: none;
  color: #303133;
}

a.sign-link {
  margin: 25px 20px;
}

.sign-link:hover {
  text-decoration: underline;
}

#headImage {
  width: 47px;
  margin: 5px 10px;
  border-radius: 100%;
}
</style>