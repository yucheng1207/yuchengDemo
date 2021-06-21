module.exports = {
	reactStrictMode: true,
	i18n: {
		locales: ['zh-CN', 'en-US'],
		defaultLocale: 'zh-CN',
	},
	images: {
		domains: ['mesh-frontend-static.oss-cn-hangzhou.aliyuncs.com'],
		// deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // default
		// imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 700], // default
		deviceSizes: [
			486, 972, 1944, 2916,
			500, 1001, 400, 1501
		],
	}
}
