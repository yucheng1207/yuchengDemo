<template>
  <div id="cesiumContainer"></div>
  <div id="loadingbar" class="spinner">
    <div class="spinner-container container1">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
    <div class="spinner-container container2">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
    <div class="spinner-container container3">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
  </div>
  <div
    id="toolbar"
    style="position: absolute; left: 2%; top: 2%; display: none; width: 198px; height: 52px"
  >
    <button type="button" id="chooseView" class="button black">绘制可视域</button>
    <button type="button" id="clear" class="button black" style="margin: 0 0 8px 0">清除</button>
  </div>

  <div id="wrapper" style="display: none">
    <div id="login" class="animate form">
      <span class="close" aria-hidden="true">×</span>
      <form>
        <h1>属性编辑</h1>
        <div>
          <div>
            <label>方向(度)</label>
            <input
              type="range"
              id="direction"
              min="0"
              max="360"
              step="1.0"
              title="方向"
              data-bind="value: direction, valueUpdate: 'input'"
            />
            <input type="text" size="5" data-bind="value: direction" />
          </div>

          <div>
            <label>翻转(度)</label>
            <input
              type="range"
              id="pitch"
              min="-90"
              max="90"
              step="1.0"
              value="1"
              title="翻转"
              data-bind="value: pitch, valueUpdate: 'input'"
            />
            <input type="text" size="5" data-bind="value: pitch" />
          </div>

          <div>
            <label>距离(米)</label>
            <input
              type="range"
              id="distance"
              min="1"
              max="500"
              step="1.0"
              value="1"
              title="距离"
              data-bind="value: distance, valueUpdate: 'input'"
            />
            <input type="text" size="5" data-bind="value: distance" />
          </div>

          <div>
            <label>水平视场角(度)</label>
            <input
              type="range"
              id="horizonalFov"
              min="1"
              max="120"
              step="1"
              value="1"
              title="水平视场角"
              data-bind="value: horizontalFov, valueUpdate: 'input'"
            />
            <input type="text" size="5" data-bind="value: horizontalFov" />
          </div>

          <div>
            <label>垂直视场角(度)</label>
            <input
              type="range"
              id="verticalFov"
              min="1"
              max="90"
              step="1.0"
              value="1"
              title="垂直视场角"
              data-bind="value: verticalFov, valueUpdate: 'input'"
            />
            <input type="text" size="5" data-bind="value: verticalFov" />
          </div>
        </div>
        <div>
          <div class="square">
            <label>可见区域颜色</label
            ><input
              class="colorPicker"
              data-bind="value: visibleAreaColor,valueUpdate: 'input'"
              id="colorPicker1"
            />
          </div>
          <div class="square">
            <label>不可见区域颜色</label
            ><input
              class="colorPicker"
              data-bind="value: invisibleAreaColor,valueUpdate: 'input'"
              id="colorPicker2"
            />
          </div>
        </div>
        <p><label>本例中观察者附加高度：1.8 米</label></p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'
import $ from 'jquery'
import { URL_CONFIG } from '@/static/urlConfig'

// 可视域分析官方示例：http://support.supermap.com.cn:8090/webgl/examples/webgl/editor.html#viewshed3D

const { Cesium } = window as any

