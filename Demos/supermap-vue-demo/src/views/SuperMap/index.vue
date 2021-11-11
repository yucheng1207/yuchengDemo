<template>
  <!-- 算量 -->
  <sm3d-viewer :scene-url="sceneUrl">
    <sm3d-measure></sm3d-measure>
  </sm3d-viewer>
</template>

<script setup lang="ts">
const sceneUrl = 'http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace'
</script>

<style scoped lang="scss">
button {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}
</style>
