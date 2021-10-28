<template>
  <div :id="withKeyId" class="mars3d-container mars3d-container-compare-rh"></div>
</template>
<script setup lang="ts">
import { onMounted, computed, onBeforeUnmount, getCurrentInstance } from 'vue'
import myOptions from './config'
import myWidgetOptions from './widget'

const instance = getCurrentInstance()
const mars3d = instance?.appContext.config.globalProperties.mars3d

// props选项
const props = withDefaults(
  defineProps<{
    url: string
    widgetUrl: string
    mapKey?: string
    options?: object
  }>(),
  {
    url: '',
    mapKey: '',
    options: () => ({})
  }
)

// 用于存放组件实例
let mapviewer: any = null

// 使用用户传入的 mapKey 拼接生成 withKeyId 作为当前显示容器的id
const withKeyId = computed(() => `mars3d-container-${props.mapKey}`)

// onload事件将在地图渲染后触发
const emit = defineEmits(['onload'])
// 初始化外部静态widget功能（兼容使用传统模式开发的一些widget）
const initStaticWidget = (map: any, widget: any) => {
  console.log('initStaticWidget', mars3d)
  mars3d.widget.init(map, widget) // widgets目录相对于当前html页面的相对路径
  // mars3d.widget.init(map, widget, '../') // widgets目录相对于当前html页面的相对路径
}
const initMars3d = (option: object) => {
  return new mars3d.Map(withKeyId.value, option)
}

const useConfigJson = false
const useWidgetJson = false
onMounted(async () => {
  const configData = useConfigJson
    ? await mars3d.Resource.fetchJson({ url: props.url }).map3d
    : myOptions
  const widgetData =
    useWidgetJson && props.widgetUrl
      ? await mars3d.Resource.fetchJson({ url: props.widgetUrl })
      : myWidgetOptions
  console.log('config data:', configData)
  console.log('widget data:', widgetData)
  mapviewer = initMars3d({
    // 合并配置项
    ...props.options,
    ...configData
  })
  if (mapviewer && widgetData) {
    initStaticWidget(mapviewer, widgetData)
  }
  emit('onload', mapviewer)
})

// 组件卸载之前销毁mars3d实例
onBeforeUnmount(() => {
  mars3d?.widget?.destroy()
  mapviewer?.destroy()
})
</script>

<style lang="scss">
.mars3d-container {
  height: 100%;
  overflow: hidden;
}

/* 重写Cesium的css */

/**cesium按钮背景色*/
.cesium-button {
  background-color: #3f4854;
  color: #e6e6e6;
  fill: #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 32px;
}

.cesium-viewer-geocoderContainer .cesium-geocoder-input {
  background-color: rgba(63, 72, 84, 0.7);
}

.cesium-viewer-geocoderContainer .cesium-geocoder-input:focus {
  background-color: rgba(63, 72, 84, 0.9);
}

.cesium-viewer-geocoderContainer .search-results {
  background-color: #3f4854;
}

.cesium-geocoder-searchButton {
  background-color: #3f4854;
}

.cesium-infoBox-title {
  background-color: #3f4854;
}

.cesium-infoBox {
  background: rgba(63, 72, 84, 0.9);
}

.cesium-toolbar-button img {
  height: 100%;
}

.cesium-performanceDisplay-defaultContainer {
  top: auto;
  bottom: 35px;
  right: 50px;
}
.cesium-performanceDisplay-ms,
.cesium-performanceDisplay-fps {
  color: #fff;
}

/**cesium工具栏位置*/
.cesium-viewer-toolbar {
  top: auto;
  left: auto;
  right: 12px;
  bottom: 35px;
}

.cesium-viewer-toolbar > .cesium-toolbar-button,
.cesium-navigationHelpButton-wrapper,
.cesium-viewer-geocoderContainer {
  margin-bottom: 5px;
  float: right;
  clear: both;
  text-align: center;
}

.cesium-baseLayerPicker-dropDown {
  bottom: 0;
  right: 40px;
  max-height: 700px;
  margin-bottom: 5px;
}

.cesium-navigation-help {
  top: auto;
  bottom: 0;
  right: 40px;
  transform-origin: right bottom;
}

.cesium-sceneModePicker-wrapper {
  width: auto;
}

.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-dropDown-icon {
  float: left;
  margin: 0 3px;
}

.cesium-viewer-geocoderContainer .search-results {
  left: 0;
  right: 40px;
  width: auto;
  z-index: 9999;
}

.cesium-infoBox-title {
  background-color: #3f4854;
}

.cesium-infoBox {
  top: 50px;
  background: rgba(63, 72, 84, 0.9);
}

/**左下工具栏菜单*/
.toolbar-dropdown-menu-div {
  background: rgba(43, 44, 47, 0.8);
  border: 1px solid #2b2c2f;
  z-index: 991;
  position: absolute;
  right: 60px;
  bottom: 40px;
  display: none;
}

.toolbar-dropdown-menu {
  min-width: 110px;
  padding: 0;
}
.toolbar-dropdown-menu > li {
  padding: 0 3px;
  margin: 2px 0;
}
.toolbar-dropdown-menu > li > a {
  color: #edffff;
  display: block;
  padding: 4px 10px;
  clear: both;
  font-weight: normal;
  line-height: 1.6;
  white-space: nowrap;
  text-decoration: none;
}

.toolbar-dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
  color: #fff;
  background-color: #444d59;
}

.toolbar-dropdown-menu > .active > a,
.dropdown-menu > .active > a:hover,
.dropdown-menu > .active > a:focus {
  color: #fff;
  background-color: #444d59;
}

.toolbar-dropdown-menu i {
  padding-right: 5px;
}
</style>
