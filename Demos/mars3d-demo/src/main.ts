import { createApp } from 'vue'
import App from './App.vue'
import styleImport from '@/utils/style-import'
import router from '@/router/index'
import store, { key } from '@/store/index'
import mars3dPlugin from '@/plugins/mars3d'
// 加载全局样式
import './styles/index.scss'

const app = createApp(App)

styleImport(app).use(mars3dPlugin).use(router).use(store, key).mount('#app')
