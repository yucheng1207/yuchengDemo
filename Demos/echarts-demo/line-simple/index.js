const dom = document.getElementById('container');
const myChart = echarts.init(dom);
const app = {};

const option = {
	title: {
		text: '2001-2021年乌镇游客数量变化曲线',
		textAlign: 'left',
		x: 'center',
		y: 'top',
	},
	xAxis: {
		name: '年份',
		type: 'category',
		boundaryGap: false,
		data: [...Array(21)].map((item, index) => index + 2001),
	},
	yAxis: {
		name: '游客数量/万人次',
		type: 'value',
		interval: 50,
	},
	series: [
		{
			data: [288, 215, 260, 304.57, 370.1, 402, 451.1, 498.6, 607.3, 531.69, 525.63, 585.86, 569, 692.35, 685.35, 758.96, 868.23, 806.82, 817.9, 266.04, 331.54],
			type: 'line',
		},
	],
};

if (option && typeof option === 'object') {
	myChart.setOption(option);
}