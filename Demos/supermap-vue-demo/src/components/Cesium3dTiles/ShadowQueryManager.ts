import $ from 'jquery'
import Tooltip from './tooltip'

const tooltip = new Tooltip(document.body)
const { Cesium } = window as any

// 参考例子：http://support.supermap.com.cn:8090/webgl/examples/webgl/editor.html#shadowQuery
export default class ShadowQueryManager {
  private static _shadowQueryManager: ShadowQueryManager

  private viewer: any

  private shadowQuery: any

  private handlerPolygon: any

  private startTime = new Date('2020-12-17T10:00:00')

  private endTime = new Date('2020-12-17T12:00:00')

  private bottomHeight = 20 // 底部高程

  private extrudeHeight = 20 // 拉伸高度

  private eventHandler: any

  private points: any[] = []

  public static getInstance() {
    if (!this._shadowQueryManager) {
      this._shadowQueryManager = new ShadowQueryManager()
    }

    return this._shadowQueryManager
  }

  public init(viewer: any, layers: any) {
    this.viewer = viewer
    const { scene } = viewer
    if (!scene) {
      throw new Error('创建可视域失败，scene不存在')
    }
    if (!scene.pickPositionSupported) {
      alert('不支持深度纹理,阴影分析功能无法使用！')
    }

    // 创建阴影查询对象
    this.shadowQuery = new Cesium.ShadowQueryPoints(scene)
    layers[0].selectEnabled = false
    layers[1].selectEnabled = false
    // 设置图层的阴影模式
    layers[0].shadowType = 2
    layers[1].shadowType = 2

    this.shadowQuery.build()
    this.setCurrentTime()

    this.handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0)
    this.handlerPolygon.activeEvt.addEventListener((isActive: boolean) => {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // $('body').removeClass('drawCur').addClass('drawCur')
      } else {
        viewer.enableCursorStyle = true
        // $('body').removeClass('drawCur')
      }
    })
    this.handlerPolygon.movingEvt.addEventListener((windowPosition: any) => {
      if (this.handlerPolygon.isDrawing) {
        tooltip.showAt(windowPosition, '<p>绘制阴影分析区域(右键结束绘制)</p>')
      }
    })

    this.handlerPolygon.drawEvt.addEventListener((result: any) => {
      tooltip.setVisible(false)
      this.points.length = 0
      const polygon = result.object
      if (!polygon) {
        return
      }
      polygon.show = false
      this.handlerPolygon.polyline.show = false
      let positions = [].concat(polygon.positions)
      positions = Cesium.arrayRemoveDuplicates(positions, Cesium.Cartesian3.equalsEpsilon)

      // 遍历多边形，取出所有点
      for (let i = 0, len = positions.length; i < len; i++) {
        // 转化为经纬度，并加入至临时数组
        const cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[i])
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        this.points.push(longitude)
        this.points.push(latitude)
      }
      // 设置分析对象的开始结束时间
      this.shadowQuery.startTime = Cesium.JulianDate.fromDate(this.startTime)
      this.shadowQuery.endTime = Cesium.JulianDate.fromDate(this.endTime)

      // 设置当前时间
      this.setCurrentTime()

      this.shadowQuery.spacing = 10
      this.shadowQuery.timeInterval = 60

      // 设置分析区域、底部高程和拉伸高度
      this.shadowQuery.qureyRegion({
        position: this.points,
        bottom: this.bottomHeight,
        extend: this.bottomHeight
      })
      this.shadowQuery.build()
    })
  }

  /**
   * 阴影分析
   */
  public shadowAnalysis = () => {
    this.handlerPolygon.deactivate()
    this.handlerPolygon.activate()
  }

  /**
   * 获取阴影率
   */
  public shadowRadio = () => {
    $('#shadowRadioBox').css('display', 'block')
    $('#shadowRadioText').val('')
    $('#longitudeText').val('')
    $('#latitudeText').val('')
    $('#heightText').val('')

    const { scene } = this.viewer
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    handler.setInputAction((e: any) => {
      const position1 = scene.pickPosition(e.position)
      const cartographic = Cesium.Cartographic.fromCartesian(position1)
      const shadowRadio = this.shadowQuery.getShadowRadio(cartographic)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      const { height } = cartographic
      this.viewer.entities.removeAll()

      if (shadowRadio !== -1) {
        $('#shadowRadioText').val(shadowRadio)
        $('#longitudeText').val(longitude)
        $('#latitudeText').val(latitude)
        $('#heightText').val(height)

        this.viewer.entities.add(
          new Cesium.Entity({
            point: new Cesium.PointGraphics({
              color: new Cesium.Color(1, 0, 0, 0.5),
              pixelSize: 15
            }),
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 0.5)
          })
        )
      } else {
        $('#shadowRadioText').val('')
        $('#longitudeText').val('')
        $('#latitudeText').val('')
        $('#heightText').val('')
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  /**
   * 日照效果
   */
  public sunlight = () => {
    let shour = this.startTime.getHours()
    const ehour = this.endTime.getHours()
    console.log('日照分析', shour, ehour)

    if (shour > ehour) {
      console.error('日照分析失败：参数错误', this.startTime, this.endTime)
      return
    }
    let nTimer = 0.0
    const nIntervId = setInterval(() => {
      if (shour < ehour) {
        this.startTime.setHours(shour)
        this.startTime.setMinutes(nTimer)
        this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(this.startTime)
        nTimer += 10.0
        if (nTimer > 60.0) {
          shour += 1.0
          nTimer = 0.0
        }
      } else {
        clearInterval(nIntervId)
      }
    }, 20)
  }

  public setStartTime = (startTime: Date) => {
    this.viewer.entities.removeAll()
    this.shadowQuery.startTime = Cesium.JulianDate.fromDate(startTime)
  }

  public setEndTime = (endTime: Date) => {
    this.viewer.entities.removeAll()
    this.shadowQuery.endTime = Cesium.JulianDate.fromDate(endTime)
    this.setCurrentTime()
  }

  public setBottomHeight = (val: any) => {
    this.shadowQuery.qureyRegion({
      position: this.points,
      bottom: val,
      extend: this.extrudeHeight
    })
  }

  public setExtrudeHeight = (val: any) => {
    this.shadowQuery.qureyRegion({
      position: this.points,
      bottom: this.bottomHeight,
      extend: val
    })
  }

  private setCurrentTime = () => {
    // const endTime = new Date($('#selDate').val())
    // endTime.setHours(Number($('#endTime :selected').val()))
    console.log('setCurrentTime', this.endTime)
    this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(this.endTime)
    this.viewer.clock.multiplier = 1
    this.viewer.clock.shouldAnimate = true
  }

  public start = () => {}

  public clear = () => {
    this.handlerPolygon.deactivate()
    if (this.handlerPolygon.polygon) this.handlerPolygon.polygon.show = false
    if (this.handlerPolygon.polyline) this.handlerPolygon.polyline.show = false
    // $('#shadowRadioBox').css('display', 'none')
    this.viewer.entities.removeAll()
    this.shadowQuery.clear()
  }
}
