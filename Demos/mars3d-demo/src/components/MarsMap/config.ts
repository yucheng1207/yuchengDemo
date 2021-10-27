// map 实例：http://mars3d.cn/api/Map.html
const options = {
  scene: {
    // 默认视角参数
    center: {
      lat: 30.526361,
      lng: 116.335987,
      alt: 45187,
      heading: 0,
      pitch: -45
    },
    shadows: false, // 是否启用日照阴影
    removeDblClick: true, // 是否移除Cesium默认的双击事件

    // 以下是Cesium.Viewer所支持的options【控件相关的写在另外的control属性中】
    sceneMode: 3, // 3等价于Cesium.SceneMode.SCENE3D,

    // 以下是Cesium.Scene对象相关参数
    showSun: true, // 是否显示太阳
    showMoon: true, // 是否显示月亮
    showSkyBox: true, // 是否显示天空盒
    showSkyAtmosphere: true, // 是否显示地球大气层外光圈
    fog: true, // 是否启用雾化效果
    fxaa: true, // 是否启用抗锯齿

    // 以下是Cesium.Globe对象相关参数
    globe: {
      depthTestAgainstTerrain: false, // 是否启用深度监测
      baseColor: '#546a53', // 地球默认背景色
      showGroundAtmosphere: true, // 是否在地球上绘制的地面大气
      enableLighting: false // 是否显示昼夜区域
    },
    // 以下是Cesium.ScreenSpaceCameraController对象相关参数
    cameraController: {
      zoomFactor: 3.0, // 鼠标滚轮放大的步长参数
      minimumZoomDistance: 1, // 地球放大的最小值（以米为单位）
      maximumZoomDistance: 50000000, // 地球缩小的最大值（以米为单位）
      enableRotate: true, // 2D和3D视图下，是否允许用户旋转相机
      enableTranslate: true, // 2D和哥伦布视图下，是否允许用户平移地图
      enableTilt: true, // 3D和哥伦布视图下，是否允许用户倾斜相机
      enableZoom: true, // 是否允许 用户放大和缩小视图
      enableCollisionDetection: true // 是否允许 地形相机的碰撞检测
    }
  },
  control: {
    baseLayerPicker: true, // basemaps底图切换按钮
    homeButton: true, // 视角复位按钮
    sceneModePicker: true, // 二三维切换按钮
    navigationHelpButton: true, // 帮助按钮
    fullscreenButton: true // 全屏按钮
  },
  terrain: {
    // 地形类型：http://mars3d.cn/api/global.html#TerrainType
    // example: http://mars3d.cn/example/editor.html?code=true#b10_terrain

    // 标准xyz瓦片地形:
    url: 'http://data.mars3d.cn/terrain',

    // ArcGIS地形服务
    // type: 'arcgis',
    // url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',

    // Cesium官方ion在线服务
    // type: 'ion',
    // requestWaterMask: true,
    // requestVertexNormals: true,

    // 谷歌地球企业服务
    // type: 'gee',
    // url: 'http://www.earthenterprise.org/3d',
    // proxy: '//server.mars3d.cn/proxy/',

    // vr地形服务
    // type: 'vr',
    // url: 'https://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/',

    show: true
  },
  basemaps: [
    { id: 10, name: '地图底图', type: 'group' }, // 图层管理 的图层分组节点（虚拟节点）
    {
      pid: 10,
      id: 2021,
      name: '天地图卫星',
      icon: 'http://mars3d.cn/example/img/basemaps/tdt_img.png',
      type: 'tdt',
      layer: 'img_d',
      key: ['9ae78c51a0a28f06444d541148496e36'],
      show: true
    },
    {
      pid: 10,
      name: '天地图电子',
      icon: 'http://mars3d.cn/example/img/basemaps/tdt_vec.png',
      type: 'group', // 多个图层放在一起控制管理
      layers: [
        {
          name: '底图',
          type: 'tdt',
          layer: 'vec_d',
          key: ['9ae78c51a0a28f06444d541148496e36']
        },
        {
          name: '注记',
          type: 'tdt',
          layer: 'vec_z',
          key: ['9ae78c51a0a28f06444d541148496e36']
        }
      ]
    },
    {
      name: '单张图片',
      icon: 'http://mars3d.cn/example/img/basemaps/offline.png',
      type: 'image',
      url: 'http://mars3d.cn/example/img/tietu/world.jpg'
    },
    {
      pid: 10,
      name: '离线地图',
      icon: 'http://mars3d.cn/example/img/basemaps/mapboxSatellite.png',
      type: 'xyz', // 标准金字塔地图
      url: 'http://data.mars3d.cn/tile/googleImg/{z}/{x}/{y}.jpg',
      maximumLevel: 12
    },
    {
      name: '高德地图',
      icon: 'http://mars3d.cn/example/img/basemaps/gaode_vec.png',
      type: 'xyz',
      url: 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      maximumLevel: 12
    },
    {
      name: '高德影像',
      icon: 'http://mars3d.cn/example/img/basemaps/gaode_img.png',
      type: 'xyz',
      url: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      maximumLevel: 12
    },
    {
      name: 'Google地图',
      icon: 'http://mars3d.cn/example/img/basemaps/google_vec.png',
      type: 'xyz',
      url: 'http://mt1.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile',
      maximumLevel: 12
    },
    {
      name: 'Google影像',
      icon: 'http://mars3d.cn/example/img/basemaps/google_img.png',
      type: 'xyz',
      url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
      maximumLevel: 12
    }
  ],
  layers: [
    {
      type: 'tdt', // 必须的参数
      name: '天地图注记',
      layer: 'img_z',
      key: ['9ae78c51a0a28f06444d541148496e36'],
      show: true
    }
  ]
}

export default options
