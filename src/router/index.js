import Vue from 'vue'
import Router from 'vue-router'
import FirstMap from '@/page/FirstMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FirstMap',
      component: FirstMap
    }
  ]
})
