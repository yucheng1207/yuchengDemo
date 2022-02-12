// 参考：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
// import wx from 'weixin-js-sdk'
import crypto from 'crypto-js';
import axios from 'axios'
import random from 'string-random'
const WX_BASE_URL = 'https://api.weixin.qq.com/cgi-bin'

const generatorSha1 = (str) => {
	return crypto.SHA1(str).toString(crypto.enc.Hex)
}

/**
 * 获取Access token
 * 参考：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 * 注意运行该方法的电脑ip要加到微信公众号后台的IP白名单中
 */
const getAccessToken = async (appId, appSecret) => {
	if (!appId || !appSecret) return
	const result = await axios.get(`/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`, { baseURL: WX_BASE_URL });
	console.log('getAccessToken: ', result.data, result.data.access_token)
	return result.data.access_token
}

/**
 * 获取签名
 * @param url
 */
/**
 *
 * @param {*} appId
 * @param {*} appSecret
 * @param {*} url
 * @returns
 */
const getSignature = async (appId, appSecret, url) => {
	if (!appId || !appSecret || !url) return
	const accessToken = await getAccessToken(appId, appSecret)
	const getticketResult = await axios.get(`/ticket/getticket?access_token=${accessToken}&type=jsapi`, { baseURL: WX_BASE_URL });
	console.log('jsapi_ticket: ', getticketResult.data, getticketResult.data.ticket)
	const jsapi_ticket = getticketResult.data.ticket
	const nonceStr = random(16) // 'Wm3WZYTPz0wzccnW'
	const timestamp = new Date().getTime()
	const str = `jsapi_ticket=${jsapi_ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
	const signature = generatorSha1(str)
	const result = {
		nonceStr,
		jsapi_ticket,
		timestamp,
		url,
		signature,
		appId,
	}
	console.log('getSignature: ', result)
	return result
}

async function main() {
	const args = process.argv.slice(2)
	const appId = args[0]
	const appSecret = args[1]
	const url = args[2]
	console.log('appId:', appId)
	console.log('appSecret:', appSecret)
	console.log('url:', url)
	if (!appId || !appSecret || !url) {
		console.log('请正确调用: yarn start [appId] [appSecret] [url]')
		return
	}
	const { timestamp, nonceStr, signature } = await getSignature(appId, appSecret, url)
	console.log(`wxConfig({
		appId: '${appId}',
		timestamp: '${timestamp}',
		nonceStr: '${nonceStr}',
		signature: '${signature}',
		jsApiList: [],
		onReady: () => {
			console.log('初始化成功')
		},
		onError: (error) => {
			console.log('初始化失败', error)
		}
	})`)
	console.log(`wx.config({
		debug: true,
		appId: '${appId}',
		timestamp: '${timestamp}',
		nonceStr: '${nonceStr}',
		signature: '${signature}',
		jsApiList: [],
	});`)
	console.log(`?appId=${appId}&timestamp=${timestamp}&nonceStr=${nonceStr}&signature=${signature}`)
}

main()