const onload = () => {
  if (!Cesium) {
    console.error('can not find cesium')
    return
  }
  const viewer = new Cesium.Viewer('cesiumContainer')
  viewer.imageryLayers.addImageryProvider(
    new Cesium.BingMapsImageryProvider({
      url: 'https://dev.virtualearth.net',
      mapStyle: Cesium.BingMapsStyle.AERIAL,
      key: URL_CONFIG.BING_MAP_KEY
    })
  )
  const { scene } = viewer
  scene.shadowMap.darkness = 1.275 // 设置第二重烘焙纹理的效果（明暗程度）
  scene.skyAtmosphere.brightnessShift = 0.4 // 修改大气的亮度
  scene.debugShowFramesPerSecond = true
  scene.hdrEnabled = false
  scene.sun.show = false
  // 01设置环境光的强度-新处理CBD场景
  scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1)
  // 添加光源
  const position1 = new Cesium.Cartesian3.fromDegrees(116.261209157595, 39.3042238956531, 480)
  // 光源方向点

  const targetPosition1 = new Cesium.Cartesian3.fromDegrees(116.261209157595, 39.3042238956531, 430)
  const dirLightOptions = {
    targetPosition: targetPosition1,
    color: new Cesium.Color(1.0, 1.0, 1.0, 1),
    intensity: 0.55
  }
  const directionalLight_1 = new Cesium.DirectionalLight(position1, dirLightOptions)
  scene.addLightSource(directionalLight_1)
  let viewPosition: any
  $('#loadingbar').remove()
  $('#toolbar').show()
  if (!scene.pickPositionSupported) {
    alert('不支持深度纹理,可视域分析功能无法使用（无法添加观测）！')
  }
  // 先将此标记置为true，不激活鼠标移动事件中对可视域分析对象的操作
  scene.viewFlag = true
  const pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point)
  // 创建可视域分析对象
  const viewshed3D = new Cesium.ViewShed3D(scene)
  const colorStr1 = viewshed3D.visibleAreaColor.toCssColorString()
  const colorStr2 = viewshed3D.hiddenAreaColor.toCssColorString()
  // $('#colorPicker1').spectrum({
  //   color: colorStr1,
  //   showPalette: true,
  //   showAlpha: true,
  //   localStorageKey: 'spectrum.demo',
  //   palette
  // })
  // $('#colorPicker2').spectrum({
  //   color: colorStr2,
  //   showPalette: true,
  //   showAlpha: true,
  //   localStorageKey: 'spectrum.demo',
  //   palette
  // })
  $('.close').click(() => {
    $('#wrapper').hide()
  })
  const widget = viewer.cesiumWidget
  try {
    // 添加S3M图层
    const promise = scene.open(URL_CONFIG.SCENE_CBD)
    Cesium.when(
      promise,
      (layers: any) => {
        // 图层加载完成,设置相机位置
        scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            116.44366835831197,
            39.907137217792666,
            48.237028126511696
          ),
          orientation: {
            heading: 1.6310555040487564,
            pitch: 0.0017367269669030794,
            roll: 3.007372129104624e-12
          }
        })
        for (let i = 0; i < layers.length; i++) {
          layers[i].selectEnabled = false
        }
      },
      (e: any) => {
        if (widget._showRenderLoopErrors) {
          const title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？'
          widget.showErrorPanel(title, undefined, e)
        }
      }
    )
  } catch (e) {
    if (widget._showRenderLoopErrors) {
      const title = '渲染时发生错误，已停止渲染。'
      widget.showErrorPanel(title, undefined, e)
    }
  }
  const viewModel = {
    direction: 1.0,
    pitch: 1.0,
    distance: 1.0,
    verticalFov: 1.0,
    horizontalFov: 1.0,
    visibleAreaColor: '#ffffffff',
    invisibleAreaColor: '#ffffffff'
  }

  Cesium.knockout.track(viewModel)
  const toolbar = document.getElementById('wrapper')
  Cesium.knockout.applyBindings(viewModel, toolbar)
  Cesium.knockout.getObservable(viewModel, 'direction').subscribe((newValue: any) => {
    viewshed3D.direction = parseFloat(newValue)
  })
  Cesium.knockout.getObservable(viewModel, 'pitch').subscribe((newValue: any) => {
    viewshed3D.pitch = parseFloat(newValue)
  })
  Cesium.knockout.getObservable(viewModel, 'distance').subscribe((newValue: any) => {
    viewshed3D.distance = parseFloat(newValue)
  })
  Cesium.knockout.getObservable(viewModel, 'verticalFov').subscribe((newValue: any) => {
    viewshed3D.verticalFov = parseFloat(newValue)
  })
  Cesium.knockout.getObservable(viewModel, 'horizontalFov').subscribe((newValue: any) => {
    viewshed3D.horizontalFov = parseFloat(newValue)
  })
  Cesium.knockout.getObservable(viewModel, 'visibleAreaColor').subscribe((newValue: any) => {
    const color = Cesium.Color.fromCssColorString(newValue)
    viewshed3D.visibleAreaColor = color
  })
  Cesium.knockout.getObservable(viewModel, 'invisibleAreaColor').subscribe((newValue: any) => {
    const color = Cesium.Color.fromCssColorString(newValue)
    viewshed3D.hiddenAreaColor = color
  })
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  // 鼠标移动时间回调
  handler.setInputAction((e: any) => {
    // 若此标记为false，则激活对可视域分析对象的操作
    if (!scene.viewFlag) {
      // 获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
      const position = e.endPosition
      const last = scene.pickPosition(position)

      // 计算该点与视口位置点坐标的距离
      const distance = Cesium.Cartesian3.distance(viewPosition, last)

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
    scene.viewFlag = true
    $('#wrapper').show()
    viewModel.direction = viewshed3D.direction
    viewModel.pitch = viewshed3D.pitch
    viewModel.distance = viewshed3D.distance
    viewModel.horizontalFov = viewshed3D.horizontalFov
    viewModel.verticalFov = viewshed3D.verticalFov
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

  const chooseViewElement = document.getElementById('chooseView')
  const chooseViewHandler = () => {
    if (pointHandler.active) {
      return
    }
    // 先清除之前的可视域分析
    viewer.entities.removeAll()
    viewshed3D.distance = 0.1
    scene.viewFlag = true

    // 激活绘制点类
    pointHandler.activate()
  }
  if (chooseViewElement) {
    chooseViewElement.onclick = chooseViewHandler
  }
  pointHandler.drawEvt.addEventListener((result: any) => {
    const point = result.object
    const { position } = point
    viewPosition = position

    // 将获取的点的位置转化成经纬度
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    const height = cartographic.height + 1.8
    point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)

    if (scene.viewFlag) {
      // 设置视口位置
      viewshed3D.viewPosition = [longitude, latitude, height]
      viewshed3D.build()
      // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
      scene.viewFlag = false
    }
  })
  $('#clear').on('click', function () {
    $('#wrapper').hide()
    viewer.entities.removeAll()
    viewshed3D.distance = 0.1
    scene.viewFlag = true
  })
}

onMounted(() => {
  onload()
})
</script>

<style scoped lang="scss">
@import url('../../styles/webgl/style.css');

button {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}
html,
body,
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000000;
}

input[type='range'] {
  width: 180px;
}

input[type='text'] {
  width: 50px;
}

.square {
  margin-left: 5px;
  width: 120px;
  height: 30px;
  max-width: 150px;
  display: inline-block;
}

label {
  font-weight: bold;
}
</style>
