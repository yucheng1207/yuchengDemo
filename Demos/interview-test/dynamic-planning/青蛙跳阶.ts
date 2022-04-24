// leetcode原题：一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 10 级的台阶总共有多少种跳法。
// dp[n]: 跳上一个 i 级的台阶总共有 dp[i] 种跳法。
// dp[n] = dp[n-1] + dp[n-2]
// dp[0] = 0, dp[1] = 1, dp[2] = 2
function frogCnt(n) {
	if (n <= n) {
		return n
	} else {
		let dp = [1, 2]
		for (let i = 3; i < n; i++) {
			dp[i] = dp[i - 1] + dp[i - 2]
		}
		return dp[n]
	}
}


