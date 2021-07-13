const a = function () {
	console.log('aaa')
}

const b = function () {
	console.log('bbb')
}

exports.a = a

module.exports = {
	b,
}