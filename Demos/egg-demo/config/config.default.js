/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = exports = {};

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1633158668234_7828';

	// add your middleware config here
	config.middleware = [];

	config.sequelize = {
		username: 'root',
		dialect: 'mysql',
		host: '127.0.0.1',
		port: 3306,
		database: 'egg-sequelize-doc-default',
		password: '123456',
	};

	// TODOS: 关掉 csrf (不建议)
	// https://github.com/eggjs/egg/issues/562
	config.security = {
		csrf: {
			enable: false,
		},
	};

	// add your user config here
	const userConfig = {
		// myAppName: 'egg',
	};

	return {
		...config,
		...userConfig,
	};
};
