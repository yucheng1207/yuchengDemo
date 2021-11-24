<template>
  <div id="cesiumContainer"></div>
  <!-- 剖面分析canvas -->
  <canvas
    style="position: absolute; right: 2%; bottom: 2%; background-color: rgba(65, 65, 65, 0.5)"
    id="profile_canvas"
    height="0"
    width="0"
  ></canvas>
  <div class="toolbar">
    <el-button @click="startViewshed3d">绘制可视域</el-button>
    <el-button @click="clearViewshed3d">清除可视域</el-button>
    <el-button @click="startProfile">开始剖面分析</el-button>
    <el-button @click="clearProfile">清除剖面分析</el-button>
    <el-button @click="sunlight">日照分析</el-button>
    <el-button @click="clearSunlight">清除日照分析</el-button>
    <el-button @click="startSlope">坡度分析</el-button>
    <el-button @click="clearSlope">清除坡度分析</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'
import registerWindowFunction from '@/utils/window'
import Viewshed3dManager from './Viewshed3dManager'
import ProfileManager from './ProfileManager'
import { URL_CONFIG } from '../../static/urlConfig'
import ShadowQueryManager from './ShadowQueryManager'
import TerrainSlopeAnalysisManager from './TerrainSlopeAnalysisManager'

// const tilesUrl =
//   'https://beta.cesium.com/api/assets/1458?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmJiNTAxOC1lOTg5LTQzN2EtODg1OC0zMWJjM2IxNGNlYmMiLCJpZCI6NDQsImFzc2V0cyI6WzE0NThdLCJpYXQiOjE0OTkyNjM4MjB9.1WKijRa-ILkmG6utrhDWX6rDgasjD7dZv-G5ZyCmkKg'
const tilesUrl = 'http://data.mars3d.cn/3dtiles/qx-shequ/tileset.json'

const { Cesium } = window as any

const onload = async () => {
  // const { viewer } = await createCesium3dTileset('cesiumContainer')
  // const { viewer, layers } = await createBingMap('cesiumContainer')
  const { viewer } = await createPrdTerrain('cesiumContainer')
  // registerWindowFunction(viewer.scene)
  // initViewshed3d(viewer)
  // initProfile(viewer)
  // initShadowQuery(viewer, layers)
  initSlopeAnalysis(viewer)
}

const createCesium3dTileset = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!Cesium) {
      reject(new Error('can not find cesium'))
    }
    const obj = [6378137.0, 6378137.0, 6356752.3142451793]
    Cesium.Ellipsoid.WGS84 = Object.freeze(new Cesium.Ellipsoid(obj[0], obj[1], obj[2]))
    const viewer = new Cesium.Viewer(id)

    const tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: tilesUrl
      })
    )

    tileset.readyPromise
      .then(() => {
        const { boundingSphere } = tileset
        viewer.camera.viewBoundingSphere(
          boundingSphere,
          new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius)
        )
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        resolve({ viewer })
      })
      .otherwise((error: any) => {
        reject(error)
      })
  })
}

const createPrdTerrain = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!Cesium) {
      reject(new Error('can not find cesium'))
    }
    const viewer = new Cesium.Viewer(id, {
      terrainProvider: new Cesium.CesiumTerrainProvider({
        url: URL_CONFIG.ZF_TERRAIN2,
        isSct: true, // 地形服务源自SuperMap iServer发布时需设置isSct为true
        requestVertexNormals: true
      }),
      timeline: true
    })
    // 添加SuperMap iServer发布的影像服务
    viewer.imageryLayers.addImageryProvider(
      new Cesium.SuperMapImageryProvider({
        url: URL_CONFIG.ZF_IMG2
      })
    )
    const { scene } = viewer
    scene.globe.enableLighting = true
    viewer.scene.globe.setPBRMaterialFromJSON('./data/pbr/地形/pipesUNI_terrain.json') // pbr
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(87.1, 27.8, 8000.0),
      orientation: {
        heading: 6.10547067016156,
        pitch: -0.8475077031996778,
        roll: 6.2831853016686185
      }
    })
    resolve({ viewer })
  })
}

