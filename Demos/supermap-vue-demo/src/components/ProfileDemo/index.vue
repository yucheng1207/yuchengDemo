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
  <div id="toolbar" class="param-container tool-bar">
    <button type="button" id="chooseView" class="button black">剖面分析</button>
    <button type="button" id="clear" class="button black">清除</button>
  </div>
  <canvas
    style="position: absolute; right: 2%; bottom: 2%; background-color: rgba(65, 65, 65, 0.5)"
    id="pro"
    height="0"
    width="0"
  ></canvas>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'
import $ from 'jquery'
import { URL_CONFIG } from '@/static/urlConfig'
import Tooltip from './tooltip'

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
  $('#toolbar').show()
  $('#loadingbar').remove()
  if (!scene.pickPositionSupported) {
    alert('不支持深度纹理,剖面分析功能无法使用！')
  }
  // 创建剖面分析对象
  const profile = new Cesium.Profile(scene)
  const tooltip = new Tooltip(document.body)
  const widget = viewer.cesiumWidget
  try {
    // 添加S3M图层
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
      bridgePromise
    ]
    Cesium.when.all(
      promiseSet,
      function (layer: any) {
        scene.camera.setView({
          // 图层加载完成,设置相机位置
          destination: Cesium.Cartesian3.fromDegrees(116.4473, 39.9011, 127),
          orientation: {
            heading: 0.2732,
            pitch: -0.1583,
            roll: 0
          }
        })
        for (let i = 0; i < layer.length; i++) {
          layer[i].selectEnabled = false
        }
      },
      function (e) {
        if (widget._showRenderLoopErrors) {
          const title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？'
          widget.showErrorPanel(title, undefined, e)
        }
      }
    )
    const handlerLine = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line)
    handlerLine.activeEvt.addEventListener(function (isActive: any) {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        $('body').removeClass('drawCur').addClass('drawCur')
      } else {
        viewer.enableCursorStyle = true
        $('body').removeClass('drawCur')
      }
    })
    handlerLine.movingEvt.addEventListener(function (windowPosition: any) {
      if (handlerLine.isDrawing) {
        tooltip.showAt(windowPosition, '<p>右键单击结束绘制</p>')
      } else {
        tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
      }
    })
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)

    handlerLine.drawEvt.addEventListener(function (result: any) {
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
      profile.startPoint = [slongitude, slatitude, sheight]
      profile.endPoint = [elongitude, elatitude, eheight]

      profile.extendHeight = 40

      // 分析完毕的回调函数
      profile.getBuffer(function (buffer: any) {
        const canvas = document.getElementById('pro') as any
        canvas.height = profile._textureHeight
        canvas.width = profile._textureWidth
        const ctx = canvas.getContext('2d')
        const imgData = ctx.createImageData(profile._textureWidth, profile._textureHeight)
        imgData.data.set(buffer)
        // 在canvas上绘制图片
        ctx.putImageData(imgData, 0, 0)
        $('#pro').width(600)
        $('#pro').height(450)
      })

      profile.build()
    })
    const chooseViewElement = document.getElementById('chooseView')
    if (chooseViewElement) {
      chooseViewElement.onclick = function () {
        // 先清除之前绘制的线
        handlerLine.clear()
        $('#pro').width(0)
        $('#pro').height(0)
        if (handlerLine.active) {
          //
        } else {
          handlerLine.activate()
          // 由于剖面分析只能绘制直线，此处绘制时单击两次就触发结束事件
          handler.setInputAction(function (e: any) {
            if (handlerLine.polyline._actualPositions.length === 2) {
              const result: any = {}
              result.object = handlerLine.polyline
              handlerLine.drawEvt.raiseEvent(result)
              handlerLine.deactivate()
              handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }
      }
    }
    const clearElement = document.getElementById('clear')
    if (clearElement) {
      clearElement.onclick = () => {
        handlerLine.clear()
        $('#pro').width(0)
        $('#pro').height(0)
      }
    }
  } catch (e) {
    if (scene.context.depthTexture) {
      // swal('剖面分析', '该浏览器不支持深度纹理检测', 'warning')
    }
  }
}

onMounted(() => {
  onload()
})
</script>

<style scoped lang="scss">
@import url('../../styles/webgl/pretty.css');
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
