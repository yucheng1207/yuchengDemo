const PENDING = 'pending' // 等待态 Pending
const RESOLVED = 'resolved' // 执行态 Fulfilled
const REJECTED = 'rejected' // 拒绝态 Rejected

/**
 * 基于 PromiseA+ 规范的 Promise 模型
 * [【翻译】Promises/A+规范](https://www.ituring.com.cn/article/66566)
 * @param {*} fn
 */
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
		// 对于 resolve 函数来说，首先需要判断传入的值是否为 Promise 类型
		if (value instanceof MyPromise) {
			return value.then(resolve, reject)
		}
		// 使用setTimeout保证执行顺序
		setTimeout(() => {
			if (that.state === PENDING) {
				console.log('resolve:', value, 'resolvedCallbacks len:', that.resolvedCallbacks.length)
				that.state = RESOLVED
				that.value = value
				that.resolvedCallbacks.map(cb => cb(that.value))
			}
		}, 0)
	}

	/**
	 * reject函数
	 * @param {*} value
	 */
	function reject(value) {
		setTimeout(() => {
			if (that.state === PENDING) {
				console.log('reject', value)
				that.state = REJECTED
				that.value = value
				that.rejectedCallbacks.map(cb => cb(that.value))
			}
		}, 0)
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

/**
 * 兼容多种 Promise 的 resolutionProcedure 函数
 * @param {*} promise2 - 新的promise
 * @param {*} x - 终值
 * @param {*} resolve
 * @param {*} reject
 * @returns
 */
function resolutionProcedure(promise2, x, resolve, reject) {
	// 规范规定了 x 不能与 promise2 相等，这样会发生循环引用的问题
	// 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
	if (promise2 === x) {
		return reject(new TypeError('Error'))
	}
	// 如果 x 为 Promise ，则使 promise 接受 x 的状态:
	// 1. 如果 x 处于等待态，Promise 需保持为等待态直至 x 被执行或拒绝
	// 2. 如果 x 处于执行态，用相同的值执行 promise
	// 3. 如果 x 处于拒绝态，用相同的据因拒绝 promise
	// 当然以上这些是规范需要我们判断的情况，实际上我们不判断状态也是可行的。
	if (x instanceof MyPromise) {
		console.log('isPromise')
		x.then(function (value) {
			resolutionProcedure(promise2, value, resolve, reject)
		}, reject)
		return
	}
	/**
	 * 接下来我们继续按照规范来实现"x 为对象或函数"的代码:
	 * - 首先创建一个变量 `called` 用于判断是否已经调用过函数
	 * - 然后判断 `x` 是否为对象或者函数，如果都不是的话，将 `x` 传入 `resolve` 中
	 * - 如果 `x` 是对象或者函数的话，先把 `x.then` 赋值给 `then`，然后判断 `then` 的类型，如果不是函数类型的话，就将 `x` 传入 `resolve` 中
	 * - 如果 `then` 是函数类型的话，就将 `x` 作为函数的作用域 `this` 调用之，并且传递两个回调函数作为参数，第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`，两个回调函数都需要判断是否已经执行过函数，然后进行相应的逻辑
	 * - 以上代码在执行的过程中如果抛错了，将错误传入 `reject` 函数中
	 */
	let called = false
	if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
		try {
			let then = x.then
			if (typeof then === 'function') {
				console.log('isThenable')
				then.call(
					x,
					y => {
						// resolvePromise
						if (called) return
						called = true
						resolutionProcedure(promise2, y, resolve, reject)
					},
					e => {
						// rejectPromise
						if (called) return
						called = true
						reject(e)
					}
				)
			} else {
				resolve(x)
			}
		} catch (e) {
			if (called) return
			called = true
			reject(e)
		}
	} else {
		resolve(x)
	}
}

/**
 * Then方法
 * 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因。
 * then 方法必须返回一个 promise 对象
 * onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值）
 * then 方法可以被同一个 promise 调用多次，then 方法必须返回一个 promise 对象
 * 	- 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
 * 	- 当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调
 *
 * 注意：不论 promise1 被 reject 还是被 resolve 时 promise2 都会被 resolve，只有出现异常时才会被 rejected。
 * @param {*} onFulfilled 可选，如果 onFulfilled 不是函数，其必须被忽略
 * @param {*} onRejected 可选，如果 onRejected 不是函数，其必须被忽略
 * @returns
 */