const createBingMap = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!Cesium) {
      reject(new Error('can not find cesium'))
    }
    const viewer = new Cesium.Viewer(id, { shadows: true })
    viewer.imageryLayers.addImageryProvider(
      new Cesium.BingMapsImageryProvider({
        url: 'https://dev.virtualearth.net',
        mapStyle: Cesium.BingMapsStyle.AERIAL,
        key: URL_CONFIG.BING_MAP_KEY
      })
    )
    const { scene } = viewer
    scene.shadowMap.darkness = 0.3 // 1.275 // 设置第二重烘焙纹理的效果（明暗程度）
    scene.skyAtmosphere.brightnessShift = 0.4 // 修改大气的亮度
    scene.debugShowFramesPerSecond = true
    scene.hdrEnabled = false
    scene.sun.show = true // false
    // 01设置环境光的强度-新处理CBD场景
    scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1)
    // 添加光源
    const position1 = new Cesium.Cartesian3.fromDegrees(116.261209157595, 39.3042238956531, 480)
    // 光源方向点

    const targetPosition1 = new Cesium.Cartesian3.fromDegrees(
      116.261209157595,
      39.3042238956531,
      430
    )
    const dirLightOptions = {
      targetPosition: targetPosition1,
      color: new Cesium.Color(1.0, 1.0, 1.0, 1),
      intensity: 0.55
    }
    const directionalLight_1 = new Cesium.DirectionalLight(position1, dirLightOptions)
    scene.addLightSource(directionalLight_1)

    // 添加S3M图层
    const widget = viewer.cesiumWidget
    const buildPromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_BUILD, { name: 'build' })
    const ground1Promise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_GROUND1, {
      name: 'ground1'
    })
    const lakePromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_LAKE, { name: 'lake' })
    const treePromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_TREE, { name: 'tree' })
    const roadPromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_ROAD, { name: 'road' })
    const bridgePromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_BRIDGE, { name: 'bridge' })
    const ground2Promise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_GROUND2, {
      name: 'ground2'
    })
    const promiseSet = [
      ground1Promise,
      buildPromise,
      lakePromise,
      treePromise,
      roadPromise,
      bridgePromise,
      ground2Promise
    ]
    Cesium.when.all(
      promiseSet,
      (layers: any) => {
        // 图层加载完成,设置相机位置
        scene.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(116.4491, 39.9011, 180),
          orientation: {
            heading: 0.0912,
            pitch: -0.3177,
            roll: 0
          }
        })
        // for (let i = 0; i < layers.length; i++) {
        //   layers[i].selectEnabled = false
        //   layers[i].shadowType = 2
        // }
        resolve({ viewer, layers })
      },
      (e: any) => {
        if (widget._showRenderLoopErrors) {
          const title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？'
          widget.showErrorPanel(title, undefined, e)
        }
        reject(e)
      }
    )
  })
}

const initSlopeAnalysis = (viewer: any) => {
  TerrainSlopeAnalysisManager.getInstance().init(viewer)
}

const startSlope = () => {
  TerrainSlopeAnalysisManager.getInstance().start()
}

const clearSlope = () => {
  TerrainSlopeAnalysisManager.getInstance().clear()
}

const initShadowQuery = (viewer: any, layers?: any) => {
  ShadowQueryManager.getInstance().init(viewer, layers)
}

const clearSunlight = () => {
  ShadowQueryManager.getInstance().clear()
}

const sunlight = () => {
  ShadowQueryManager.getInstance().sunlight()
}

const initProfile = (viewer: any) => {
  ProfileManager.getInstance().init(viewer, 'profile_canvas')
}

const startProfile = () => {
  ProfileManager.getInstance().start()
}

const clearProfile = () => {
  ProfileManager.getInstance().clear()
}

const initViewshed3d = (viewer: any) => {
  Viewshed3dManager.getInstance().init(viewer)
}

const startViewshed3d = () => {
  Viewshed3dManager.getInstance().start()
}

const clearViewshed3d = () => {
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
