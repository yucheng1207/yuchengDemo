const rp = require('request-promise');
const path = require("path");
const chalk = require("chalk");
const ProgressBar = require('./progressBar');
const { MESH_ENV, RELEASE_PATH, YML_NAME, BUNDLE_ZIP_NAME } = require("./common");
const pkg = require('../package.json');
const OSS_BUCKET = 'xxx';
const OSS_BASE_URL = 'xxx';
const OSSManager = require("./ossManager");
const ossManager = new OSSManager(OSS_BUCKET);
const BASE_URL_STAGING = "xxx";
const BASE_URL_PROD = "xxx";
const BASE_URL_INTL = "xxx";
const userAgent = "xxx";
const myAppId = 'xxx';
const myInternalToken = 'xxx';

/**
 * Get require info
 * @param {string} env
 */
function getRequireInfo(env) {
	const baseUrl = env === MESH_ENV.INTL ? BASE_URL_INTL :
		env === MESH_ENV.PROD ? BASE_URL_PROD : BASE_URL_STAGING
	const meshAppId = myAppId
	const meshInternalToken = myInternalToken
	const type = 'Bundle';
	return { baseUrl, meshAppId, meshInternalToken, type }
}

/**
 * Get latest release
 * @param {string} env
 */
async function getLatestRelease(env) {
	try {
		const { baseUrl, meshAppId, type } = getRequireInfo(env)
		const requestOptions = {
			method: 'GET',
			headers: { 'User-Agent': userAgent, 'X-Mesh-App-Id': meshAppId },
			json: true,
			uri: `${baseUrl}/api/release/latest?type=${type}`,
		}
		const response = await rp(requestOptions);
		return response;
	} catch (error) {
		if (error && error.statusCode === 404) {
			return null
		}
		else {
			throw (error)
		}
	}
}


/**
 * Get release by version
 * @param {string} env
 */
async function getReleaseByVersion(env, version) {
	try {
		const { baseUrl, meshAppId, type } = getRequireInfo(env)
		const requestOptions = {
			method: 'GET',
			headers: { 'User-Agent': userAgent, 'X-Mesh-App-Id': meshAppId },
			json: true,
			uri: `${baseUrl}/api/release?version=${version}&type=${type}`,
		}
		const response = await rp(requestOptions);
		return response;
	} catch (error) {
		if (error && error.statusCode === 404) {
			return null
		}
		else {
			throw (error)
		}
	}
}

/**
 * Create release
 * @param {string} env
 */
async function createRelease(env, opts) {
	try {
		const { baseUrl, meshAppId, meshInternalToken, type } = getRequireInfo(env)
		const { version, title, description, release, assets } = opts;
		const requestOptions = {
			method: 'POST',
			headers: { 'User-Agent': userAgent, 'X-Mesh-App-Id': meshAppId, 'X-Mesh-Internal-Token': meshInternalToken },
			uri: `${baseUrl}/api/release`,
			json: true,
			body: {
				version,
				title,
				description,
				release,
				assets,
				type,
			}
		}
		const response = await rp(requestOptions);
		return response;
	} catch (error) {
		throw (error)
	}
}

/**
 * Upload a file to out OSS CDN bucket for desktop resource
 * @param {*} env
 * @param {string} fileName - name of this file on OSS CDN bucket
 * @param {string} filePath - file path locally
 * @param {Function} progress - the progress callback
 */
async function uploadFileToOSS(env, fileName, filePath, onprogress) {
	const version = pkg.version;
	const envPrefix = env === MESH_ENV.PROD ? 'prod' : env === MESH_ENV.INTL ? 'intl-prod' : 'staging';
	const folder = 'meshkit-studio-bundle';
	const ossPath = `${folder}/${envPrefix}/${version}/${fileName}`;
	console.log(`${chalk.green('Uploading')} ${chalk.blue(filePath)} to ${chalk.blue(`${OSS_BASE_URL}/${ossPath}`)} \n\n`);
	await ossManager.uploadFile(ossPath, filePath, onprogress);
	return {
		name: fileName,
		url: `${OSS_BASE_URL}/${ossPath}`
	}
}

async function releaseToOSS(env, release, description) {
	try {
		const version = pkg.version;
		const title = '';
		const latestRelease = await getLatestRelease(env);
		const hasRelease = await getReleaseByVersion(env, version);
		console.log(`Latest Release: ${latestRelease && latestRelease.version}`);

		// Files are uploaded when this version is not released
		if (!hasRelease) {
			const pb1 = new ProgressBar(`${chalk.bold(chalk.blue(BUNDLE_ZIP_NAME))} upload to ali-oss`, 50);
			const bundleAsset = await uploadFileToOSS(env, BUNDLE_ZIP_NAME, path.join(RELEASE_PATH, BUNDLE_ZIP_NAME), (percentage, checkpoint) => {
				const total = checkpoint ? checkpoint.fileSize : 1;

				const completed = (percentage || 1) * total;

				pb1.render({ completed, total });
			});

			const pb2 = new ProgressBar(`${chalk.bold(chalk.blue(YML_NAME))} upload to ali-oss`, 50);
			const ymlAsset = await uploadFileToOSS(env, YML_NAME, path.join(RELEASE_PATH, YML_NAME), (percentage, checkpoint) => {
				const total = checkpoint ? checkpoint.fileSize : 1;

				const completed = (percentage || 1) * total;

				pb2.render({ completed, total });
			});
			const assets = [].concat(bundleAsset, ymlAsset)
			await createRelease(env, { version, title, description, release, assets })
			console.log(`${chalk.green('Publish Success')}`);
		}
		else {
			console.log(`${chalk.red(`Version ${version} has been released.`)}`);
			process.exit(1);
		}
	}
	catch (error) {
		console.log(`${chalk.red("Error when release to OSS")}`);
		console.log(`${chalk.red(error.message || error)}`);
		process.exit(1);
	}
}

module.exports = {
	releaseToOSS
};
