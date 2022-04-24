import { TreeNode } from './创建二叉树';

/**
 * 层序遍历
 * @param root
 * @returns
 */
function levelOrder(root: TreeNode | null): number[][] {
	if (root === null) return []
	const res = []
	const queue = []
	queue.push({
		node: root,
		level: 0
	})
	while (queue.length) {
		const curData = queue.shift()
		if (res[curData.level]) {
			res[curData.level].push(curData.node.val)
		} else {
			res[curData.level] = [curData.node.val]
		}

		if (curData.node.left) {
			queue.push({
				node: curData.node.left,
				level: curData.level + 1
			})
		}
		if (curData.node.right) {
			queue.push({
				node: curData.node.right,
				level: curData.level + 1
			})
		}
	}
	return res
};

/**
 * 层序遍历二叉树
 * https://leetcode-cn.com/problems/n-ary-tree-level-order-traversal/solution/n-cha-shu-de-ceng-xu-bian-li-by-leetcode-lxdr/
 */
function levelOrder2(root: TreeNode | null): number[][] {
	if (!root) {
		return [];
	}

	const ans = [];
	const queue = [root];

	while (queue.length) {
		const cnt = queue.length;
		const level = [];
		for (let i = 0; i < cnt; ++i) {
			const cur = queue.shift();
			level.push(cur.val);
			if (cur.left) {
				queue.push(cur.left)
			}
			if (cur.right) {
				queue.push(cur.right)
			}
		}
		ans.push(level);
	}

	return ans;
};

/**
 * 层序遍历多叉树
 * https://leetcode-cn.com/problems/n-ary-tree-level-order-traversal/solution/n-cha-shu-de-ceng-xu-bian-li-by-leetcode-lxdr/
 */
var levelOrderN = function (root) {
	if (!root) {
		return [];
	}

	const ans = [];
	const queue = [root];

	while (queue.length) {
		const cnt = queue.length;
		const level = [];
		for (let i = 0; i < cnt; ++i) {
			const cur = queue.shift();
			level.push(cur.val);
			for (const child of cur.children) {
				queue.push(child);
			}
		}
		ans.push(level);
	}

	return ans;
};
