import Vue from 'vue'
// 引入Vuex模块
import Vuex from 'vuex'
// 将Vuex插件作为Vue的插件注册
Vue.use(Vuex)

// 导出Vuex的Store实例
export default new Vuex.Store({
  // 状态
  state: {
    // 纬度
    lat: 0,
    // 经度
    lng: 0,
    // 课程搜索名
    searchBaseText: null,
    // 搜索历史记录
    baseList: []
  },
  // 更改
  mutations: {
    // 更新用户信息，nickName是载荷
    updatePoint (state, i) {
      // 更新状态中的nickName为传入的nickName
      state.latitude = i.lat;
      state.longitude = i.lng;
      console.log(i);
    },
    // 缓存数据
    addBaseList (state, t) {
      if (state.baseList.indexOf(t) === -1){
        console.log(t, state.baseList);
        if (state.baseList.length > 4) {
          state.baseList.shift()
        }
        state.baseList.push(t)
      }
    }
  }
})
