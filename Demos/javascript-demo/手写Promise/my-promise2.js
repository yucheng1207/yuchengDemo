/**
 * 手写 Promise
 * 参考
 * - [【翻译】Promises/A+规范](https://www.ituring.com.cn/article/66566)
 * - [这一次，彻底弄懂 Promise 原理](https://juejin.cn/post/6844904063570542599)
 */

// Promise 必须为以下三种状态之一：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
// 一旦Promise 被 resolve 或 reject，不能再迁移至其他任何状态（即状态 immutable）。
const PENDING = 'pending' // 等待态 Pending
const FULFULLED = 'fulfilled' // 执行态 Fulfilled
const REJECTED = 'rejected' // 拒绝态 Rejected

/**
 * 执行步骤：
 * 1. 初始化 Promise 状态为pending
 * 2. 立即执行 Promise 中传入的 fn 函数，将Promise 内部 resolve、reject 函数作为参数传递给 fn ，按事件机制时机处理
 * 3. 执行 then(..) 注册回调处理数组（then 方法可被同一个 promise 调用多次）
 * 4. Promise里的关键是要保证 then 方法传入的参数 onFulfilled 和 onRejected，必须在then方法被调用的那一轮事件循环之后的新执行栈中执行。
 *
 * 补充说明：
 * 虽然 then 普遍认为是微任务。但是浏览器没办法模拟微任务，目前要么用 setImmediate ，这个也是宏任务，且不兼容的情况下还是用 setTimeout 打底的。
 * 还有，promise 的 polyfill (es6-promise) 里用的也是 setTimeout。因此这里就直接用 setTimeout,以宏任务来代替微任务了。
 */
