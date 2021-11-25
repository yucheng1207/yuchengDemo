import $ from 'jquery'
import Tooltip from './tooltip'

const tooltip = new Tooltip(document.body)

const { Cesium } = window as any
export default class TerraincalCulationManager {
  private static _terraincalCulationManager: TerraincalCulationManager

  private viewer: any

  private sceneUrl: string =
    'http://www.supermapol.com/realspace/services/3D-dxyx_ios2/rest/realspace'

  private queryUrl: string =
    'http://www.supermapol.com/realspace/services/spatialAnalysis-dxyx_ios/restjsr/spatialanalyst/datasets/DEM@%E5%9B%9B%E5%A7%91%E5%A8%98%E5%B1%B1/terraincalculation/cutfill.json?returnContent=true'

  private depth: number = 5000 // 开挖高程

  private cutarea: any // 开挖面积(平方米)

  private cutVolume: any // 开挖体积(立方米)

  private fillarea: any // 填方面积(平方米)

  private fillVolume: any // 填方体积(立方米)

  private remainderArea: any // 未填挖面积(平方米)

  private handlerPolygon: any

  private eventHandler: any

  public static getInstance() {
    if (!this._terraincalCulationManager) {
      this._terraincalCulationManager = new TerraincalCulationManager()
    }

    return this._terraincalCulationManager
  }

  public async init(viewer: any, opts?: { sceneUrl: string; queryUrl: string; depth: number }) {
    this.viewer = viewer
    const { scene } = viewer
    if (!scene) {
      throw new Error('填挖方分析失败，scene不存在')
    }
    if (!scene.pickPositionSupported) {
      alert('不支持深度拾取,无法进行鼠标交互绘制！')
    }

    if (opts) {
      this.sceneUrl = opts.sceneUrl
      this.queryUrl = opts.queryUrl
      this.depth = opts.depth
    }

    const clampMode = 0 // 空间模式
    const widget = viewer.cesiumWidget

    await this.openScene(this.sceneUrl)

    const handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, clampMode)

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
      if (handlerPolygon.isDrawing) {
        tooltip.showAt(windowPosition, '<p>点击确定多边形中间点</p><p>右键单击结束绘制</p>')
      } else {
        tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
      }
    })

    handlerPolygon.drawEvt.addEventListener((result: any) => {
      handlerPolygon.polygon.show = false
      // handlerPolygon.polyline.show = false;
      handlerPolygon.deactivate()
      tooltip.setVisible(false)

      const dep = this.depth

      const array = [].concat(result.object.positions)
      const positions = []
      const positionsii = []
      for (let i = 0, len = array.length; i < len; i++) {
        const cartographic = Cesium.Cartographic.fromCartesian(array[i])
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        const h = cartographic.height
        console.log('多边形点信息：', longitude, latitude, h)
        if (positions.indexOf(longitude) === -1 && positions.indexOf(latitude) === -1) {
          positions.push(longitude)
          positions.push(latitude)
          // positions.push(parseInt(dep.toString(), 10))
          positions.push(dep)

          positionsii.push({
            x: longitude,
            y: latitude
          })
        }
      }

      // 此处用的地形修改 而不是地形开挖
      viewer.scene.globe.removeAllModifyRegion()
      viewer.scene.globe.addModifyRegion({
        name: 'ggg',
        position: positions
      })

      const length = []
      length.push(positionsii.length)

      // 需要在此 动态构造一个 REGION类型的对象
      const geometry = {
        id: 23,
        parts: length,
        points: positionsii,
        style: null,
        type: 'REGION'
      }

      const queryObj = {
        cutFillType: 'REGIONANDALTITUDE',
        baseAltitude: dep,
        region: geometry,
        resultDataset: 'result',
        buildPyramid: true,
        deleteExistResultDataset: true
      }
      const queryObjJSON = JSON.stringify(queryObj)
      $.ajax({
        type: 'post',
        url: this.queryUrl,
        data: queryObjJSON,
        success: (data) => {
          console.log(data)
          // var resultObj = JSON.parse(data);
          const resultObj = data

          this.cutarea = resultObj.cutArea
          this.cutVolume = resultObj.cutVolume
          this.fillarea = resultObj.fillArea
          this.fillVolume = resultObj.fillVolume
          this.remainderArea = resultObj.remainderArea

          console.log('开挖高程：', this.depth)
          console.log('开挖面积(平方米)：', this.cutarea)
          console.log('开挖体积(立方米)：', this.cutVolume)
          console.log('填方面积(平方米)：', this.fillarea)
          console.log('填方体积(立方米)：', this.fillVolume)
          console.log('未填挖面积(平方米)：', this.remainderArea)
        }
      })
    })

    this.handlerPolygon = handlerPolygon
  }

  public openScene = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const { scene } = this.viewer
      const promise = scene.open(url)
      Cesium.when.all(promise, (layers: any) => {
        // 设置相机位置、视角
        // this.viewer.scene.camera.setView({
        //   destination: new Cesium.Cartesian3(
        //     -1206939.1925299785,
        //     5337998.241228442,
        //     3286279.2424502545
        //   ),
        //   orientation: {
        //     heading: 1.4059101895600987,
        //     pitch: -0.20917672793046682,
        //     roll: 2.708944180085382e-13
        //   }
        // })
        resolve(this.viewer)
      })
    })
  }

  public start = (depth?: number) => {
    if (depth !== undefined && depth !== null) {
      this.depth = depth
    }
    this.handlerPolygon.activate()
  }

  public clear = () => {
    this.viewer.scene.globe.removeAllModifyRegion()
    this.cutarea = 0
    this.cutVolume = 0
    this.fillarea = 0
    this.fillVolume = 0
    this.remainderArea = 0
    this.handlerPolygon.clear()
  }
}
