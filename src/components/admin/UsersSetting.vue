<template>
  <div>
    <header class="header">
      <h1>所有用户</h1>
      <p>在这里可以对系统的所有用户进行操作，包括编辑信息，删除，冻结，以及对用户其文章操作等功能</p>
    </header>
    <div class="main">
      <div class="selectionButton">
        <el-button type="danger" @click="deleteUsers">删除</el-button>

        <el-tooltip content="对于冻结的就是解冻，对于不是冻结的则是冻结" placement="top-start">
          <el-button type="primary" @click="modifyIsFrozen">冻结/解冻</el-button>
        </el-tooltip>
      </div>
      <el-table :data="users" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="头像" min-width="10%">
          <template slot-scope="scope" >
            <img :src="scope.row.headImage" alt="网络不好！" class="tableImage">
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否冻结" prop="state" min-width="10%"></el-table-column>
        <el-table-column label="操作" min-width="30%">
          <template slot-scope="scope">
            <el-button @click="preModifyUser(scope.row)">编辑用户信息</el-button>
            <el-button @click="modifyNovel(scope.row.username)">编辑用户文章</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :total="total"
        :current-page="currentPage"
        :page-size="length"
        layout="total, prev, pager, next, jumper"
        background
        @current-change="currentChange"
      >
      </el-pagination>

      <!-- 修改用户信息面板 -->
      <el-dialog title="用户信息" :visible="userDialog.visible" width="20%" :before-close="handleModifyClose">
        <el-form :model="userDialog.user" label-width="80px">
          <el-form-item label="照片">
            <el-upload
              :action="userDialog.uploadAction"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <button class="changeHeadImage" type="button">
                <img :src="userDialog.user.headImage" />
              </button>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="userDialog.user.username" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="userDialog.user.password" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userDialog.user.email"></el-input>
          </el-form-item>
          <el-form-item label="是否冻结">
            <el-radio v-model="userDialog.user.isFrozen" :label="true">是</el-radio>
            <el-radio v-model="userDialog.user.isFrozen" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="userDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="putModifyUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsersSetting',
  data() {
    return {
      users: [],
      total: 0,
      length: 10,
      currentPage: 1,
      multipleSelectionUsers: [],
      userDialog: {
        user: {},
        visible: false,
        uploadAction: '',
      },
    }
  },
  created() {
    this.queryUsers()
  },
  methods: {
    /* 查询所有用户 */
    queryUsers() {
      this.$axios
        .get('http://localhost:8080/user/', {
          params: {
            page: this.currentPage - 1,
            length: this.length,
          },
        })
        .then((resolve) => {
          var res = resolve.data
          if (res.state) {
            this.users = res.list
            this.total = res.total
            /* 由于table不能显示boolean类型的数据，所以得添加一个新字段来显示，这就来判断 */
            if (this.users.length != 0) {
              this.users.forEach((user) => {
                if (user.isFrozen) {
                  user.state = '是'
                } else {
                  user.state = '否'
                }
              })
            }
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    currentChange(page) {
      this.currentPage = page
      this.queryUsers()
    },
    handleSelectionChange(val) {
      this.multipleSelectionUsers = val
    },
    /* 删除方法 */
    deleteUsers() {
      if (this.multipleSelectionUsers.length == 0) {
        this.$message.warning('请选择需要删除的用户！')
      } else {
        var usernames = []
        this.multipleSelectionUsers.forEach((user) => {
          usernames.push(user.username)
        })
        this.$axios({
          method: 'delete',
          url: 'http://localhost:8080/user/delete',
          data: usernames,
        }).then((resolve) => {
          var res = resolve.data
          if (res.state) {
            this.$message.success(res.msg)
            this.queryUsers()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    /* 对于冻结的就是解冻，对于不是冻结的则是冻结 */
    modifyIsFrozen() {
      var users = this.multipleSelectionUsers
      var usernames = []
      users.forEach((user) => {
        usernames.push(user.username)
      })
      if (usernames.length != 0) {
        this.$axios.put('http://localhost:8080/user/setUsersFrozen', usernames).then((resolve) => {
          var r = resolve.data
          if (r.state) {
            this.$message.success(r.msg)
            this.queryUsers()
          } else {
            this.$message.error(r.msg)
          }
        })
      } else {
        this.$message.warning('请选择用户！')
      }
    },
    /* 点击修改用户按钮后，对数据做些处理 */
    preModifyUser(user) {
      this.userDialog.visible = true
      this.userDialog.user = Object.assign({}, user)
      this.userDialog.uploadAction = 'http://localhost:8080/staticResource/imgPost/' + user.username
    },
    handleModifyClose() {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.userDialog.visible = false
          done()
        })
        .catch((_) => {})
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.substr(0, file.type.indexOf('/')) === 'image'
      const isLt8M = file.size / 1024 / 1024 < 8
      if (!isImage) {
        this.$message.error('上传头像只能是图片格式！')
      }
      if (!isLt8M) {
        this.$message.error('上传头像大小不能超过8MB！')
      }
      return isImage && isLt8M
    },
    handleAvatarSuccess(res, file) {
      this.userDialog.user.headImage = res.data
    },
    putModifyUser() {
      this.$axios.put("http://localhost:8080/user/modify", this.userDialog.user)
      .then((resolve) => {
        var r = resolve.data
        if (r.state) {
          this.$message.success(r.msg)
          this.queryUsers()
          this.userDialog.visible = false
        }else {
          this.$message.error(r.msg)
        }
      })
    },
    modifyNovel(username) {
      this.$router.push('/view/admin/novelSetting/' + username)
    }
  },
}
</script>

<style scoped>
.header {
  text-align: center;
}

.header h1 {
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  font-size: 1.75rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 2.25rem;
  color: #202124;
}

.header p {
  letter-spacing: 0.00625em;
  font-family: Roboto, Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  color: #5f6368;
  margin-top: 16px;
}

.selectionButton {
  float: right;
  margin-right: 5%;
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

.tableImage {
  width: 70%;

}
</style>