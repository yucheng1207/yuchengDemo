import { App } from 'vue'
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'
import 'mars3d-widget'
import 'mars3d-widget/dist/mars3d-widget.css'

export default {
  install: (app: App) => {
    app.config.globalProperties.mars3d = mars3d
    app.config.globalProperties.Cesium = mars3d.Cesium
  }
}
