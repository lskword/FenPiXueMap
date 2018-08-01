<template>
  <div id="app">
    <div class="left">
      <Aside/>
    </div>
    <div class="right">
      <!-- <Header/> -->
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import Aside from "@/components/Aside"
export default {
  name: 'App',
  components: {
    Header,
    Aside
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  /* display: -webkit-box; */
  box-sizing: border-box;
  /* overflow: hidden; */
}
.left{float: left; height: 100%;}
.left {background: #3a3a3a;width: 220px;}
.right {background-color: #f8f8f8;min-width: 1000px; height:100%;margin-left: 220px}
.clear {clear: both;}

</style>