MyPromise.prototype.then = function (onFulfilled, onRejected) {
	const that = this
	console.log('then', that.state)
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
	onRejected = typeof onRejected === 'function' ? onRejected : r => {
		throw r
	}
	if (that.state === PENDING) {
		// 每个 then 函数都需要返回一个新的 Promise 对象，该变量用于保存新的返回对象
		return (promise2 = new MyPromise((resolve, reject) => {
			that.resolvedCallbacks.push(() => {
				try {
					const x = onFulfilled(that.value) // onFulfilled第一个参数为 promise 的终值
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			})

			that.rejectedCallbacks.push(() => {
				try {
					const x = onRejected(that.value) // onRejected第一个参数为 promise 的据因
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			})
		}))
	}
	if (that.state === RESOLVED) {
		// 这段代码和判断等待态的逻辑基本一致，无非是传入的函数的函数体需要异步执行，这也是规范规定的
		return (promise2 = new MyPromise((resolve, reject) => {
			setTimeout(() => {
				try {
					const x = onFulfilled(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (reason) {
					reject(reason)
				}
			})
		}))
	}
	if (that.state === REJECTED) {
		return (promise2 = new MyPromise((resolve, reject) => {
			setTimeout(() => {
				try {
					const x = onRejected(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (reason) {
					reject(reason)
				}
			})
		}))
	}
	// if (that.state === REJECTED) {
	// 	onRejected(that.value)
	// }
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
		return value
	}, error => {
		console.log('error', error)
		return 999
	}).then(value => {
		console.log('success2', value)
		return test(value ? ++value : 99)
	}).then(value => {
		console.log('success3', value)
		return value.test ? value.test + 1 : 0
	}).then(value => {
		console.log('success4', value)
	})
} catch (error) {
	console.log(error)
}




// 简易版手写promise
// const PENDING = 'pending'
// const RESOLVED = 'resolved'
// const REJECTED = 'rejected'

// function MyPromise(fn) {
// 	const that = this // 码可能会异步执行，用于获取正确的 this 对象
// 	that.state = PENDING
// 	that.value = null // 用于保存 resolve 或者 reject 中传入的值
// 	that.resolvedCallbacks = [] // 用于保存 then 中的回调，因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用
// 	that.rejectedCallbacks = []

// 	/**
// 	 * resolve函数
// 	 * @param {*} value
// 	 */
// 	function resolve(value) {
// 		if (that.state === PENDING) {
// 			that.state = RESOLVED
// 			that.value = value
// 			that.resolvedCallbacks.map(cb => cb(that.value))
// 		}
// 	}

// 	/**
// 	 * reject函数
// 	 * @param {*} value
// 	 */
// 	function reject(value) {
// 		if (that.state === PENDING) {
// 			that.state = REJECTED
// 			that.value = value
// 			that.rejectedCallbacks.map(cb => cb(that.value))
// 		}
// 	}

// 	/**
// 	 * 执行 Promise 中传入的函数
// 	 */
// 	try {
// 		fn(resolve, reject)
// 	} catch (e) {
// 		reject(e)
// 	}
// }

// MyPromise.prototype.then = function (onFulfilled, onRejected) {
// 	const that = this
// 	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
// 	onRejected = typeof onRejected === 'function' ? onRejected : r => {
// 		throw r
// 	}
// 	if (that.state === PENDING) {
// 		that.resolvedCallbacks.push(onFulfilled)
// 		that.rejectedCallbacks.push(onRejected)
// 	}
// 	if (that.state === RESOLVED) {
// 		onFulfilled(that.value)
// 	}
// 	if (that.state === REJECTED) {
// 		onRejected(that.value)
// 	}
// }

// new MyPromise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve(1)
// 	}, 0)
// }).then(value => {
// 	console.log(value)
// })