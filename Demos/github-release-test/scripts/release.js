const { MESH_ENV, BUILD_PATH, ROOT_PATH } = require("./common");
const pkg = require('../package.json');
const { createZip, createYml } = require("./package");
const { releaseToGithub } = require("./github-release");
const { releaseToOSS } = require("./oss-release")
const path = require("path");
const fs = require("fs");
const minimist = require('minimist');
const chalk = require("chalk");


const argv = minimist(process.argv.slice(2), {
	boolean: [
		// print out `help` message
		"help",
		"publish",
	],
	default: {
		env: MESH_ENV.STAGING,
		help: false,
		publish: false,
	},
	string: [
		"env",		// the building envrionment: should be one of `dev`, `staging` and `production`
		"description",
	],
});

async function main() {
	if (argv.help) {
		printHelp();
	}
	else {
		if (packageJsonCheck()) {
			deploy(argv.env, argv.publish, argv.description)
		}
	}
}

function printHelp() {
	console.log("This is a CLI tool for packaging our electron app, and one could specify the following parameters\n");
	console.log(`${chalk.green("--help")} - prints out this help message\n`);
	console.log(`${chalk.green("--env [env]")} - Indicates the environment we are release for, should be either ${chalk.blue(MESH_ENV.STAGING)} or ${chalk.blue(MESH_ENV.PROD)} or ${chalk.blue(MESH_ENV.INTL)}\n`);
	console.log(`${chalk.green("--description [description]")} - Text description the contents of this release.\n`);
	console.log(`${chalk.green("--publish")} - Whether to upload file to oss\n`);
}

/**
 * 检查package.json
 */
function packageJsonCheck() {
	const appRelease = pkg.appRelease
	if (!pkg.version) {
		console.log(`${chalk.red("Error: version is required in package.json")}`);
		return false;
	}
	if (!appRelease) {
		console.log(`${chalk.red("Error: appRelease is required in package.json")}`);
		return false;
	}
	else if (!(appRelease.appMinVersion && appRelease.appMaxVersion)) {
		console.log(`${chalk.red("Error: appMinVersion and appMaxVersion is required in package.json")}`);
		return false;
	}
	else {
		return true
	}
}

async function deploy(env, publish, desc) {
	try {
		if (!fs.existsSync(BUILD_PATH)) {
			console.log(`${chalk.red("Need to build webviews first")}\n`);
			return;
		} else {
			const appRelease = pkg.appRelease;
			const version = pkg.version;
			const appMinVersion = appRelease.appMinVersion;
			const appMaxVersion = appRelease.appMaxVersion;
			const draft = appRelease.draft !== undefined ? appRelease.draft : false;
			// 默认设置成预发布(pre-release)版本， 后期产品经理补上描述后改为发布版本
			const prerelease = appRelease.prerelease !== undefined ? appRelease.prerelease : true;
			const release = appRelease.release !== undefined ? appRelease.release : false;
			const description = desc || appRelease.description || '';
			console.log(`Supported version of the main process: ${appMinVersion} - ${appMaxVersion}`)
			console.log(`Deploy version:${version} draft:${draft} prerelease: ${prerelease}`);
			console.log(`Deploy version:${version} release:${release}`);
			console.log(`Deploy description: ${description}`)

			const sha512 = await createZip();
			await createYml(sha512, appMinVersion, appMaxVersion);
			if (publish) {
				await releaseToGithub(env, draft, prerelease, description);
				// await releaseToOSS(env, release, description);
			}
		}
	} catch (error) {
		console.log(`${chalk.red("Error when release webview")}`);
		console.log(`${chalk.red(error)}\n`);
		process.exit(1);
	}
}

main();
