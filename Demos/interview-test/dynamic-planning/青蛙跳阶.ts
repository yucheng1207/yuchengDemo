// leetcode原题：一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 10 级的台阶总共有多少种跳法。
// dp[n]: 跳上一个 i 级的台阶总共有 dp[i] 种跳法。
// dp[n] = dp[n-1] + dp[n-2]
// dp[0] = 0, dp[1] = 1, dp[2] = 2
function numWays(n: number): number {
	let dp = new Array(n + 1)
	dp[0] = 1
	dp[1] = 1
	// dp[2] = 2
	for (let i = 2; i <= n; i++) {
		dp[i] = (dp[i - 1] + dp[i - 2]) % 1000000007
	}
	return dp[n];
};

function numWays2(n: number): number {
	let a = 1
	let b = 1
	let sum = 0
	for (let i = 2; i <= n; i++) {
		sum = (a + b) % 1000000007
		a = b
		b = sum
	}
	return sum
};


// 时间复杂度 O(N) ： 计算 f(n) 需循环 n 次，每轮循环内计算操作使用 O(1) 。
// 空间复杂度 O(1) ： 几个标志变量使用常数大小的额外空间。

// 1 2 3
// 2 3
// 1 3
