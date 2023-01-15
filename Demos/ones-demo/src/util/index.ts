/* eslint-disable @typescript-eslint/no-explicit-any */
export const KB = 1024.0
export const MB = 1024 * KB
export const GB = 1024 * MB

/**
 * Byte转MB
 * @param bytes 字节数
 */
export const byteToMb = (bytes: number): number => {
	return Number((bytes / MB).toFixed(2))
}

/**
 * Byte转KB
 * @param bytes 字节数
 */
export const byteToKb = (bytes: number): number => {
	return Number((bytes / KB).toFixed(2))
}


/**
 * 在新的标签页中打开url
 * @param url 需要打开的网页地址
 */
export const openUrl = (url?: string): void => {
	url && window.open(url, '_blank')
}

const SectionToChinese = (section: any) => {
	const chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	const chnUnitChar = ["", "十", "百", "千"];
	let strIns = '';
	let chnStr = '';
	let unitPos = 0;
	let zero = true;

	while (section > 0) {
		const v = section % 10;
		if (v === 0) {
			if (!zero) {
				zero = true;
				chnStr = chnNumChar[v] + chnStr;
			}
		} else {
			zero = false;
			strIns = chnNumChar[v];
			strIns += chnUnitChar[unitPos];
			chnStr = strIns + chnStr;
		}
		unitPos++;
		section = Math.floor(section / 10);
	}
	return chnStr;
}

export const NumberToChinese = (num: number): string => {
	const chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	const chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
	let unitPos = 0;
	let strIns = '';
	let chnStr = '';
	let needZero = false;


	if (num === 0) {
		return chnNumChar[0];
	}

	while (num > 0) {
		const section = num % 10000;
		if (needZero) {
			chnStr = chnNumChar[0] + chnStr;
		}
		strIns = SectionToChinese(section);
		strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
		chnStr = strIns + chnStr;
		needZero = (section < 1000) && (section > 0);
		num = Math.floor(num / 10000);
		unitPos++;
	}

	return chnStr;
}

/**
 * 通过文件路径获取文件的后缀名
 * @param filepath 文件路径
 */
export const getFileExtension = (filepath: string): string => {
	const ext = filepath.split('.').pop();
	if (ext) {
		return ext.toLowerCase()
	}
	return 'unknown'
}

/**
 * Get param required for osstoken API
 *
 * @param {any} data - data used to generate param
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getParam = (data: any): string => {
	// 转为 json 字符串
	let dataStr = JSON.stringify(data);
	// URL安全的Base64编码, 先转为 base64
	// 再将字符串中的加号 “+” 换成中划线 “-”，并且将斜杠 “/” 换成下划线 “_”
	dataStr = Buffer.from(dataStr).toString("base64");
	const param = dataStr.replace(/\+/g, "-").replace(/\//g, "_");
	return param;
}

/**
 * 获取参数填充之后的路由路径
 * @param path 填充前的路由路径
 * @param params 参数
 */
export const getFillParamPath = (path: string, params: { [key: string]: string }): string => {
	let fillPath = path
	for (const name in params) {
		fillPath = fillPath.replace(`:${name}`, params[name])
	}
	return fillPath
}

/**
 * debounce for fn
 * @param fn target function
 * @param wait wait millisecond
 */
// tslint:disable-next-line: ban-types
export function debounce(fn: Function, wait: number): (...args: any[]) => void {
	let timer: any = 0
	return function (...args: any[]) {
		if (timer) {
			clearTimeout(timer)
		}

		timer = setTimeout(() => {
			fn.apply(this, args)
		}, wait)
	}
}

/**
 * 计算元素的个数
 * @param containerWidth 容器宽度
 * @param width 元素宽度
 * @param gapWidth 间距宽度
 */
export const calcCount = (containerWidth: number, width: number, gapWidth: number): number => {
	let n = 1;
	while (containerWidth >= ((n * width) + (n - 1) * gapWidth)) {
		n++;
	}
	return n - 1
}

/**
 * 判断是否被iframe加载
 */
export function loadedByIFrame() {
	try {
		return window.top !== window.self
	}
	catch (error) {
		console.error('loadedByIFrame Error:', error)
		return false
	}
}

/**
 * 判断是否是数字
 */
export const isNumber = (num: any) => {
	return typeof (num) === "number" && num !== Infinity && !isNaN(num) && num !== undefined && num !== null
}

/**
 * 判断是否是对象
 */
export const isObject = (obj: any) => {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 删除对象中的空（null,undefined,''）属性
 * @param obj
 */
export function deleteEmptyObj(obj: any) {
	const result: any = {};
	if (obj === null || obj === undefined || obj === "") return result;
	for (const key in obj) {
		if (isObject(obj[key])) {
			result[key] = deleteEmptyObj(obj[key]);
		}
		else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
			result[key] = obj[key];
		}
	}
	return result;
}

/**
 * 保留数字的位数
 * @param num 数字
 * @param fractionDigits 保留位数
 */
export const toFixedNumber = (num: number, fractionDigits: number): number => {
	return Number(num.toFixed(fractionDigits))
}

/**
 * 生成随机字符串
 * @param digitNum 字符串长度
 */
export const getRandomChars = (digitNum: number) => {
	const result: string[] = []
	for (let i = 0; i < digitNum; i++) {
		// 通过随机数的奇偶值来决定当前字母的大小写
		// const startAsciiNum: number = Math.ceil(Math.random() * 1000) % 2 === 0 ? 65 : 97
		const startAsciiNum = 97
		// 生成一个 0 ~ 25 的随机数
		const cursorAsciiNum = Math.ceil(Math.random() * 25)
		result.push(String.fromCharCode(startAsciiNum + cursorAsciiNum))
	}
	return result.join('')
}

/**
 * 标准化 requestFullscreen 方法
 * @param {DOM} elem 要全屏显示的元素(webkit下只要是DOM即可，Firefox下必须是文档中的DOM元素)
 */
export function requestFullscreen(elem: any) {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	}
	else if (elem.webkitRequestFullScreen) {
		// 对 Chrome 特殊处理，
		// 参数 Element.ALLOW_KEYBOARD_INPUT 使全屏状态中可以键盘输入。
		if (window.navigator.userAgent.toUpperCase().indexOf('CHROME') >= 0) {
			elem.webkitRequestFullScreen();
		}
		// Safari 浏览器中，如果方法内有参数，则 Fullscreen 功能不可用。
		else {
			elem.webkitRequestFullScreen();
		}
	}
	else if (elem.mozRequestFullScreen) {
		elem.mozRequestFullScreen();
	}
}

/**
 * 标准化 exitFullscreen 方法
 */
export function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	}
	else if ((document as any).webkitCancelFullScreen) {
		(document as any).webkitCancelFullScreen();
	}
	else if ((document as any).mozCancelFullScreen) {
		(document as any).mozCancelFullScreen();
	}
}

/**
 * 标准化 fullscreen 属性 （只读）
 * 以同名方法替代
 */
export function fullscreen() {
	return !!document.fullscreenElement ||
		!!(document as any).webkitIsFullScreen ||
		!!(document as any).mozFullScreen ||
		false;
}

/**
 * 获取小数点后几位数
 * @param value 数据
 * @param n 取小数点后几位数
 * @returns
 */

export function formatFloat(value: number, n: number) {
	// Math.pow() 函数返回基数的指数次幂
	return Math.floor(value * Math.pow(10, n)) / Math.pow(10, n)
}