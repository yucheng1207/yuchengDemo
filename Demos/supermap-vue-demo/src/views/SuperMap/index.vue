<template>
  <Cesium3dTiles />
</template>

<script setup lang="ts">
import Cesium3dTiles from '@/components/Cesium3dTiles/index.vue'
import IServerTiles from '@/components/IServerTiles/index.vue'

// SuperMap_iClient3D_VUE_for_WebGL测试：https://www.supermapol.com/earth/vue-iEarth/examples/docs/dist/zh/api/3DAnalysis/measure.html
import IClient3dVueTest from '@/components/IClient3dVueTest/index.vue' // @supermap/iclient3d-vue-for-webgl 组件测试

// 官方示例测试: http://support.supermap.com.cn:8090/webgl/examples/webgl/examples.html#layer
import Viewshed3dDemo from '@/components/Viewshed3dDemo/index.vue' // 可视域分析
import ProfileDemo from '@/components/ProfileDemo/index.vue'
</script>

<style scoped lang="scss">
button {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}
</style>
