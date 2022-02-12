/**
 * 需要分享的前端应用可以复制下面的代码并在需要分享的页面调用wxShareInit
 * 参考：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 */
import wx from 'weixin-js-sdk'

/**
 * 通过config接口注入权限验证配置
 * 请在前端页面调用
 * @param {Object} params
 */
const wxConfig = async (params) => {
	const { appId, timestamp, nonceStr, signature, jsApiList, onReady, onError } = params
	wx.config({
		debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId, // 必填，公众号的唯一标识
		timestamp, // 必填，生成签名的时间戳
		nonceStr, // 必填，生成签名的随机串
		signature,// 必填，签名
		jsApiList: jsApiList // 必填，需要使用的JS接口列表，具体可以查看JS接口列表：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63
	});
	// 通过ready接口处理成功验证
	wx.ready(function () {
		// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		console.log('wx ready')
		onReady && onReady()
	});

	// 通过error接口处理失败验证
	wx.error(function (error) {
		// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		console.error('wx error', error)
		onError && onError(error)
	});
}

/**
 * 微信Api初始化
 * 请在需要分享的前端页面调用
 * @param {Object} url -需要分享的前端页面
 */
export const wxShareInit = async (url) => {
	const data = await getSignature(url) // 后端提供的获取签名api
	const { appId, timestamp, nonceStr, signature } = data
	wxConfig({
		appId,
		timestamp,
		nonceStr,
		signature,
		jsApiList: [
			// 分享需要用到以下几个接口
			'updateAppMessageShareData', // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
			'updateTimelineShareData', // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
			'updateTimelineShareData', // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
		],
		onReady: () => {
			console.log('初始化成功')
			shareApp({
				title: 'xxxxx',
				desc: 'xxxxx',
				link: 'xxxxx',
				imgUrl: 'xxxxx',
			}) // 分享配置
		},
		onError: (error) => {
			console.log('初始化失败', error)
		}
	})
}