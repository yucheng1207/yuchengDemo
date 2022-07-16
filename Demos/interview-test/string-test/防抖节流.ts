/**
 * 函数防抖(debounce)：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
 * 场景：search搜索联想，用户在不断输入值时，用防抖来节约请求资源。
 *      window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次
 */
function debounce(fun, delay) {
	return function (args) {
		let that = this
		let _args = args
		clearTimeout(fun.id)
		fun.id = setTimeout(function () {
			fun.call(that, _args)
		}, delay)
	}
}

/**
 * 函数节流(throttle)：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
 * 场景：鼠标不断点击触发，mousedown(单位时间内只触发一次)
 *      监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断
 */
function throttle(fun, delay) {
	let last, deferTimer
	return function (args) {
		let that = this
		let _args = arguments
		let now = +new Date()
		if (last && now < last + delay) {
			clearTimeout(deferTimer)
			deferTimer = setTimeout(function () {
				last = now
				fun.apply(that, _args)
			}, delay)
		} else {
			last = now
			fun.apply(that, _args)
		}
	}
}


/**
 *
 * @param fn 待执行函数
 * @param time 执行次数
 * @param delay 执行延迟时间
 */
function help(fn, time, delay) {
	let that = this
	return function (...args) {
		if (time) {
			setTimeout(() => {
				console.log('222', time, args)
				fn.apply(that, args)
				help(fn, --time, delay)(...args)
			}, delay)
		}
	}
}

function test1(a) {
	console.log('123', a)
}

help(test1, 3, 2000)(1)