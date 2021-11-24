const { Cesium } = window as any
export default class Viewshed3dManager {
  private static _viewshed3dManager: Viewshed3dManager

  private viewer: any

  private viewshed3D: any

  private pointHandler: any

  private viewFlag = true

  private viewPosition: any

  private viewModel = {
    direction: 1.0,
    pitch: 1.0,
    distance: 1.0,
    verticalFov: 1.0,
    horizontalFov: 1.0,
    visibleAreaColor: '#ffffffff',
    invisibleAreaColor: '#ffffffff'
  }

  // constructor() {
  // }

  public static getInstance() {
    if (!this._viewshed3dManager) {
      this._viewshed3dManager = new Viewshed3dManager()
    }

    return this._viewshed3dManager
  }

  public init(viewer: any) {
    this.viewer = viewer
    const { scene } = viewer
    if (!scene) {
      throw new Error('创建可视域失败，scene不存在')
    }
    if (!scene.pickPositionSupported) {
      throw new Error('不支持深度纹理,可视域分析功能无法使用（无法添加观测）！')
    }
    const viewshed3D = new Cesium.ViewShed3D(scene)
    this.pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point)

    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    // 鼠标移动时间回调
    handler.setInputAction((e: any) => {
      // 若此标记为false，则激活对可视域分析对象的操作
      if (!this.viewFlag) {
        // 获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
        const position = e.endPosition
        const last = scene.pickPosition(position)

        // 计算该点与视口位置点坐标的距离
        const distance = Cesium.Cartesian3.distance(this.viewPosition, last)

        if (distance > 0) {
          // 将鼠标当前点坐标转化成经纬度
          const cartographic = Cesium.Cartographic.fromCartesian(last)
          const longitude = Cesium.Math.toDegrees(cartographic.longitude)
          const latitude = Cesium.Math.toDegrees(cartographic.latitude)
          const { height } = cartographic
          // 通过该点设置可视域分析对象的距离及方向
          viewshed3D.setDistDirByPoint([longitude, latitude, height])
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((e: any) => {
      // 鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
      this.viewFlag = true

      this.viewModel.direction = viewshed3D.direction
      this.viewModel.pitch = viewshed3D.pitch
      this.viewModel.distance = viewshed3D.distance
      this.viewModel.horizontalFov = viewshed3D.horizontalFov
      this.viewModel.verticalFov = viewshed3D.verticalFov
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    this.viewshed3D = viewshed3D

    this.pointHandler.drawEvt.addEventListener((result: any) => {
      const point = result.object
      const { position } = point
      this.viewPosition = position

      // 将获取的点的位置转化成经纬度
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      const height = cartographic.height + 1.8
      point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)

      if (this.viewFlag) {
        // 设置视口位置
        viewshed3D.viewPosition = [longitude, latitude, height]
        viewshed3D.build()
        // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
        this.viewFlag = false
      }
    })
  }

  public knockout = (
    ids: {
      wrapper: string
      direction: string
      pitch: string
      distance: string
      verticalFov: string
      horizontalFov: string
      visibleAreaColor: string
      invisibleAreaColor: string
    } = {
      wrapper: 'wrapper',
      direction: 'direction',
      pitch: 'pitch',
      distance: 'distance',
      verticalFov: 'verticalFov',
      horizontalFov: 'horizontalFov',
      visibleAreaColor: 'visibleAreaColor',
      invisibleAreaColor: 'invisibleAreaColor'
    }
  ) => {
    Cesium.knockout.track(this.viewModel)
    const toolbar = document.getElementById(ids.wrapper)
    Cesium.knockout.applyBindings(this.viewModel, toolbar)
    Cesium.knockout.getObservable(this.viewModel, ids.direction).subscribe((newValue: any) => {
      this.viewshed3D.direction = parseFloat(newValue)
    })
    Cesium.knockout.getObservable(this.viewModel, ids.pitch).subscribe((newValue: any) => {
      this.viewshed3D.pitch = parseFloat(newValue)
    })
    Cesium.knockout.getObservable(this.viewModel, ids.distance).subscribe((newValue: any) => {
      this.viewshed3D.distance = parseFloat(newValue)
    })
    Cesium.knockout.getObservable(this.viewModel, ids.verticalFov).subscribe((newValue: any) => {
      this.viewshed3D.verticalFov = parseFloat(newValue)
    })
    Cesium.knockout.getObservable(this.viewModel, ids.horizontalFov).subscribe((newValue: any) => {
      this.viewshed3D.horizontalFov = parseFloat(newValue)
    })
    Cesium.knockout
      .getObservable(this.viewModel, ids.visibleAreaColor)
      .subscribe((newValue: any) => {
        const color = Cesium.Color.fromCssColorString(newValue)
        this.viewshed3D.visibleAreaColor = color
      })
    Cesium.knockout
      .getObservable(this.viewModel, ids.invisibleAreaColor)
      .subscribe((newValue: any) => {
        const color = Cesium.Color.fromCssColorString(newValue)
        this.viewshed3D.hiddenAreaColor = color
      })
  }

  public start = () => {
    if (this.pointHandler.active) {
      return
    }
    // 先清除之前的可视域分析
    this.viewer.entities.removeAll()
    this.viewshed3D.distance = 0.1
    this.viewFlag = true

    // 激活绘制点类
    this.pointHandler.activate()
  }

  public clear = () => {
    this.viewer.entities.removeAll()
    this.viewshed3D.distance = 0.1
    this.viewFlag = true
  }
}
