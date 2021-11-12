<template>
  <!-- 倾斜模型 -->
  <div id="cesiumContainer"></div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'

const BING_MAP_KEY = 'AraGkBfghounWbX8rAcEEL8VXISh5M7tbxnlGxKocM134GmIr-yr48WBJvfaRaCg'
const SCENE_SUOFEIYA =
  'http://localhost:8090/iserver/services/3D-ThreeDTilesCache-Production2/rest/realspace'
// 'http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace' // 索菲亚大教堂倾斜数据场景

const sceneUrl = 'http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace'
const tilesUrl =
  'https://beta.cesium.com/api/assets/1458?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmJiNTAxOC1lOTg5LTQzN2EtODg1OC0zMWJjM2IxNGNlYmMiLCJpZCI6NDQsImFzc2V0cyI6WzE0NThdLCJpYXQiOjE0OTkyNjM4MjB9.1WKijRa-ILkmG6utrhDWX6rDgasjD7dZv-G5ZyCmkKg'
// const tilesUrl = 'http://data.mars3d.cn/3dtiles/qx-shequ/tileset.json'

const { Cesium } = window as any

const onload = () => {
  // 初始化viewer部件
  const viewer = new Cesium.Viewer('cesiumContainer')
  viewer.imageryLayers.addImageryProvider(
    new Cesium.BingMapsImageryProvider({
      url: 'https://dev.virtualearth.net',
      mapStyle: Cesium.BingMapsStyle.AERIAL,
      key: BING_MAP_KEY
    })
  )
  const { scene } = viewer
  const widget = viewer.cesiumWidget
  let sceneLayer

  // $('#loadingbar').remove()

  try {
    console.log('open')
    const promise = scene.open(SCENE_SUOFEIYA)
    console.log('open2')
    Cesium.when(
      promise,
      (layers: any) => {
        console.log('layer')
        const layer = scene.layers.find('Config')
        sceneLayer = layer
        // 设置相机位置，定位至模型
        scene.camera.setView({
          // 将经度、纬度、高度的坐标转换为笛卡尔坐标
          destination: new Cesium.Cartesian3(
            -2653915.6463913363,
            3571045.726807149,
            4570293.566342328
          ),
          orientation: {
            heading: 2.1953426301495345,
            pitch: -0.33632707158103625,
            roll: 6.283185307179586
          }
        })
      },
      () => {
        const title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？'
        // widget.showErrorPanel(title, undefined, e)
      }
    )
  } catch (e) {
    // disable
    if (widget._showRenderLoopErrors) {
      const title = '渲染时发生错误，已停止渲染。'
      widget.showErrorPanel(title, undefined, e)
    }
  }
  // $('#toolbar').show()
  // // The viewModel tracks the state of our mini application.
  // const viewModel = {
  //   brightness: 1,
  //   contrast: 1,
  //   hue: 0,
  //   saturation: 1,
  //   gamma: 1
  // }
  // // Convert the viewModel members into knockout observables.
  // Cesium.knockout.track(viewModel)
  // // Bind the viewModel to the DOM elements of the UI that call for it.
  // const toolbar = document.getElementById('toolbar')
  // Cesium.knockout.applyBindings(viewModel, toolbar)

  // // Make the active imagery layer a subscriber of the viewModel.
  // function subscribeLayerParameter(name) {
  //   Cesium.knockout.getObservable(viewModel, name).subscribe(function (newValue) {
  //     const layer = sceneLayer
  //     layer[name] = parseFloat(newValue)
  //     // sceneLayers[0].refresh();
  //   })
  // }
  // subscribeLayerParameter('brightness')
  // subscribeLayerParameter('contrast')
  // subscribeLayerParameter('hue')
  // subscribeLayerParameter('saturation')
  // subscribeLayerParameter('gamma')
}

onMounted(() => {
  onload()
})
</script>

<style scoped lang="scss">
button {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}
</style>