function MyPromise(fn) {
	let state = PENDING // 初始化 Promise 状态（pending）
	let value = null // 保存 resolve 或者 reject 中传入的值
	const callbacks = []

	/**
	 * Promise 必须提供 then 方法来访问其当前值、终值和据因。
	 * then用于注册回调函数，then 方法可被同一个 promise 调用多次
	 * @param {*} onFulfilled 可选，如果 onFulfilled 不是函数，其必须被忽略，其第一个参数为 promise 的终值
	 * @param {*} onRejected 可选，如果 onRejected 不是函数，其必须被忽略，其第一个参数为 promise 的据因
	 * @returns
	 */
	this.then = function (onFulfilled, onRejected) {
		console.log('then', state)
		return new MyPromise((resolve, reject) => {
			handle({
				onFulfilled,
				onRejected,
				resolve,
				reject,
			})
		})
	}

	this.catch = function (onError) {
		return this.then(null, onError)
	}

	this.finally = function (onDone) {
		this.then(onDone, onDone)
	}

	/**
	 * 提供resolve方法允许用户使用 MyPromise.resolve(...) 将非 Promise 实例包装为 Promise 实例
	 * Promise.resolve({name:'winty'})
	 * Promise.reject({name:'winty'})
	 * 等价于
	 * new Promise(resolve => resolve({name:'winty'}))
	 * new Promise((resolve,reject) => reject({name:'winty'}))
	 * @param {*} value
	 * @returns
	 */
	this.resolve = function (value) {
		if (value && value instanceof MyPromise) { // 一个Promise实例 [直接返回当前实例]
			return value
		} if (value && typeof value === 'object' && typeof value.then === 'function') { // 一个thenable对象(thenable对象指的是具有then方法的对象) [转为 Promise 对象，并立即执行thenable对象的then方法。]
			const { then } = value
			return new MyPromise((resolve) => {
				then(resolve)
			})
		} if (value) {
			return new MyPromise(resolve => resolve(value)) // 普通数据对象 [直接返回一个resolved状态的 Promise 对象]
		}
		return new MyPromise(resolve => resolve()) // 无参数 [直接返回一个resolved状态的 Promise 对象]
	}

	/**
	 * 提供reject方法允许用户使用 MyPromise.reject(...) 返回一个状态的rejected的Promise实例
	 * @param {*} value
	 * @returns
	 */
	this.reject = function (value) {
		return new MyPromise(((resolve, reject) => {
			reject(value)
		}))
	}

	/**
	 * MyPromise.all
	 * 入参是一个 Promise 的实例数组，然后注册一个 then 方法，然后是数组中的 Promise 实例的状态都转为 fulfilled 之后则执行 then 方法。
	 * 这里主要就是一个计数逻辑，每当一个 Promise 的状态变为 fulfilled 之后就保存该实例返回的数据，然后将计数减一，
	 * 当计数器变为 0 时，代表数组中所有 Promise 实例都执行完毕。
	 * @param {*} arr
	 * @returns
	 */
	this.all = function (arr) {
		const args = Array.prototype.slice.call(arr)
		return new MyPromise(((resolve, reject) => {
			if (args.length === 0) return resolve([])
			let remaining = args.length

			function res(i, val) {
				try {
					if (val && (typeof val === 'object' || typeof val === 'function')) {
						const { then } = val
						if (typeof then === 'function') {
							then.call(val, (val) => {
								res(i, val)
							}, reject)
							return
						}
					}
					args[i] = val
					if (--remaining === 0) {
						resolve(args)
					}
				} catch (ex) {
					reject(ex)
				}
			}
			for (let i = 0; i < args.length; i++) {
				res(i, args[i])
			}
		}))
	}

	/**
	 * MyPromise.race
	 * 它的入参也是一个 Promise 实例数组，然后其 then 注册的回调方法是数组中的某一个 Promise 的状态变为 fulfilled 的时候就执行。
	 * 因为 Promise 的状态只能改变一次，那么我们只需要把 Promise.race 中产生的 Promise 对象的 resolve 方法，注入到数组中的每一个 Promise 实例中的回调函数中即可。
	 * @param {*} arr
	 * @returns
	 */
	this.race = function (values) {
		return new MyPromise(((resolve, reject) => {
			for (let i = 0, len = values.length; i < len; i++) {
				values[i].then(resolve, reject)
			}
		}))
	}

	function handle(callback) {
		if (state === PENDING) {
			callbacks.push(callback)
			return
		}

		const cb = state === FULFULLED ? callback.onFulfilled : callback.onRejected
		const next = state === FULFULLED ? callback.resolve : callback.reject

		if (!cb) {
			next(value)
			return
		}
		let ret;
		try {
			ret = cb(value)
		} catch (e) {
			callback.reject(e)
		}
		callback.resolve(ret);
	}
	function resolve(newValue) {
		const fn = () => {
			if (state !== PENDING) return

			if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
				const { then } = newValue
				if (typeof then === 'function') {
					console.log('isPromise resolve')
					// then 为一个function 说明 newValue 为新产生的 Promise,此时 resolve 为上个 promise 的resolve
					// 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
					then.call(newValue, resolve, reject)
					return
				}
			}
			state = FULFULLED
			value = newValue
			handelCb()
		}

		setTimeout(fn, 0)
	}
	function reject(error) {
		const fn = () => {
			if (state !== PENDING) return

			if (error && (typeof error === 'object' || typeof error === 'function')) {
				const { then } = error
				if (typeof then === 'function') {
					then.call(error, resolve, reject)
					return
				}
			}
			state = REJECTED
			value = error
			handelCb()
		}
		setTimeout(fn, 0)
	}
	function handelCb() {
		while (callbacks.length) {
			const fn = callbacks.shift()
			handle(fn)
		}
	}
	try {
		// 立即执行 Promise 中传入的 fn 函数，将Promise 内部 resolve、reject 函数作为参数传递给 fn ，按事件机制时机处理
		fn(resolve, reject)
	} catch (ex) {
		reject(ex);
	}
}

function test(id) {
	return new MyPromise(((resolve, reject) => {
		setTimeout(() => {
			resolve({ test: id })
		}, 5000)
	}))
}

try {
	new MyPromise((resolve, reject) => {
		setTimeout(() => {
			// resolve(1)
			reject(1)
		}, 0)
	}).then(value => {
		console.log('success', value)
	}, error => {
		console.log('error', error)
	})

	console.log('new promise2')
	new MyPromise((resolve, reject) => {
		console.log('1')
		setTimeout(() => {
			console.log('2')
			// resolve(1)
			reject(1)
		}, 0)
	}).then(value => {
		console.log('success2', value)
	}).catch(error => {
		console.log('error-catch2', error)
	}).finally(v => {
		console.log('finally2', v)
	})
	console.log('new promise success2')

	new MyPromise((resolve, reject) => {
		setTimeout(() => {
			resolve(1)
		}, 0)
	}).then(() => {
		return test(2)
	}).then((value) => {
		console.log('success3', value)
	}).finally(v => {
		console.log('finally3', v)
	})
} catch (error) {
	console.log(error)
}