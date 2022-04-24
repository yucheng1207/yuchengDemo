/**
 * 序列找数-牛客CBM1-贪心算法
 * https://www.nowcoder.com/practice/a7d1856a72404ea69fdfb5786d65539c?tpId=182&tqId=34572&rp=1&ru=/exam/oj&qru=/exam/oj&sourceUrl=%2Fexam%2Foj%3Ftab%3D%25E5%2590%258D%25E4%25BC%2581%25E7%25AC%2594%25E8%25AF%2595%25E7%259C%259F%25E9%25A2%2598%26topicId%3D182%26page%3D1&difficulty=undefined&judgeStatus=undefined&tags=&title=
 * 描述
 * 从非负整数序列 0, 1, 2, ..., n中给出包含其中n个数的子序列，请找出未出现在该子序列中的那个数。
 * 输入描述：
 * 输入为n+1个非负整数，用空格分开。
 * 其中：首个数字为非负整数序列的最大值n，后面n个数字为子序列中包含的数字。
 * 输出描述：
 * 输出为1个数字，即未出现在子序列中的那个数。
 * 示例1
 * 输入：3 3 0 1
 * 输出：2
 */
function findNum(inputString: string) {
	const arr = inputString.split(' ')
	const max = Number(arr.shift())
	let result = 0
	for (let i = 0; i < max; i++) {
		if (!arr.includes(String(i))) {
			result = i
			break;
		}
	}
	return String(result)
}

// // 可以得出本题是一个0，1，2，3，4，....的一个序列，其中少了一个数字，那么可以得出原本预期的和是sum=0+1+2+3+4+...=(max+0)*(max+1)/2，其中max+1是项数。再算出实际的和，两者之差就是所求的数。
// let arr = readline().split(' ').map(e => +e);
// let max = arr.shift();
// let num = [...arr];

// let oriSum = max * (max + 1) / 2;
// let realSum = 0;
// for (let i = 0; i < num.length; i++) {
// 	realSum += num[i];
// }


// 测试
console.log(findNum('3 3 0 1'))
