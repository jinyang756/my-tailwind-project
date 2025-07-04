import { createApp } from 'vue'
import './assets/styles/main.css' // 引入我们的主样式文件
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
