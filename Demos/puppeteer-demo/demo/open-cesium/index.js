/**
 * 使用无头浏览器打开一个cesium模型播放器，获取模型高度
 */

const puppeteer = require('puppeteer');

/**
 * 在模型播放器中注册此函数
 */
//  registerWindowFunction = (scene?: Cesium.Scene) =>
//  {
//      if (scene)
//      {
//          console.log('register getHeight function...');
//          (window as any).getHeight = (points: { lat: number, lng: number }[]) =>
//          {
//              if (points && points.length)
//              {
//                  return new Promise(async (resolve, reject) =>
//                  {
//                      try
//                      {
//                          const isVaildPoints = points.every(item => item.lat && item.lng)
//                          if (isVaildPoints)
//                          {
//                              const cartographics = points.map(item => Cesium.Cartographic.fromDegrees(item.lng, item.lat))
//                              console.log('Execution function sampleHeightMostDetailed', cartographics)
//                              const result = await scene.sampleHeightMostDetailed(cartographics) // [Cesium.Cartographic.fromDegrees(120.6893039381743, 27.947847140746887)] => 16.47539689056034

//                              const isVaildResult = result.every(item => item.height !== undefined)
//                              console.log('sampleHeightMostDetailed result', result)
//                              resolve({
//                                  isAllVaild: isVaildResult,
//                                  result
//                              })
//                          }
//                          else
//                          {
//                              console.error('Get height failed, please enter a point in the correct format => getHeight(points: { lat: number, lng: number }[])', points)
//                              reject('Get height failed, please enter a point in the correct format => getHeight(points: { lat: number, lng: number }[])')
//                          }
//                      }
//                      catch (error)
//                      {
//                          console.error('Get height failed', error)
//                          reject(error)
//                      }
//                  })
//              }
//              else
//              {
//                  return []
//              }
//          }
//          console.log('register getHeight function success');
//      }
//      else
//      {
//          console.error('register getHeight function failed, scene does not exist')
//      }
//  }

/**
 * 等待加载的页面打印“register getHeight function success”表示window.getHeight函数注册成功
 */
const waitGetHeightFunctionResiger = async (page) =>
{
    return new Promise((resolve) =>
    {
        page.on('console', msg => {
            const text = msg.text()
            console.log('PAGE LOG:', text)
            if (text.includes('register getHeight function success'))
            {
                resolve()
            }
        });
    })
}

/**
 * 获取点在模型的高度
 * @param {String} url 模型链接
 * @param {Array<{ lat: number, lng: number }>} points 需要获取高度的点
 * @returns
 */
const getModelPointsHeight = async (url, points) => {
    // 启动浏览器
    const browser = await puppeteer.launch({
        args: ['--disable-dev-shm-usage']
    });

    // 打开页面
    const page = await browser.newPage();

    // 页面监听事件

    page.once('load', () => console.log('Page loaded!'));

    // 设置浏览器视窗
    page.setViewport({
        width: 1376,
        height: 768,
    });
    // 地址栏输入网页地址
    await page.goto(url);

    await waitGetHeightFunctionResiger(page)

    const result = await page.evaluate(async (_points) => {
        // 在页面实例上下文中执行的方法
        if (window.getHeight) {
            const data = await window.getHeight(_points)
            return data;
        }
        else
        {
            console.error('can not find getHeight function')
        }
    }, points);

    console.log('window.getHeight result:', result)

    // 关闭浏览器
    await browser.close();

    return result
};

module.exports = getModelPointsHeight;

async function main()
{
    if (require.main === module) {
        const openPath =  "http://localhost:3002/?accessToken=85ab565c2af475266ba79b4aa0b3b12b&jobId=108752052826240&allowedit=1"
        // const openPath = "file:///Users/apple/zyc/GitHub/yuchengDemo/Demos/puppeteer-demo/demo/open-cesium/test.html"
        const points = [{
            lat: 1,
            lng: 2,
        }, {
            lat: 27.947847140746887,
            lng: 120.6893039381743
        }]
        const data = await getModelPointsHeight(openPath, points);
        console.log('height', data.result.map(item => item.height))
    }
}

main()
