export class TreeNode {
	val: number
	left: TreeNode | null
	right: TreeNode | null
	constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
		this.val = (val === undefined ? 0 : val)
		this.left = (left === undefined ? null : left)
		this.right = (right === undefined ? null : right)
	}
}

// /**
//  * 前序遍历
//  * @param root
//  */
// function preorderTraversal(root: TreeNode | null): number[] {
// 	return []
// };

/**
 * 前序遍历
 * @param root
 */
function inorderTraversal(root: TreeNode | null): number[] {
	console.log('开始中序遍历')
	const res = []

	return res

};


// /**
//  * 动态创建二叉查找树
//  *
//  * @param treeRoot 根节点
//  * @param value    节点的值
//  */
// export function createTree(treeRoot, value) {

// }

// https://juejin.cn/post/6844904154066845703
// 前序遍历核心代码
// var preOrderTraverseNode = (node) => {
//     if(node) {
//         // 先根节点
//         result.push(node.val)
//         // 然后遍历左子树
//         preOrderTraverseNode(node.left)
//         // 再遍历右子树
//         preOrderTraverseNode(node.right)
//     }
// }

// 前序遍历 - 递归
var preorderTraversal = (root) => {
	let result = []
	var preOrderTraverseNode = (node) => {
		if (node) {
			// 先根节点
			result.push(node.val)
			// 然后遍历左子树
			preOrderTraverseNode(node.left)
			// 再遍历右子树
			preOrderTraverseNode(node.right)
		}
	}
	preOrderTraverseNode(root)
	return result
};



// // 前序遍历 - 迭代
// const preorderTraversal2 = (root) => {
// 	const list = [];
// 	const stack = [];

// 	// 当根节点不为空的时候，将根节点入栈
// 	if (root) stack.push(root)
// 	while (stack.length > 0) {
// 		const curNode = stack.pop()
// 		// 第一步的时候，先访问的是根节点
// 		list.push(curNode.val)

// 		// 我们先打印左子树，然后右子树
// 		// 所以先加入栈的是右子树，然后左子树
// 		if (curNode.right !== null) {
// 			stack.push(curNode.right)
// 		}
// 		if (curNode.left !== null) {
// 			stack.push(curNode.left)
// 		}
// 	}
// 	return list
// }

// 空间复杂度：O(n)

// 时间复杂度：O(n)


// leetcode94：二叉树的中序遍历

//  public static void createTree(TreeRoot treeRoot, int value) {


// 	//如果树根为空(第一次访问)，将第一个值作为根节点
// 	if (treeRoot.getTreeRoot() == null) {
// 		TreeNode treeNode = new TreeNode(value);
// 		treeRoot.setTreeRoot(treeNode);

// 	} else  {

// 		//当前树根
// 		TreeNode tempRoot = treeRoot.getTreeRoot();

// 		while (tempRoot != null) {
// 			//当前值大于根值，往右边走
// 			if (value > tempRoot.getValue()) {

// 				//右边没有树根，那就直接插入
// 				if (tempRoot.getRightNode() == null) {
// 					tempRoot.setRightNode(new TreeNode(value));
// 					return ;
// 				} else {
// 					//如果右边有树根，到右边的树根去
// 					tempRoot = tempRoot.getRightNode();
// 				}
// 			} else {
// 				//左没有树根，那就直接插入
// 				if (tempRoot.getLefTreeNode() == null) {
// 					tempRoot.setLefTreeNode(new TreeNode(value));

// 					return;
// 				} else {
// 					//如果左有树根，到左边的树根去
// 					tempRoot = tempRoot.getLefTreeNode();
// 				}
// 			}
// 		}
// 	}
// }

// 作者：Java3y
// 链接：https://juejin.cn/post/6844903582202855438
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

// function quickSort(array) {
// 	let pivot = array[array.length - 1]
// 	let left = array.filter((v, i) => v <= pivot && i != array.length -1)
// 	let right = array.filter(v => v > pivot)
// 	return [...quickSort(left), pivot, ...quickSort(right)]
//   }

//   作者：老姚
//   链接：https://juejin.cn/post/6844903938290876430
//   来源：稀土掘金
//   著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

// 手写算法并记住它：快速排序（最易理解版）https://juejin.cn/post/6844903938915827725

// JavaScript 数据结构与算法之美 - 十大经典排序算法汇总 https://github.com/biaochenxuying/blog/issues/42

// 大O符号（英语：Big O notation），又称为渐进符号，是用于描述函数渐近行为的数学符号。更确切地说，它是用另一个（通常更简单的）函数来描述一个函数数量级的渐近上界。



