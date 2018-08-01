<template>
  <div class="box">
    <div id="header_box">
    <div class="header_search_box">
      <div class="header_search_left">课程搜索</div>
      <div class="header_search_right">
        <div class="header_search">
          <input id="header_search"  @keydown.enter='searchBase' v-model="searchBaseText" placeholder="快捷搜索品类" type="text"/>
          <img class="header_search_img" src="@/assets/search.png" alt="">
          <button class="header_search_so" @click='searchBase'>搜索</button>
        </div>
        <p class="header_hot_text" v-show="baseList.length > 0 ? true : false">
          <span>历史搜索:</span>
          <span v-for="(item, index) in baseList" @click="localStoreSeach(item)" >{{item}}</span>
        </p>
      </div>
    </div>
    <!-- <div class="header_user_box">
      <div class="header_user">
        <img src="@/assets/user.png" alt="">
        <div class="header_text">
          <p class="header_txt1">Admin</p>
          <p class="header_txt2">上次登录：2018-05-03</p>
        </div>
      </div>
      <div class="header_logoout">
        <img src="@/assets/exit.png" alt="">
        <p>退出</p>
      </div>
      <div class="clear"></div>
    </div> -->
  </div>
  <div class="box_m">
      <div id="map_box"></div>
      <div class="search_box">
        <input id="search" type="text" @keyup="addressSearch" v-model="searchText" placeholder="请输入用户提供商圈，结果在菜单中确认定位点" />
        <span id="diance">
          <el-dropdown
          @command="nabClick">
            <span class="el-dropdown-link">
              {{kmChange}}
            </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1000">1km</el-dropdown-item>
          <el-dropdown-item command="3000">3km</el-dropdown-item>
          <el-dropdown-item command="5000">5km</el-dropdown-item>
          <el-dropdown-item command="10000">10km</el-dropdown-item>
        </el-dropdown-menu>
        </el-dropdown>
        </span>
        <!-- <span id="search_btn" @click="search">
          <i id="search_btn_box"></i>
        </span> -->
      </div>
      <div class="search_list_box" v-show="addressLock">
        <div class="list_box" v-for="(item, index) in addressList" @click="distailSearch(item.title)">
          <p class="big_disance">
            {{item.title}}
          </p>
          <p class="mpt_disance">
            {{item.address}}
          </p>
        </div>
        <!-- <div class="loadmore">
          加载更多
        </div> -->
      </div>
      <div class="list_distail_box_lock" @click="datalistBoxShow">
        展开/收起
      </div>
      <!-- <div class="" v-show="datalistBox"> -->
        <div class="list_distail_box" v-show="datalistBox">
          <template>
            <div class="header">
                <ul>
                    <!-- 循环数据在点击调用changeli方法时将当前索引和本条数据传进去,并使用当前数据show的bool值添加或移除样式 -->
                    <li :class="[{active:item.show}]" @click="changeli(index,item)" v-for="(item,index) in headerData">
                        <!-- 在这里打印出boll值方便查看 -->
                        <div class="datalist_box" :class="item.show === true ? 'checked':'datalist_box'">
                          <b :class="item.show === true ? 'imgboxyellow':'imgboxblack'">{{index + 1}}</b>
                          <div class="base">
                            <p class="base_title">
                              {{item.schoolName}}
                              <span class="distance">{{kmChnge(item.campusDistanceDes)}}</span>
                            </p>
                            <p class="base_price">{{item.address}}</p>
                          </div>
                          <p class="see_more">
                            <i class="see_more_img"></i>
                            查看更多
                          </p>
                          <p class="clear"></p>
                        </div>
                        <!-- 判断当前这条数据的bool值如果是true就打开二级菜单,如果是false就关闭二级菜单 -->
                            <ul v-show="item.show">
                                <!-- 循环二级菜单数据并使用.stop阻止冒泡 -->
                                <li v-for="(its,index) in item.courseList" v-on:click.stop="doThis(index)">
                                  <div class="distail_o_box">
                                    <p class="base_title_o">{{its.courseName}}</p>
                                    <p class="base_price_o_box">
                                      <span class="base_price_o">总价：¥{{its.totalPay}}  最低：¥{{its.firstPay}}  开始上课</span>
                                      <span class="see_more_o">查看详情</span>
                                      <span class="clear"></span>
                                    </p>
                                  </div>
                                </li>
                            </ul>

                    </li>
                </ul>
                <div class="block" style="text-align:center;margin: 20px 0;">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage2"
                    :page-sizes="[10, 20, 50, 9999]"
                    :page-size="10"
                    layout="sizes, prev, pager, next"
                    :total="schoolCount">
                  </el-pagination>
              </div>
            </div>
        </template>
        </div>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>

