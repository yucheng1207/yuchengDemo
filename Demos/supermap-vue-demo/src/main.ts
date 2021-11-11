import { createApp } from 'vue'
// 引入webgl3d组件包
import '@supermap/iclient3d-vue-for-webgl/lib/theme/index.css'
import webgl3d from '@supermap/iclient3d-vue-for-webgl'
import App from './App.vue'
import router from '@/router/index'
import store, { key } from '@/store/index'
import styleImport from '@/utils/style-import'
// 加载全局样式
import './styles/index.scss'

const app = createApp(App)

styleImport(app).use(webgl3d).use(router).use(store, key).mount('#app')
// app.use(webgl3d).use(router).use(store, key).mount('#app')
