function test(root) {
	const res = []
	const tmp = (root) => {
		if (!root) return
		res.push(root.val)
		tmp(root.left)
		tmp(root.right)
	}
	return tmp(root)
}

function test2(root) {
	const stack = []
	const res = []
	while (root || stack.length) {
		while (root) {
			res.push(root.val)
			stack.push(root)
			root = root.left
		}
		if (stack.length) {
			const cur = stack.pop()
			root = cur.right
		}
	}
}