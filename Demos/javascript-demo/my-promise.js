const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
	const that = this // 码可能会异步执行，用于获取正确的 this 对象
	that.state = PENDING
	that.value = null // 用于保存 resolve 或者 reject 中传入的值
	that.resolvedCallbacks = [] // 用于保存 then 中的回调，因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用
	that.rejectedCallbacks = []

	/**
	 * resolve函数
	 * @param {*} value
	 */
	function resolve(value) {
		if (that.state === PENDING) {
			that.state = RESOLVED
			that.value = value
			that.resolvedCallbacks.map(cb => cb(that.value))
		}
	}

	/**
	 * reject函数
	 * @param {*} value
	 */
	function reject(value) {
		if (that.state === PENDING) {
			that.state = REJECTED
			that.value = value
			that.rejectedCallbacks.map(cb => cb(that.value))
		}
	}

	/**
	 * 执行 Promise 中传入的函数
	 */
	try {
		fn(resolve, reject)
	} catch (e) {
		reject(e)
	}
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
	const that = this
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
	onRejected = typeof onRejected === 'function' ? onRejected : r => {
		throw r
	}
	if (that.state === PENDING) {
		that.resolvedCallbacks.push(onFulfilled)
		that.rejectedCallbacks.push(onRejected)
	}
	if (that.state === RESOLVED) {
		onFulfilled(that.value)
	}
	if (that.state === REJECTED) {
		onRejected(that.value)
	}
}

new MyPromise((resolve, reject) => {
	setTimeout(() => {
		resolve(1)
	}, 0)
}).then(value => {
	console.log(value)
})