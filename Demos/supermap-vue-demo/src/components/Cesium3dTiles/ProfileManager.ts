import $ from 'jquery'
import Tooltip from './tooltip'

const tooltip = new Tooltip(document.body)

const { Cesium } = window as any
export default class ProfileManager {
  private static _profileManager: ProfileManager

  private viewer: any

  private canvasId: string = ''

  private profile: any

  private handlerLine: any

  private eventHandler: any

  public static getInstance() {
    if (!this._profileManager) {
      this._profileManager = new ProfileManager()
    }

    return this._profileManager
  }

  public init(viewer: any, canvasId: string) {
    this.viewer = viewer
    this.canvasId = canvasId
    const { scene } = viewer
    if (!scene) {
      throw new Error('创建可视域失败，scene不存在')
    }
    if (!scene.pickPositionSupported) {
      alert('不支持深度纹理,剖面分析功能无法使用！')
    }

    // 创建剖面分析对象
    this.profile = new Cesium.Profile(scene)
    this.handlerLine = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line)
    this.handlerLine.activeEvt.addEventListener((isActive: boolean) => {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // $('body').removeClass('drawCur').addClass('drawCur')
      } else {
        viewer.enableCursorStyle = true
        // $('body').removeClass('drawCur')
      }
    })
    this.handlerLine.movingEvt.addEventListener((windowPosition: any) => {
      if (this.handlerLine.isDrawing) {
        tooltip.showAt(windowPosition, '<p>右键单击结束绘制</p>')
      } else {
        tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
      }
    })
    this.eventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas)

    this.handlerLine.drawEvt.addEventListener((result: any) => {
      tooltip.setVisible(false)
      const line = result.object
      const startPoint = line._positions[0]
      const endPoint = line._positions[line._positions.length - 1]

      const scartographic = Cesium.Cartographic.fromCartesian(startPoint)
      const slongitude = Cesium.Math.toDegrees(scartographic.longitude)
      const slatitude = Cesium.Math.toDegrees(scartographic.latitude)
      const sheight = scartographic.height

      const ecartographic = Cesium.Cartographic.fromCartesian(endPoint)
      const elongitude = Cesium.Math.toDegrees(ecartographic.longitude)
      const elatitude = Cesium.Math.toDegrees(ecartographic.latitude)
      const eheight = ecartographic.height

      // 设置坡面分析的开始和结束位置
      this.profile.startPoint = [slongitude, slatitude, sheight]
      this.profile.endPoint = [elongitude, elatitude, eheight]

      this.profile.extendHeight = 40

      // 分析完毕的回调函数
      this.profile.getBuffer((buffer: any) => {
        const canvas = document.getElementById(canvasId) as any
        if (canvas) {
          canvas.height = this.profile._textureHeight
          canvas.width = this.profile._textureWidth
          const ctx = canvas.getContext('2d')
          const imgData = ctx.createImageData(
            this.profile._textureWidth,
            this.profile._textureHeight
          )
          imgData.data.set(buffer)
          // 在canvas上绘制图片
          ctx.putImageData(imgData, 0, 0)
          $(`#${canvasId}`).width(600)
          $(`#${canvasId}`).height(450)
        }
      })

      this.profile.build()
    })
  }

  public start = () => {
    // 先清除之前绘制的线
    this.handlerLine.clear()
    $(`#${this.canvasId}`).width(0)
    $(`#${this.canvasId}`).height(0)
    if (this.handlerLine.active) {
      //
    } else {
      this.handlerLine.activate()
      // 由于剖面分析只能绘制直线，此处绘制时单击两次就触发结束事件
      this.eventHandler.setInputAction((e: any) => {
        if (this.handlerLine.polyline._actualPositions.length === 2) {
          const result: any = {}
          result.object = this.handlerLine.polyline
          this.handlerLine.drawEvt.raiseEvent(result)
          this.handlerLine.deactivate()
          this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  }

  public clear = () => {
    this.handlerLine.clear()
    $(`#${this.canvasId}`).width(0)
    $(`#${this.canvasId}`).height(0)
  }
}
