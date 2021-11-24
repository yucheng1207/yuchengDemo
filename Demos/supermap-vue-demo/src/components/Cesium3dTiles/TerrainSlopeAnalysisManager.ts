import $ from 'jquery'
import Tooltip from './tooltip'

const tooltip = new Tooltip(document.body)
const { Cesium } = window as any

// 参考： http://support.supermap.com.cn:8090/webgl/examples/webgl/editor.html#terrainSlopeAnalysis
export default class TerrainSlopeAnalysisManager {
  private static _terrainSlopeAnalysisManager: TerrainSlopeAnalysisManager

  private viewer: any

  private widemin = 0 // 最小坡度值

  private widemax = 78 // 最大坡度值

  private slope: any

  private handlerPolygon: any

  private colorTable: any

  private opacity = 0.5

  // 计算模式： ARM_REGION 指定多边形区域 || ARM_ALL 全部区域 || ARM_NONE
  private wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION

  private eventHandler: any

  public static getInstance() {
    if (!this._terrainSlopeAnalysisManager) {
      this._terrainSlopeAnalysisManager = new TerrainSlopeAnalysisManager()
    }

    return this._terrainSlopeAnalysisManager
  }

  public init(viewer: any) {
    this.viewer = viewer
    const { scene } = viewer
    if (!scene) {
      throw new Error('创建可视域失败，scene不存在')
    }
    if (!scene.pickPositionSupported) {
      alert('不支持深度纹理,无法绘制多边形，根据多边形显示分析区域功能无法使用！')
    }

    const slope = new Cesium.SlopeSetting()
    slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW
    slope.MaxVisibleValue = this.widemax
    slope.MinVisibleValue = this.widemin
    const colorTable = new Cesium.ColorTable()
    colorTable.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255))
    colorTable.insert(50, new Cesium.Color(221 / 255, 224 / 255, 7 / 255))
    colorTable.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255))
    colorTable.insert(20, new Cesium.Color(0, 161 / 255, 1))
    colorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255))

    slope.ColorTable = colorTable
    slope.Opacity = this.opacity
    const tooltip = new Tooltip(viewer._element)
    // 绘制多边形
    const handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0)
    handlerPolygon.activeEvt.addEventListener((isActive: boolean) => {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // $('body').removeClass('drawCur').addClass('drawCur')
      } else {
        viewer.enableCursorStyle = true
        // $('body').removeClass('drawCur')
      }
    })
    handlerPolygon.movingEvt.addEventListener((windowPosition: any) => {
      if (windowPosition.x < 200 && windowPosition.y < 150) {
        tooltip.setVisible(false)
      }
    })
    handlerPolygon.drawEvt.addEventListener((result: any) => {
      if (!result.object.positions) {
        handlerPolygon.polygon.show = false
        handlerPolygon.polyline.show = false
        handlerPolygon.deactivate()
        handlerPolygon.activate()
        return
      }
      const array = [].concat(result.object.positions)
      tooltip.setVisible(false)
      const positions = []
      for (let i = 0, len = array.length; i < len; i++) {
        const cartographic = Cesium.Cartographic.fromCartesian(array[i])
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        const h = cartographic.height
        if (positions.indexOf(longitude) === -1 && positions.indexOf(latitude) === -1) {
          positions.push(longitude)
          positions.push(latitude)
          positions.push(h)
        }
      }

      slope.CoverageArea = positions
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: this.wide
      }
      handlerPolygon.polygon.show = false
      handlerPolygon.polyline.show = true
      handlerPolygon.deactivate()
      handlerPolygon.activate()
    })
    // handlerPolygon.activate()

    viewer._cesiumWidget._creditContainer.style.display = 'none'

    this.viewer = viewer
    this.slope = slope
    this.colorTable = colorTable
    this.handlerPolygon = handlerPolygon
  }

  private update = () => {
    this.viewer.scene.globe.SlopeSetting = {
      slopeSetting: this.slope,
      analysisMode: this.wide
    }
  }

  public setOpacity = (val: number) => {
    this.slope.Opacity = val
    this.update()
  }

  public setWideMin = (val: number) => {
    this.widemin = val
    this.slope.MinVisibleValue = val
    this.update()
  }

  public setWideMax = (val: number) => {
    this.widemax = val
    this.slope.MaxVisibleValue = val
    this.update()
  }

  public setWide = (val: any) => {
    // Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION 指定多边形区域
    // Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL 全部区域都参与分析
    // Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE 全部区域都不参与分析
    this.wide = val
    this.update()
  }

  public setDisplayMode = (mode: 'showcolor' | 'showarrow' | 'both') => {
    if (mode === 'showcolor') {
      // 显示填充颜色
      this.slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE
    } else if (mode === 'showarrow') {
      // 显示坡向箭头
      this.slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW
    } else {
      // 填充颜色和坡向箭头
      this.slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW
    }
    this.update()
  }

  public setColorTable = (mode: number) => {
    const { colorTable } = this
    colorTable.remove(0)
    colorTable.remove(20)
    colorTable.remove(30)
    colorTable.remove(50)
    colorTable.remove(80)
    switch (mode) {
      case 0:
        colorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255))
        colorTable.insert(20, new Cesium.Color(0, 161 / 255, 1))
        colorTable.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255))
        colorTable.insert(50, new Cesium.Color(221 / 255, 224 / 255, 7 / 255))
        colorTable.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255))
        break
      case 1:
        colorTable.insert(0, new Cesium.Color(162 / 255, 251 / 255, 194 / 255))
        colorTable.insert(20, new Cesium.Color(180 / 255, 200 / 255, 170 / 255))
        colorTable.insert(30, new Cesium.Color(200 / 255, 160 / 255, 130 / 255))
        colorTable.insert(50, new Cesium.Color(225 / 255, 130 / 255, 130 / 255))
        colorTable.insert(80, new Cesium.Color(1, 103 / 255, 103 / 255))
        break
      case 2:
        colorTable.insert(0, new Cesium.Color(230 / 255, 198 / 255, 1))
        colorTable.insert(20, new Cesium.Color(210 / 255, 150 / 255, 1))
        colorTable.insert(30, new Cesium.Color(190 / 255, 100 / 255, 1))
        colorTable.insert(50, new Cesium.Color(165, 50 / 255, 1))
        colorTable.insert(80, new Cesium.Color(157 / 255, 0, 1))
        break
      case 3:
        colorTable.insert(0, new Cesium.Color(0, 39 / 255, 148 / 255))
        colorTable.insert(20, new Cesium.Color(0, 39 / 255, 148 / 255))
        colorTable.insert(30, new Cesium.Color(70 / 255, 116 / 255, 200 / 255))
        colorTable.insert(50, new Cesium.Color(149 / 255, 232 / 255, 249 / 255))
        colorTable.insert(80, new Cesium.Color(149 / 255, 232 / 255, 249 / 255))
        break
      case 4:
        colorTable.insert(0, new Cesium.Color(186 / 255, 1, 190 / 255))
        colorTable.insert(20, new Cesium.Color(186 / 255, 1, 180 / 255))
        colorTable.insert(30, new Cesium.Color(106 / 255, 255 / 255, 170 / 255))
        colorTable.insert(50, new Cesium.Color(26 / 255, 255 / 255, 160 / 255))
        colorTable.insert(80, new Cesium.Color(26 / 255, 255 / 255, 156 / 255))
        break
      default:
        break
    }
    this.slope.ColorTable = colorTable
    this.update()
  }

  public start = () => {
    this.handlerPolygon.activate()
  }

  public clear = () => {
    this.viewer.scene.globe.SlopeSetting = {
      slopeSetting: this.slope,
      analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE
    }
    this.handlerPolygon.polygon.show = false
    this.handlerPolygon.polyline.show = false
  }
}
