/**
 * 最长递增子序列
 * https://leetcode-cn.com/problems/longest-increasing-subsequence/
 */
function upperList(nums: number[]) {
	let n = nums.length
	let dp = [1]
	let res = 1
	if (nums.length == 0) {
		return 0;
	}
	for (let i = 1; i < n; i++)//循环i
	{
		dp[i] = 1;//变量初始
		for (let j = 0; j < i; j++)//遍历i之前的数字
		{
			if (nums[j] < nums[i])//如果i比j对应的数据大
				dp[i] = Math.max(dp[j] + 1, dp[i]);//nums[i]加入大家庭
		}
		res = Math.max(res, dp[i]);//寻找最大值
	}
	return res;//返回结果
}
