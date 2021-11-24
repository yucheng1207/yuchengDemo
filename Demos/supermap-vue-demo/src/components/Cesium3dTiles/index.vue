<template>
  <div id="cesiumContainer"></div>
  <div id="wrapper"></div>
  <div class="toolbar">
    <el-button id="chooseViewshed3d" @click="start">绘制可视域</el-button>
    <el-button id="clearViewshed3d" @click="clear">清除可视域</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'
import registerWindowFunction from '@/utils/window'
import Viewshed3dManager from './Viewshed3dManager'

// const tilesUrl =
//   'https://beta.cesium.com/api/assets/1458?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmJiNTAxOC1lOTg5LTQzN2EtODg1OC0zMWJjM2IxNGNlYmMiLCJpZCI6NDQsImFzc2V0cyI6WzE0NThdLCJpYXQiOjE0OTkyNjM4MjB9.1WKijRa-ILkmG6utrhDWX6rDgasjD7dZv-G5ZyCmkKg'
const tilesUrl = 'http://data.mars3d.cn/3dtiles/qx-shequ/tileset.json'

const { Cesium } = window as any

const onload = () => {
  if (!Cesium) {
    console.error('can not find cesium')
    return
  }
  const obj = [6378137.0, 6378137.0, 6356752.3142451793]
  Cesium.Ellipsoid.WGS84 = Object.freeze(new Cesium.Ellipsoid(obj[0], obj[1], obj[2]))
  const viewer = new Cesium.Viewer('cesiumContainer')

  const tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: tilesUrl
    })
  )

  tileset.readyPromise
    .then(() => {
      registerWindowFunction(viewer.scene)
      initViewshed3d(viewer)

      const { boundingSphere } = tileset
      viewer.camera.viewBoundingSphere(
        boundingSphere,
        new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius)
      )
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    })
    .otherwise((error: any) => {
      throw error
    })
}

const initViewshed3d = (viewer: any) => {
  Viewshed3dManager.getInstance().init(viewer)
}

const start = () => {
  Viewshed3dManager.getInstance().start()
}

const clear = () => {
  Viewshed3dManager.getInstance().clear()
}

onMounted(() => {
  onload()
})
</script>

<style scoped lang="scss">
button {
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
}

.toolbar {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;
  padding: 8px;
  z-index: 1000;
}
</style>
