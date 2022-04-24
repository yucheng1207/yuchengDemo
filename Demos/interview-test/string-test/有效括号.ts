/**
 * 有效括号-LeetCode20
 * https://leetcode-cn.com/problems/valid-parentheses/
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
 * 有效字符串需满足：
 * 左括号必须用相同类型的右括号闭合。
 * 左括号必须以正确的顺序闭合。
 */
var isValid = function (s: string) {
	// 创建一个空数组 用于存放字符
	let resArr = []
	// 如果字符串的长度是奇数 表明不可能是成对的有效括号 直接返回false
	if (s.length % 2) return false
	// for of 对字符串进行循环 依次将元素添加到数组
	for (let item of s) {
		// switch 循环， 以此将元素推入数组 栈存储
		switch (item) {
			// '(' '{' '[' 共享 代码块 resArr.push(item)
			case '(':
			case '{':
			case '[':
				resArr.push(item)
				break
			// 当循环到 ')' 时， 判断数组的最后一个元素是不是 '(' 以此来决定是否是成对出现 避免出现([(])这种情况
			case ')':
				if (resArr.pop() !== '(') return false
				break
			case '}':
				if (resArr.pop() !== '{') return false
				break
			case ']':
				if (resArr.pop() !== '[') return false
				break
		}
	}
	// 最后 如果数组还有长度 说明是false。如果最后数组清空 说明是正确排序并且成对出现
	return !resArr.length
};

// 复杂度分析
// 时间复杂度：O(N)。遍历了一遍字符串。
// 空间复杂度：O(N)。最坏情况下，假如输入是 (((((((，栈的大小将是输入字符串的长度。


function isValid1(s: string): boolean {
	let stack = []
	let stringMap = {
		')': '(',
		'}': '{',
		']': '[',
	}
	for (let item of s) {
		switch (item) {
			case '(':
			case '{':
			case '[':
				stack.push(item)
				break
			case ')':
			case '}':
			case ']':
				const lastItem = stack.pop()
				if (stringMap[item] !== lastItem) {
					return false
				}
				break;
		}
	}
	return !stack.length
};


// 测试
console.log('()[]{}:', isValid('()[]{}'))
console.log('([)]:', isValid("([)]"))
