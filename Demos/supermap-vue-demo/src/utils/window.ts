const getHeight = (scene: any, points: { lat: number; lng: number }[]) => {
  const { Cesium } = window as any
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

/**
 * 给window对象注册getHeight方法，后端使用无头浏览器调用该方法来获取点对应到模型的高度
 * doc: https://www.yuque.com/kiwi/frontend/iev7vm
 */
const registerWindowFunction = (scene?: any) => {
  if (scene) {
    // eslint-disable-next-line no-underscore-dangle
    const _window: any = window
    console.log('register getHeight function...')
    _window.getHeight = (points: { lat: number; lng: number }[]) => {
      try {
        getHeight(scene, points)
      } catch (error) {
        console.log(error)
      }
    }
    console.log('register getHeight function success')
  } else {
    console.error('register getHeight function failed, scene does not exist')
  }
}

export default registerWindowFunction
