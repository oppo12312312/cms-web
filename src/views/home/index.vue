<template>
  <div class="welcome">
    <img src="@p/static/imgs/sys_homepage.png" class="welcome-png" />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="scss">
.welcome {
  width: 100%;
  height: 100%;
  background: #fff;
  text-align: center;
  padding: 5% 20px 3%;
  .welcome-tit {
    font-size: 32px;
  }
  .welcome-png {
    width: 45%;
    max-width: 600px;
    margin-top: 20px;
  }
}
</style>
