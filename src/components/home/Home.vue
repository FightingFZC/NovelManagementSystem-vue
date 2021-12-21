<template>
  <div>
    <div id="content">
      <div id="text-content">
        <h1>文章管理系统</h1>
        <p>这是一个文章管理系统这是一个文章管理系统这是一个文章管理系统这是一个文章管理系统这是一个文章管理系统这是一个文章管理系统这是一个文章管理系统</p>
        <a href="#/view/sign/Register" id="register-link">注册！</a>
      </div>
      <div id="shape-content">
        <img src="@/assets/HomeImage01.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
    }
  }
}
</script>

<style scoped>
h1 {
  color: rgb(39, 35, 67);
  font-size: 51px;
}
p {
  color: rgb(45, 51, 74);
  font-size: 21px;
}
#text-content {
  display: inline-block;
  width: 45%;
  vertical-align: middle;
  margin-left: 2%;
}

#shape-content {
  width: 45%;
  display: inline-block;
  margin-left: 7%;
  vertical-align: middle;

}
#shape-content img {
  width: 100%;
}
#register-link {
  display: block;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  background-color: rgba(255, 217, 3, 1);
  color: rgb(39, 35, 67);
  width: 180px;
  padding: 19px 32px;
  margin-top: 50px;
  border-radius: 5px;
}

#register-link:hover {
  background-color: rgba(255, 217, 3, 0.8);
  
}

#content {
  margin-top: 70px;
}
</style>