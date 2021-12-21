<template>
  <div>
    <el-container>
      <el-header>
        <span id="title">用户管理界面</span>
        <div id="account">
            <img :src="this.$store.getters.getUser.headImage" alt="网络不好" :title="'用户：' + this.$store.getters.getUser.username" id="headImage">
            <button id="loginOut" @click="loginOut">退出登录</button>
        </div>
      </el-header>
      
      <el-container>
        <el-aside width="250px">
            <el-menu :default-active="currentActive" router>
              <el-menu-item index="home">
                  <img src="@/assets/home_icon.png" class="icon">
                  <span class="item">首页</span>
              </el-menu-item>
              <el-menu-item index="account">
                  <img src="@/assets/account_icon.png" class="icon">
                  <span class="item">账号管理</span>
                </el-menu-item>
              <el-menu-item index="novelSetting">
                  <img src="@/assets/novel_icon.png" class="icon">
                  <span class="item">文章管理</span>
                  </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
        currentActive: 'home',
    }
  },
  methods: {
    loginOut() {
      this.$axios.post("http://localhost:8080/sign/loginOut")
      .then((res) => {
        if (res.data.state) {
          this.$message.success(res.data.msg)
          /* 将请求头中的Authorization，localStorage的token去掉 */
          delete this.$axios.defaults.headers.common.Authorization
          window.localStorage.removeItem('token')
          
          this.$store.commit('setUser', null)
          this.$router.push("/")
        }else {
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  created() {
    /* 每次加载前看看路径，万一是进入了某个菜单又刷新，而默认激活的是'home'，得修改 */
    var path = this.$route.path
    var i = path.lastIndexOf("/")
    var currentActive = path.substr(i + 1)
    this.currentActive = currentActive
  }
  
}
</script>

<style scoped>
header {
    border-bottom: solid 1px #e6e6e6;
}

#title {
    margin: 0px 10px;
    font-size: 35px;
}

#account {
    float: right;
}

#headImage {
    border-radius: 100%;
    width: 47px;
    height: 47px;
    vertical-align: middle;
}

.el-menu-item {
    font-size: 16px;
}

.icon {
    margin: 0 5px
}

#loginOut {
    background-color: #fff;
    border: none;
    height: 59px;
}

#loginOut:hover {
    background-color: #ECF5FF;
}


</style>