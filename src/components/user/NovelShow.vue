<template>
  <div id="component">
    <h1>{{ novel.title }}</h1>
    <div class="content" v-html="novel.data"></div>
  </div>
</template>

<script>
export default {
  name: 'NovelShow',
  data() {
    return {
      novel: {},
    }
  },
  created() {
      var id = this.$route.path.split('/').pop()
      this.$axios.get('http://localhost:8080/novel/id/' + id)
      .then((res) => {
          var r = res.data;
          if (r.state) {
              this.novel = r.data;
              this.$message.success("查询id为：" + id + "的文章成功")
          }else {
              this.$message.error("查询id为：" + id + "的文章失败")
          }
      })
      
  }
}
</script>

<style scoped>
h1 {
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  font-size: 1.75rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 2.25rem;
  color: #202124;
}

#component {
    margin: 5% 20%;
    padding: 10px 20px;
    border: solid 1px #babfc5;
    border-radius: 10px;
}
</style>