import BMap from 'BMap';
export default {
  data() {
    return {
      // 距离
      distance: 1000,
      // 地址数据
      addressList: [],
      // 坐标位置 (默认中建三局)
      point: {
        lat: 30.539717,
        lng: 114.33708
      },
      // 地图初始化
      map: new BMap.Map("map_box"),
      // 地址控制开关
      addressLock: false,
      // 地址中心位置搜索词
      searchText: null,
      searchBaseText: null,
      page: 1,
      // 校区详情数据
      headerData: [],
      // 分页
      currentPage2: 1,
      // 总页数
      schoolCount: 0,
      // 地图校区经纬度list
      mapList: [{la:114.33708, ln:30.539717},{la:124.33708, ln:30.539717},{la:117.33708, ln:36.539717}],
      // 数据展示开关
      datalistBox: false

    }
  },
  computed: {
    kmChange: function () {
      var val,
          self = this;
      val = self.distance/1000 + 'km'
      return val
    },
    baseList: function () {
      return this.$store.state.baseList
    }
  },

  methods: {
    // 数据展示开关
    datalistBoxShow: function () {
      this.datalistBox = !this.datalistBox;
      this.addressLock = !this.addressLock;
    },
    // 千米转换
    kmChnge: function (item) {
      var val = '';
       val = parseInt(item) + "m";
        return val
    },
    handleSizeChange(val) {
      var self = this,
          qs = require("querystring"),
          data = {
            latitude: self.point.lat,
            longitude: self.point.lng,
            page: 1,
            pageSize: val,
            text: self.searchBaseText
          };
          console.log(data);
      data = qs.stringify(data);
      // 如果搜索结果为空的时候优化
      if(self.searchBaseText === null) return
      // 数据初始化
      this.$http.post("/api/searchMap/searchList",data)
          .then((res) => {
            if ("0" === res.data.code) {
              var res = res.data.data;
              for (var i = 0; i < res.schoolList.length; i++) {
                if (i === 0) {
                  res.schoolList[i].show = true
                } else {
                  res.schoolList[i].show = false
                }
              }
              console.log(res.schoolList);
              self.headerData = res.schoolList;
              self.schoolCount = res.schoolCount;
              self.datalistBox = true;
              self.addMarker()
            } else if ("2003" === res.data.code) {
              alert("缺少参数，请重试")
            }
          })
      self.$store.commit("addBaseList", self.searchBaseText)
    },
    handleCurrentChange(val) {
      this.page = val;
      this.searchBasePage();
    },
    localStoreSeach: function (t) {
      var self = this;
      self.searchBaseText = t;
      self.searchBase()
    },
    // 分页加载数据

    searchBasePage: function () {
      var self = this,
          qs = require("querystring"),
          data = {
            latitude: self.point.lat,
            longitude: self.point.lng,
            page: self.page,
            pageSize: 10,
            text: self.searchBaseText
          };
          console.log(data);
      data = qs.stringify(data);
      // 如果搜索结果为空的时候优化
      if(self.searchBaseText === null) return
      // 数据初始化
      this.$http.post("/api/searchMap/searchList",data)
          .then((res) => {
            if ("0" === res.data.code) {
              var res = res.data.data;
              for (var i = 0; i < res.schoolList.length; i++) {
                if (i === 0) {
                  res.schoolList[i].show = true
                } else {
                  res.schoolList[i].show = false
                }
              }
              console.log(res.schoolList);
              self.headerData = res.schoolList;
              self.schoolCount = res.schoolCount;
              self.datalistBox = true;
              self.addMarker()
            } else if ("2003" === res.data.code) {
              alert("缺少参数，请重试")
            }
          })
      self.$store.commit("addBaseList", self.searchBaseText)
    },
    // 地址搜索下拉框
    addressSearch() {
      var self = this,
          map = self.map;
      var options = {
        onSearchComplete: function(results){
            // map.clearOverlays()
            if (local.getStatus() == BMAP_STATUS_SUCCESS){
                // 判断状态是否正确
                var s = [];
                var res = results.getPoi(0);
                // console.log(res);
                self.point.lat = res.point.lat;
                self.point.lng = res.point.lng;
                self.$store.commit("updatePoint",self.point)
                for (var i = 0; i < results.getCurrentNumPois(); i ++){
                    var obj = {}
                        obj.title = results.getPoi(i).title;
                        obj.address = results.getPoi(i).address;
                    s.push(obj);
                }
                self.addressList = s
                console.log(self.addressList);
                self.addressLock = true
            }
        },
        renderOptions:{map: map}
     };
      var local = new BMap.LocalSearch(map, options);
      local.search(self.searchText);

    },
    // 课程详情
    searchBase: function () {
      var self = this,
          qs = require("querystring"),
          data = {
            latitude: self.point.lat,
            longitude: self.point.lng,
            page: 1,
            pageSize: 10,
            text: self.searchBaseText
          };
          console.log(data);
      data = qs.stringify(data);
      // 如果搜索结果为空的时候优化
      if(self.searchBaseText === null) return
      // 数据初始化
      this.$http.post("/api/searchMap/searchList",data)
          .then((res) => {
            if ("0" === res.data.code) {
              var res = res.data.data;
              for (var i = 0; i < res.schoolList.length; i++) {
                if (i === 0) {
                  res.schoolList[i].show = true
                } else {
                  res.schoolList[i].show = false
                }
              }
              console.log(res.schoolList);
              self.headerData = res.schoolList;
              self.schoolCount = res.schoolCount;
              self.datalistBox = true;
              self.addMarker()
            } else if ("2003" === res.data.code) {
              alert("缺少参数，请重试")
            }
          })
      self.$store.commit("addBaseList", self.searchBaseText)
    },
    // 通过经纬度，关键词，距离调接口校区课程接口
    distailSearch(e) {
      var self = this;
      self.searchText = e;
      self.search()
      self.searchBase()
      self.$store.commit("updatePoint", self.point)
    },
    // 搜索地址中心位置
    search: function(){
      console.log(this.point.lat);
      var self = this,
          map = new BMap.Map("map_box"),
          point = new BMap.Point(self.point.lng, self.point.lat);   //地图初始化

      map.enableScrollWheelZoom();//启动鼠标滚轮缩放地图
      map.enableKeyboard();       //启动键盘操作地图

      map.addControl(new BMap.ScaleControl()); //创建尺子控件
      map.addControl(new BMap.OverviewMapControl()); //缩列图控件
      map.addControl(new BMap.MapTypeControl());  //地图类型控件
      map.centerAndZoom(point, 15);
      var options = {
        onSearchComplete: function(results){
            // map.clearOverlays()
            if (local.getStatus() == BMAP_STATUS_SUCCESS){
                // 判断状态是否正确
                var s = [];
                var res = results.getPoi(0);
                // console.log(res);
                self.point.lat = res.point.lat;
                self.point.lng = res.point.lng;
                self.$store.commit("updatePoint",self.point)
                for (var i = 0; i < results.getCurrentNumPois(); i ++){
                    var obj = {}
                        obj.title = results.getPoi(i).title;
                        obj.address = results.getPoi(i).address;
                    s.push(obj);
                }
                self.addressList = s
                self.addressLock = true
            }
        },
        renderOptions:{map: map},
        onMarkersSet: function () {
          var point = new BMap.Point(self.point.lng, self.point.lat);
              // console.log(point);
          map.removeOverlay(circle);
          var circle = new BMap.Circle(point, self.distance, {
              strokeColor: "blue",
              strokeWeight: 1,
              fillColor: "#E2E8F1",
              fillOpacity: 0.5
          })
          //画到地图上面
          map.addOverlay(circle);
        }
     };
      var local = new BMap.LocalSearch(map, options);
      local.search(self.searchText);
      var pointCenter = map.getCenter();
    },
    // 手风琴
    changeli: function(ind, item) {
      var self = this;
      // 先循环数据中的show将其全部置为false,此时模板里的v-if判断生效关闭全部二级菜单,并移除样式
      this.headerData.forEach(i => {
        // 判断如果数据中的headerData[i]的show属性不等于当前数据的show属性那么headerData[i]等于false
        if (i.show !== this.headerData[ind].show) {
          i.show = false;
        };
      });
      // 取反(true或false)
      item.show = !item.show;
      // console.log(item.name)
      /**
       * 标黄点注释
       * @type {[type]}
       */
      self.addMarker()
      var point = new BMap.Point(item.longitude, item.latitude);
      self.map.setCenter(point);

       var allOverlay = self.map.getOverlays();
       for (var i = 0; i < allOverlay.length; i++){
        try{
          (function(i) {
            if (allOverlay[i].getPosition().lng==item.longitude) {
                self.map.removeOverlay(allOverlay[i]);
                var myIcon1 = new BMap.Icon(require("../assets/dingwei1.png"), new BMap.Size(30, 33), {
                    // 指定定位位置。
                    // 当标注显示在地图上时，其所指向的地理位置距离图标左上
                    // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
                    // 图标中央下端的尖角位置。
                    anchor: new BMap.Size(0, 0),
                    // 地址信息
                    infoWindowAnchor: new BMap.Size(0, 0),
                    // 设置图片偏移。
                    // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
                    // 需要指定大图的偏移位置，此做法与css sprites技术类似。
                    imageOffset: new BMap.Size(0, 0)   // 设置图片偏移
                });
                function add1(point, title, label, i, myIcon1){
                  var marker = new BMap.Marker(point, {
                    icon:myIcon1,
                    title: title,
                    enableMassClear:false,
                    offset: new BMap.Size(-16, -3),
                  }),
                  map = self.map;
                  map.addOverlay(marker);
                  marker.setLabel(label);
                  marker.addEventListener("click",function(){
                    var opts={width:250,height:80,title:"详细信息"};
                    var infoWindow = new BMap.InfoWindow(title,opts);
                    map.openInfoWindow(infoWindow,point);
                  });
                }
                var point = new BMap.Point(item.longitude, item.latitude);
                var label = new BMap.Label(ind+1, {offset: new BMap.Size(13, 5)});
                console.log(point);
                label.setStyle({
                  border: "none",
                  background: 'none',
                  color: "#000"
                })
                add1(point, item.address, label, i, myIcon1);
                return false;

            }
          }(i));
        } catch (e) {
          // console.log(self.map.getOverlays(), e);
         }
       }
    },
    doThis: function(index) {
      alert(index)
    },
    // 千米园控制器
    nabClick(e) {
      var self = this;
      self.distance = parseInt(e);
      self.search()
      self.searchBase()
      self.$store.commit("updatePoint", self.point)
    },

    // 创建小点点
    addMarker: function(index){
      var self = this,
          map = new BMap.Map("map_box"),   //地图初始化
          // 创建地图实例、默认是中建三局
          point = new BMap.Point(self.point.lng, self.point.lat),
          marker = new BMap.Marker(point); //创建标注
          self.map = map;
              // console.log(point);
          map.removeOverlay(circle);
          var circle = new BMap.Circle(point, self.distance, {
              strokeColor: "blue",
              strokeWeight: 1,
              fillColor: "#E2E8F1",
              fillOpacity: 0.5
          })
          //画到地图上面
          map.addOverlay(circle);
          map.addOverlay(marker);
      // 创建图标对象
        var myIcon2 = new BMap.Icon(require("../assets/dingwei2.png"), new BMap.Size(30, 33), {
            // 指定定位位置。
            // 当标注显示在地图上时，其所指向的地理位置距离图标左上
            // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
            // 图标中央下端的尖角位置。
            anchor: new BMap.Size(0, 0),
            // 地址信息
            infoWindowAnchor: new BMap.Size(0, 0),
            // 设置图片偏移。
            // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
            // 需要指定大图的偏移位置，此做法与css sprites技术类似。
            imageOffset: new BMap.Size(0, 0)   // 设置图片偏移
        });
        var myIcon1 = new BMap.Icon(require("../assets/dingwei1.png"), new BMap.Size(30, 33), {
            // 指定定位位置。
            // 当标注显示在地图上时，其所指向的地理位置距离图标左上
            // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
            // 图标中央下端的尖角位置。
            anchor: new BMap.Size(0, 0),
            // 地址信息
            infoWindowAnchor: new BMap.Size(0, 0),
            // 设置图片偏移。
            // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
            // 需要指定大图的偏移位置，此做法与css sprites技术类似。
            imageOffset: new BMap.Size(0, 0)   // 设置图片偏移
        });
        function add1(point, title, label, i, myIcon1){
          var marker = new BMap.Marker(point, {
            icon:myIcon1,
            title: title,
            enableMassClear:false,
            offset: new BMap.Size(-16, -3),
          });
          map.addOverlay(marker);
          marker.setLabel(label);
          marker.addEventListener("click",function(){
            var opts={width:250,height:80,title:"详细信息"};
            var infoWindow = new BMap.InfoWindow(title,opts);
            map.openInfoWindow(infoWindow,point);

          });
        }
        function add2(point, title, label, i, myIcon2){
          var marker = new BMap.Marker(point, {
            icon:myIcon2,
            title: title,
            enableMassClear:false,
            offset: new BMap.Size(-16, -3),
          });
          map.addOverlay(marker);
          marker.setLabel(label);
          marker.addEventListener("click",function(){
            var opts={width:250,height:80,title:"详细信息"};
            var infoWindow = new BMap.InfoWindow(title,opts);
            map.openInfoWindow(infoWindow,point);

          });
        }
        // 向地图添加标注
        for (var i = 0; i < self.headerData.length; i ++) {
          (function(i) {
            var point = new BMap.Point(self.headerData[i].longitude, self.headerData[i].latitude);
            var label = new BMap.Label(i+1, {offset: new BMap.Size(13, 5)});
            console.log(1);
            label.setStyle({
              border: "none",
              background: 'none',
              color: "#fff"
            })
            // add1(point, self.headerData[i].address, label, i, myIcon1);
            add2(point, self.headerData[i].address, label, i, myIcon2);
          }(i));
        }

        // 百度地图API功能
        map.addControl(new BMap.ScaleControl());
        map.addControl(new BMap.OverviewMapControl());
        map.addControl(new BMap.MapTypeControl());
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom();//启动鼠标滚轮缩放地图
        map.enableKeyboard();//启动键盘操作地图
    }
  },

  mounted() {　　
    var self = this,
        map = new BMap.Map("map_box"),   //地图初始化
        // 创建地图实例、默认是中建三局
        point = new BMap.Point(114.33708, 30.539717),
        marker = new BMap.Marker(point); //创建标注
            // console.log(point);
        map.removeOverlay(circle);
        var circle = new BMap.Circle(point, self.distance, {
            strokeColor: "blue",
            strokeWeight: 1,
            fillColor: "#E2E8F1",
            fillOpacity: 0.5
        })

        //画到地图上面
        map.addOverlay(circle);
        map.addOverlay(marker);

        // 百度地图API功能
        map.addControl(new BMap.ScaleControl());
        map.addControl(new BMap.OverviewMapControl());
        map.addControl(new BMap.MapTypeControl());
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom();//启动鼠标滚轮缩放地图
        map.enableKeyboard();//启动键盘操作地图

  }　
}
</script>
<style media="screen" scoped>
/* 盒子 */
.box {
  position: relative;
  height: 100%;
}
.box_m {
  position: relative;
  height: 85%;
}
/* 头部 */
#header_box{
  height: 15%;
  min-height: 134px;
  min-width: 1050px;
}
.header_search_box {min-width: 600px;height: 75px;margin: 30px 0 0 21px;}
.header_search_box, .header_search_box> div { float: left; }
.header_search_left {font-size: 20px;color: #555555;margin-right: 14px;height: 44px;line-height: 44px;}

.header_search_img {
  width: 22px;
  height: 22px;
  display: block;
  margin: 13px 12px;
  top: 0;
  left: 0;
  position: absolute;
}
.header_search {
  position: relative;
  overflow: hidden;
}
.header_search input,
.header_search button.header_search_so {float: left;}
#header_search {
  width: 316px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #acacac;
  color: #dddddd;
  font-size: 20px;
  padding-left: 46px;
}
.header_search_so {
  width: 126px;
  height: 44px;
  color: #3a3a3a;
  background-color: #ffe000;
  border: 1px solid #ffe000;
  border-radius: 8px;
  letter-spacing: 10px;
  font-size: 20px;
  margin-left: 16px;
}
.header_hot_text {
  width: 475px;
	height: 17px;
	font-family: MicrosoftYaHei;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 0px;
	letter-spacing: 0px;
	color: #999999;
  margin: 14px 0 0 0;
}
.header_hot_text span:nth-child(1){
  cursor: default;
}
.header_hot_text span {
  cursor: pointer;
  margin-left: 20px;
}
.header_user_box {
  float: right;
  width: 385px;
  height: 118px;
  margin: 7px;
}
.header_user {
  width: 255px;
  height: 100%;
  float: left;
  border-right: 1px solid #ebebeb;
}
.header_logoout {
  float: right;
  margin-top: 34px;
  width: 123px;
  height: 84px;
}
.header_logoout img{
  width: 35px;
  height: 37px;
  display: block;
  margin: 0 auto;
}
.header_logoout p {
  text-align: center;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 16px;
  letter-spacing: 0px;
  color: #555555;
}
.header_user > img,
.header_user > div.text {
  float: left;
}
.header_user > img {
  width: 66px;
  height: 66px;
  border: solid 1px #ebebeb;
  border-radius: 100%;
  margin: 27px 0 25px;
}
.header_user > .header_text {
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
div.header_text > .header_txt2 {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #666666;
}
/* 地图 */
#map_box {
  height: 100%;
  position: relative;
}

