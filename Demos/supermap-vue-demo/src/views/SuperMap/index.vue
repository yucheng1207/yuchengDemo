<template>
  <!-- 算量 -->
  <!-- <sm3d-viewer :scene-url="sceneUrl">
    <sm3d-measure></sm3d-measure>
  </sm3d-viewer> -->
  <div id="cesiumContainer"></div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'

const sceneUrl = 'http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace'

const { Cesium } = window as any

const getHeight = (scene: any, points: { lat: number; lng: number }[]) => {
  const formatErrorTip =
    'Get height failed, please enter a point in the correct format => getHeight(points: { lat: number, lng: number }[])'
  if (!points || !Array.isArray(points)) {
    throw new Error(formatErrorTip)
  } else {
    try {
      const isVaildPoints = points.every((item) => item.lat && item.lng)
      if (isVaildPoints) {
        const cartographics = points.map((item) =>
          Cesium.Cartographic.fromDegrees(item.lng, item.lat)
        )
        console.log('Execution function sampleHeightMostDetailed', cartographics)
        const promise = scene.sampleHeightMostDetailed(cartographics)
        promise.then((result: any) => {
          const isVaildResult = result.every((item: any) => item.height !== undefined)
          console.log('sampleHeightMostDetailed result', result)
          return {
            isAllVaild: isVaildResult,
            points: result
          }
        })
      } else {
        console.error(formatErrorTip, points)
        throw formatErrorTip
      }
    } catch (error) {
      console.error('Get height failed', error)
      throw error
    }
  }
}

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
      url: 'https://oss.meshkit.cn/mesh-share-bucket/cc_projects/200317nanhushiyan/Production_2/Scene/Production_2.json'
    })
  )

  tileset.readyPromise
    .then(() => {
      // setTimeout(() => {
      //   getHeight(viewer.scene, [
      //     {
      //       lat: 27.947847140746887,
      //       lng: 120.6893039381743
      //     }
      //   ])
      // }, 0)

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
