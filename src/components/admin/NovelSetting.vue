<template>
  <div>
    <header class="header">
      <h1>所有文章</h1>
      <p>在这里可以管理该用户的所有文章，包括新增，编辑，导出，导入，删除等功能</p>
    </header>
    <div class="main">
      <el-button type="primary" @click="add.visible = true">新增</el-button>
      <!-- 上传 -->
      <el-tooltip :content="imp.content" placement="top-start">
        <el-upload
          :action="imp.action"
          style="display: inline-block"
          :before-upload="beforeUpload"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
      </el-tooltip>

      <div class="selectionButton">
        <el-button type="danger" @click="deleteNovelByIds">删除</el-button>
        <el-button type="primary" @click="exp.visible = true">导出</el-button>
      </div>
      <!-- 展示信息table -->
      <el-table :data="novel" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>

        <el-table-column label="标题" prop="title" show-overflow-tooltip>
          <template slot-scope="scope">
            <a :href="'/#/view/user/novel/' + scope.row.id" class="novelTableTitle" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="creationTime"
          show-overflow-tooltip
          min-width="20%"
          sortable
        ></el-table-column>
        <el-table-column
          label="最后修改时间"
          prop="lastModifiedTime"
          show-overflow-tooltip
          min-width="20%"
          sortable
        ></el-table-column>
        <el-table-column label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-button @click="modClick(scope.row.id)">编辑</el-button>
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

      <!-- 文章新增面板。 -->
      <el-dialog
        title="添加文章"
        :visible="add.visible"
        width="50%"
        :before-close="handleAddClose"
        @opened="addDialogOpen"
      >
        <h1><center>标题</center></h1>
        <el-input v-model="add.title" placeholder="请输入标题"></el-input>
        <div id="addNovel"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="add.visible = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 文章导导出面板 -->
      <el-dialog title="导出文章" :visible="exp.visible" width="40%" :before-close="handleExportClose">
        <el-radio label="txt" v-model="exp.type"></el-radio>
        <el-radio label="doc" v-model="exp.type"></el-radio>
        <el-radio label="docx" v-model="exp.type"></el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exp.visible = false">取 消</el-button>
          <el-button type="primary" @click="exportNovelByIds">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 文章修改面板。 -->
      <el-dialog
        title="添加文章"
        :visible="mod.visible"
        width="50%"
        :before-close="handleModClose"
        @opened="modDialogOpen"
      >
        <h1><center>标题</center></h1>
        <el-input v-model="mod.novel.title" placeholder="请输入标题"></el-input>
        <div id="modNovel"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="mod.visible = false">取 消</el-button>
          <el-button type="primary" @click="modSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NovelSetting',
  data() {
    return {
      novel: [],
      total: 0,
      length: 10,
      currentPage: 1,
      add: {
        visible: false,
        title: '',
        editor: '',
      },
      imp: {
        action: '',
        content: '',
        allowSuffix: ['txt', 'doc', 'docx'],
      },
      exp: {
        visible: false,
        type: 'txt',
        title: {},
      },
      multipleSelectionIds: [],
      mod: {
        visible: false,
        novel: {},
        editor: '',
      },
    }
  },
  created() {
    // 初始化数据
    this.username = this.$route.path.split('/').pop()
    this.queryAll()
    this.imp.content = '文件类型支持：' + this.imp.allowSuffix
  },
  methods: {
    /* 查询 */
    queryAll() {
      var url = 'http://localhost:8080/novel/username/' + this.username
      this.$axios({
        method: 'get',
        url: url,
        params: { page: this.currentPage - 1, length: this.length },
      })
        .then((res) => {
          var r = res.data
          if (r.state) {
            this.$message.success(r.msg)
            this.novel = r.list
            this.total = r.total
          } else {
            this.$message.error(r.msg)
          }
        })
        .catch((err) => {
          this.$message.error('查询失败！' + err.message)
        })
    },
    /* 因为elementui的dialog是懒加载，需要在一个时间中对它初始化（初始化富文本编辑器，这个需要对dom操作） */
    addDialogOpen() {
      if (typeof this.add.editor == 'string') {
        this.add.editor = new this.$E('#addNovel')
        this.add.editor.config.focus = false
        this.add.editor.create()
      }
    },
    handleAddClose() {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.add.visible = false
          done()
        })
        .catch((_) => {})
    },
    /* 添加文章 */
    addSubmit() {
      this.$axios
        .post('http://localhost:8080/novel/add', {
          username: this.username,
          data: this.add.editor.txt.html(),
          title: this.add.title,
        })
        .then((res) => {
          var r = res.data
          if (r.state) {
            this.$message.success(r.msg)
            this.queryAll()
            this.add.visible = false
          } else {
            this.$message.error(r.msg)
          }
        })
    },
    /* 1、限制文件格式 2、api规定要title，选择文件后输入title */
    beforeUpload(file) {
      var filename = file.name
      var suffix = filename.substr(filename.lastIndexOf('.') + 1)
      var allowSuffix = this.imp.allowSuffix
      if (!allowSuffix.includes(suffix)) {
        this.$message.error('不支持的文件类型，只支持' + allowSuffix)
        return false
      }

      var t = prompt('请输入标题')

      if (t != '' && t != null) {
        return new Promise((resolve, reject) => {
          this.$nextTick(() => {
            this.imp.action = 'http://localhost:8080/novel/import/' + this.username + '/' + t
            resolve()
          })
        })
      } else if (t == null) {
        this.$message('你已取消上传')
      } else {
        this.$message.warning('标题不能为空！')
      }
      return false
      /* 这里还有个问题：就是想在上传前让人输入文件名，但问题是直接先上传了。 */
    },
    uploadSuccess(response) {
      if (response.state) {
        this.$message.success(response.msg)
        this.queryAll()
      } else {
        this.$message.error(response.msg)
      }
    },
    uploadError(err) {
      this.$message.error(err.message)
    },
    /* 由于currentPage不是双向绑定的，这个方法帮其达到这效果 */
    currentChange(page) {
      this.currentPage = page
      this.queryAll()
    },
    /* 将选择的行的值赋给data里的变量 */
    handleSelectionChange(val) {
      this.multipleSelectionIds.length = 0
      val.forEach((row) => {
        this.multipleSelectionIds.push(row.id)
        this.exp.title.id = row.title
      })
      console.log(this.multipleSelectionIds)
    },
    deleteNovelByIds() {
      var ids = this.multipleSelectionIds
      if (ids.length != 0) {
        this.$axios({
          method: 'delete',
          url: 'http://localhost:8080/novel/',
          data: ids,
        }).then((resolve) => {
          var res = resolve.data
          if (res.state) {
            this.$message.success(res.msg)
            this.queryAll()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.warning('你未选择要删除的文章！')
      }
    },
    exportNovelByIds() {
      var ids = this.multipleSelectionIds
      if (ids.length != 0) {
        ids.forEach((id) => {
          var url = 'http://localhost:8080/novel/export/' + this.exp.type + '/' + id
          this.$axios.get(url, { responseType: 'blob' }).then((res) => {
            let blob = new Blob([res.data])
            window.URL.createObjectURL(blob)
            let url = window.URL.createObjectURL(blob)
            let a = document.createElement('a')
            a.href = url
            a.download = id + this.exp.title.id + '.' + this.exp.type
            a.click()
            window.URL.revokeObjectURL(url)
          })
        })
        this.exp.visible = false
      } else {
        this.$message.warning('你未选择要导出的文章！')
      }
    },
    handleExportClose() {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.exp.visible = false
          done()
        })
        .catch((_) => {})
    },
    /* 找到id对应的内容 */
    modClick(id) {
      this.mod.visible = true
      this.$axios.get('http://localhost:8080/novel/id/' + id).then((res) => {
        var r = res.data
        if (r.state) {
          this.mod.novel = r.data
          this.$message.success('查询id为：' + id + '的文章成功')
        } else {
          this.$message.error('查询id为：' + id + '的文章失败')
        }
      })
    },
    modDialogOpen() {
      if (typeof this.mod.editor == 'string') {
        this.mod.editor = new this.$E('#modNovel')
        this.mod.editor.config.focus = false
        this.mod.editor.create()

        this.mod.editor.txt.html(this.mod.novel.data)
      }
    },
    handleModClose() {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.mod.visible = false
          done()
        })
        .catch((_) => {})
    },
    /* 提交修改后的novel，注意，由于富文本编辑器的文本不是和data里的变量双向绑定，所以需要在这里赋值 */
    modSubmit() {
      this.mod.novel.data = this.mod.editor.txt.html()
      this.$axios
        .put('http://localhost:8080/novel/modify', this.mod.novel)
        .then((res) => {
          var r = res.data
          if (r.state) {
            this.$message.success(r.msg)
            this.queryAll()
            this.mod.visible = false
          } else {
            this.$message.error(r.msg)
          }
        })
    },
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

.el-pagination {
  margin-top: 10px;
}

.novelTableTitle {
  color: #5f6368;
  text-decoration: none;
  font-weight: 600;
}
</style>