.search_box {
  position: absolute;
  width: 542px;
  height: 57px;
  background-color: #ffffff;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  border: solid 1px #ebebeb;
  top: 0;
  left: 0;
  margin: 24px 0 12px 22px;
}

#search {
  width: 420px;
  height: 55px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 0px;
  letter-spacing: 0px;
  color: #bbbbbb;
  border: none;
  border-right: 1px solid #ccc;
  margin: 1px 0 1px;
  padding: 0 11px;
}

#diance {
  width: 51px;
  height: 53px;
  /* text-align: center; */
  padding-left: 40px;
  position: relative;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #999999;
  line-height: 53px;
  margin-top: 2px;
}

#diance::after {
  content: url(../assets/dinwei.png);
  position: absolute;
  top: 11px;
  left: 0;
  height: 30px;

}

#search_btn,
#diance,
#search {
  float: left;
  display: block;
}

#search_btn {
  width: 87px;
  height: 58px;
  background-color: #ffe000;
  border-radius: 4px;
  position: relative;
}

#search_btn_box {
  background: url(../assets/big_search.png) round;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 31px;
  height: 31px;
  margin-left: -15.5px;
  margin-top: -15.5px;
  display: block;
}

.search_list_box {
  width: 542px;
  max-height: 500px;
  position: absolute;
  top: 93px;
  left: 22px;
  background-color: #ffffff;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  border: solid 1px #ebebeb;
  overflow: hidden;
  overflow-y: scroll;
}

