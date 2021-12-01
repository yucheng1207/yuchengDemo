const {
	ROOT_PATH,
	BUILD_PATH,
	RELEASE_PATH,
	BUNDLE_ZIP_NAME,
	YML_NAME
} = require("./common");
const pkg = require('../package.json');
const path = require("path");
const fs = require("fs");
const admZip = require('adm-zip');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const chalk = require("chalk");
const jsSha512 = require('js-sha512');
const yaml = require('js-yaml');

async function createZip()
{
	if (!fs.existsSync(RELEASE_PATH))
	{
		console.log(`${chalk.green('Creating')} ${RELEASE_PATH}... \n`)
		await mkdirp(RELEASE_PATH);
	}

	const inPath = path.join(BUILD_PATH)
	const outPath = path.join(RELEASE_PATH, BUNDLE_ZIP_NAME);

	console.log(`${chalk.green('Creating')} ${BUNDLE_ZIP_NAME}... \n`)
	// remove older one and zip a new one
	rimraf.sync(outPath);
	//  https://github.com/cthackers/adm-zip/wiki/ADM-ZIP#a16
	const zip = new admZip();
	zip.addLocalFolder(inPath);
	zip.writeZip(outPath);
	const buf = zip.toBuffer();
	const sha512 = jsSha512.sha512(buf);
	console.log(`sha512: ${sha512}\n`)

	return sha512;
}

async function createYml(sha512, appMinVersion, appMaxVersion)
{
	if (sha512 && pkg.version && appMinVersion && appMaxVersion)
	{
		console.log(`${chalk.green('Creating')} ${YML_NAME}... \n`)
		const ymlPath = path.join(RELEASE_PATH, YML_NAME);;
		rimraf.sync(ymlPath);
		const y = {
			version: pkg.version,		// 当前渲染进程版本号
			appMinVersion,				// 兼容主进程的最小版本号
			appMaxVersion,				// 兼容主进程的最大版本号
			sha512: sha512.toString(),	// bundle.zip sha512
			releaseDate: new Date().getTime().toString(),
		}
		fs.writeFileSync(
			ymlPath,
			yaml.safeDump(y),
			'utf8',
		);
	}
	else
	{
		console.log(`${chalk.red("Error when create yml")}`);
		console.log('sha512 is', sha512)
		console.log('render Version is', pkg.version)
		console.log('appMinVersion is', appMinVersion)
		console.log('appMaxVersion is', appMaxVersion)
		process.exit(1);
	}
}

module.exports = {
	createZip,
	createYml,
};
