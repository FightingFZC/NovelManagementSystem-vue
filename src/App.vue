<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  /* 给vuex中的state做持久化处理 */
  /* 在页面刷新后读取数据到state中 */
  created() {

    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    }

    /* 再给window对象添加事件，beforeUnload，在页面刷新前将数据存到里面去。 */
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })
  },

  
}
</script>

<style>

</style>
