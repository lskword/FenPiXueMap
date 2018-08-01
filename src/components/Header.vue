<template lang="html">
  <div id="header_box">
    <div class="header_search_box">
      <div class="header_search_left">课程搜索</div>
      <div class="header_search_right">
        <div class="search">
          <input id="search"  @keydown.center='search' v-model="searchBaseText" placeholder="快捷搜索品类" type="text"/>
          <img class="search_img" src="@/assets/search.png" alt="">
          <button class="search_so" @click='search'>搜索</button>
        </div>
        <p class="hot_text">
          <span>历史搜索:</span>
          <span>C1驾照</span>
          <span>少儿舞蹈</span>
          <span>瑜伽</span>
          <span>钢琴</span>
          <span>俄罗斯语</span>
        </p>
      </div>
    </div>
    <div class="user_box">
      <div class="user">
        <img src="@/assets/user.png" alt="">
        <div class="text">
          <p class="txt1">Admin</p>
          <p class="txt2">上次登录：2018-05-03</p>
        </div>
      </div>
      <div class="logoout">
        <img src="@/assets/exit.png" alt="">
        <p>退出</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      searchBaseText: null,
    }
  },
  methods: {
    search: function () {
      var self = this,
          qs = require("querystring"),
          data = {
            latitude: self.$store.state.lat,
            longitude: self.$store.state.lng,
            page: 1,
            pageSize: 10,
            text: self.searchBaseText
          };
          console.log(data);
      data = qs.stringify(data);
      this.$http
          .post("/api/searchMap/searchList",data)
          .then((res) => {
            console.log(res);
          })
      self.$store.commit("addBaseList")
    }
  }
}
</script>

<style lang="css" scoped>
#header_box{
  height: 15%;
  min-height: 134px;
  min-width: 1366px;
}
.search_box {width: 600px;height: 75px;margin: .3rem 0 0 .21rem;}
.search_box, .search_box> div { float: left; }
.search_left {font-size: .2rem;color: #555555;margin-right: 14px;height: .44rem;line-height: .44rem;}

.search_img {
  width: .22rem;
  height: .22rem;
  display: block;
  margin: .13rem .12rem;
  top: 0;
  left: 0;
  position: absolute;
}
.search {
  position: relative;
  overflow: hidden;
}
.search input,
.search button.search_so {float: left;}
#search {
  width: 3.16rem;
  height: .4rem;
  border-radius: 8px;
  border: 1px solid #acacac;
  color: #dddddd;
  font-size: .2rem;
  padding-left: .46rem;
}
.search_so {
  width: 126px;
  height: .44rem;
  color: #3a3a3a;
  background-color: #ffe000;
  border: 1px solid #ffe000;
  border-radius: 8px;
  letter-spacing: 10px;
  font-size: .2rem;
  margin-left: 16px;
}
.hot_text {
  width: 475px;
	height: 17px;
	font-family: MicrosoftYaHei;
	font-size: .16rem;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #999999;
  margin: .14rem 0 0 0;
}
.hot_text span:nth-child(1){
  cursor: default;
}
.hot_text span {
  cursor: pointer;
  margin-left: 20px;
}
.user_box {
  float: right;
  width: 385px;
  height: 118px;
  margin: .07rem;
}
.user {
  width: 255px;
  height: 100%;
  float: left;
  border-right: 1px solid #ebebeb;
}
.logoout {
  float: right;
  margin-top: 34px;
  width: 123px;
  height: 84px;
}
.logoout img{
  width: 35px;
  height: 37px;
  display: block;
  margin: 0 auto;
}
.logoout p {
  text-align: center;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 16px;
  letter-spacing: 0px;
  color: #555555;
}
.user > img,
.user > div.text {
  float: left;
}
.user > img {
  width: 66px;
  height: 66px;
  border: solid 1px #ebebeb;
  border-radius: 100%;
  margin: 27px 0 25px;
}
.user > .text {
  /* width: 141px; */
  height: 41px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 26px;
  letter-spacing: 0px;
  color: #3a3a3a;
  margin: 41px 5px 36px;
}
div.text > .txt2 {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #666666;
}
</style>
