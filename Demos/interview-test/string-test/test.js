/*
// 输入
{
  a: {
	b: {
	  c: {
		d: {
		  e: 1
		},
		f: 2
	  },
	  g: 3,
	},
	h: 4
  },
  i: 5,
}

// 输出
{
  'a.b.c.d.e': 1,
  'a.b.c.f': 2,
  'a.b.g': 3,
  'a.h': 4,
  'i': 5
}

// 分别实现两个函数，实现两个输入输出互转
*/

function conver(obj, currentkey) {
	const res = {}
	for (key in obj) {
		const path = currentkey ? `${currentkey}.${k}` : k
		if (obj[key] && typeof obj[key] === 'object') {
			const result = conver(obj[key], path)
			res = { ...res, ...result }
		} else {
			res[path] = obj[key]
		}
	}
	return res
}

function str2obj(key, val, res) {
	const tmp = key.split('.')
	if (tmp.length === 1) {
		res[tmp[0]] = val
	} else {
		str2obj(key.substring, val,)
	}
}

function cover2(obj) {
	const res = {}
	for (key in obj) {
		let val = obj[key]
		const ks = key.split('.')
		let tmp = res
		ks.forEach((item, index) => {
			const isLastItem = index === ks.length - 1
			if (isLastItem) {
				tmp[item] = val
			} else {
				if (!tmp[item]) {
					tmp[item] = {}
				}
				tmp = tmp[item]
			}
		})
	}
	return res
}