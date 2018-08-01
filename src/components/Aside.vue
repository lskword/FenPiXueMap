<template lang="html">
  <div class="aside_box">
    <div class="logo_box">
      <img id="logo" src="@/assets/logo1.png" alt=""/>
      <p class="prompt">校区匹配客服工具</p>
    </div>
    <div class="map_box">
      <img class="map_img" src="@/assets/xiaoqu_log.png" alt="">
      <p class="top1">校区匹配</p>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
#logo {
  height: 60px;
  display: block;
  margin: 22px auto 9px;
  /* background: #e9e9e9; */
}
.map_img {
  width: 48px;
  display: block;
  margin: 0 auto 19px;
}
.aside_box {

}
.prompt {
  font-size: 20px;
  text-align: center;
  color: #fff;
}
.top1 {
  text-align: center;
  color: #fff;
  font-size: 20px;
  margin-top: 19px;
}
.map_box {
  margin-top: 73px;
}
</style>