.list_box {
  height: 89px;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.list_box:hover{
  background: #ebebeb;
}
.list_box:hover::after{
  background: #ffe000;
}
.list_box::after {
  content: "";
  width: 12px;
  height: 12px;
  background-color: #ccc;
  border-radius: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 37px 28px 50px;
}

.big_disance {
  margin: 16px 0 9px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 25px;
  letter-spacing: 0px;
  color: #3a3a3a;
}

.big_disance,
.mpt_disance {
  margin-left: 68px;
}

.mpt_disance {
  margin-bottom: 13px;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #999999;
}

.loadmore {
  height: 56px;
  width: 100%;
  text-align: center;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  border: solid 1px #ebebeb;
  line-height: 56px;
  letter-spacing: 0px;
  color: #666666;
  cursor: pointer;
}

.list_distail_box {
  width: 487px;
  /* height: 753px; */
  height: 630px;
  background-color: #ffffff;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  border: solid 1px #ebebeb;
  position: absolute;
  top: 0;
  right: 0;
  overflow-x: hidden;
  margin: 40px 22px 0 0;
}

.distail_box .img_box {
  position: absolute;
  top: 30px;
  left: -17px;
  background: url(../assets/dingwei1.png) round;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 25px;
}

.see_more {
  float: right;
  width: 65px;
  height: 102px;
  font-family: MicrosoftYaHei;
  text-decoration: underline;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 102px;
  letter-spacing: 0px;
  color: #999999;
  margin-right: 12px;
  position: relative;
}

.see_more_img {
  background: url(../assets/jiantou.png) round;
  position: absolute;
  top: 39px;
  left: 70px;
  width: 23px;
  height: 23px;
}

.header {
  width: 100%;
  /* background-color: #ff5722; */
  color: black;
}

.header>ul {
  width: 100%;
}

.header>ul>li {
  border: 1px solid #ffffff;
  cursor: pointer; // float: left;
  font-size: 20px;
  text-align: center;
  line-height: 60px;
}

.active {
  /* background-color: #ff9800; */
}

.header>ul>li:hover {
  /* background-color: #ff9800; */
}

.header>ul>li>ul {
  width: 100%;
  /* background: red; */
}

.header>ul>li>ul>li:hover {
  /* background: #c31111; */
}

.datalist_box {
  width: 442px;
  height: 102px;
  margin: 0 29px 0 16px;
  position: relative;
  border-bottom: 1px solid #ebebeb;

}
.distail_o_box:hover {
  background: #ebebeb;
}
.imgboxyellow {
  background: url(../assets/dingwei1.png) round;
  width: 30px;
  height: 30px;
  display: block;
  position: absolute;
  top: 32px;
  left: -15px;
  line-height: 25px;
  text-align: center;
  font-size: 16px;
  color: black;
}
.imgboxblack {
  background: url(../assets/dingwei2.png) round;
  width: 30px;
  height: 30px;
  display: block;
  position: absolute;
  top: 32px;
  left: -15px;
  line-height: 25px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.base {
  float: left;
}

.clear {
  clear: both;
}

.base {
  min-width: 200px;
  margin: 0 23px;
}

.base_title {
  font-size: 16px;
  color: #3a3a3a;
  max-width: 300px;
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 35px 0 14px;
  text-align: left;、
  position: relative;
}
.base_title .distance {
  position: absolute;
  top: 35%;
  right: 20%;
  color: red;
}

.base_price {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: normal;
  letter-spacing: 0px;
  color: #999999;
  line-height: 16px;
  text-align: left;
  width: 300px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}

.base_price_o_box {
  overflow: hidden;
  margin: 19px 0 20px
}

.base_price_o_box,
.base_title_o {
  width: 425px;
  font-size: 15px;
}

.base_title_o {
  text-align: left;
  max-height: 50px;
  line-height: 25px;
  font-size: 16px;
  display: -webkit-box;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #3a3a3a;
  margin-top: 21px;
  width: 300px;
}

.base_price_o {
  font-size: 16px;
  color: #999999;
  text-align: left;
  float: left;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 260px;
  white-space: nowrap;
}

.see_more_o,
.base_price_o {
  font-size: 16px;
  color: #999999;
  line-height: 16px;
}

.see_more_o {
  float: right;
  text-decoration: underline;
}

.distail_o_box {
  margin: 0 29px 0 30px;
  border-bottom: 1px solid #ebebeb;
  width: 95%;
}
.list_distail_box_lock {
  position: absolute;
  top: .5%;
  right: 21%;
  width: 150px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: black;
  color: #fff;
  border-radius: 5px;
}
</style>
