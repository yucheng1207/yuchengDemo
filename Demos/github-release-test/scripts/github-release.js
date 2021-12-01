const { MESH_ENV, RELEASE_PATH, YML_NAME, BUNDLE_ZIP_NAME } = require("./common");
const pkg = require('../package.json');
const rp = require('request-promise');
const fs = require('fs');
const path = require("path");
const chalk = require("chalk");
const REPO_INTL = 'xxx';
const REPO_PROD = 'xxx';
const REPO_STAGING = 'xxx';
const userAgent = "xxx";
const commonGetRequestOptions = {
	method: 'GET',
	headers: { 'User-Agent': userAgent },
	json: true,
	// resolve Error: connect ECONNREFUSED, see https://github.com/request/request-promise/issues/Release225#issuecomment-379802733
	rejectUnauthorized: false,
	insecure: true,
}
const repoOwner = 'xxx'
const repoToken = 'xxx'

// GitHub Release API: https://developer.github.com/v3/repos/releases/

/**
 * 获取要发布的仓库信息
 * @param {string} env
 */
function getRepoInfo(env) {
	const owner = repoOwner
	const token = repoToken
	const repo = env === MESH_ENV.INTL ? REPO_INTL :
		env === MESH_ENV.PROD ? REPO_PROD : REPO_STAGING

	return { owner, repo, token }
}

/**
 * 获取release列表
 * @param {string} env
 * @param {boolean} withToken // 带上token可以获取到draft为true的release
 */
async function getReleases(env, withToken) {
	const { owner, repo, token } = getRepoInfo(env);
	const requestOptions = Object.assign({
		uri: `https://api.github.com/repos/${owner}/${repo}/releases?access_token=${withToken ? token : ''}`
	}, commonGetRequestOptions);
	const response = await rp(requestOptions);
	return response;
}

/**
 * 获取最新发布的release
 * @param {string} env
 */
async function getLatestRelease(env) {
	try {
		const { owner, repo } = getRepoInfo(env);
		const requestOptions = Object.assign({
			uri: `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
		}, commonGetRequestOptions);
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
 * 通过tag获取已发布的release
 * @param {string} env
 */
async function getReleaseByTagName(env, tag) {
	try {
		const { owner, repo } = getRepoInfo(env);
		const requestOptions = Object.assign({
			uri: `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`,
		}, commonGetRequestOptions);
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
 * 创建release
 * @param {string} env
 * @param {object} opts // https://developer.github.com/v3/repos/releases/#create-a-release
 */
async function createRelease(env, opts) {
	const { owner, repo, token } = getRepoInfo(env);
	const { tag_name, target_commitish, name, body, draft, prerelease } = opts
	if (!tag_name || !target_commitish || !name || draft === undefined || prerelease === undefined) {
		console.log(`${chalk.red('Release creation failed, opts incorrect')}\n`);
		console.log(`${chalk.red(opts)}\n`);
		return;
	}
	const requestOptions = {
		method: 'POST',
		uri: `https://api.github.com/repos/${owner}/${repo}/releases?access_token=${token}`,
		headers: { 'User-Agent': userAgent },
		body: opts,
		json: true,
		// resolve Error: connect ECONNREFUSED, see https://github.com/request/request-promise/issues/Release225#issuecomment-379802733
		rejectUnauthorized: false,
		insecure: true,
	};
	const response = await rp(requestOptions);
	return response;
}

/**
 * 编辑release
 * @param {string} env
 * @param {number} releaseId
 * @param {object} opts // https://developer.github.com/v3/repos/releases/#edit-a-release
 */
async function editRelease(env, releaseId, opts) {
	const { owner, repo, token } = getRepoInfo(env);
	const { tag_name, target_commitish, name, body, draft, prerelease } = opts
	if (!tag_name || !target_commitish || !name || !body || draft === undefined || prerelease === undefined) {
		console.log(`${chalk.red('EditRelease Fail, opts incorrect')}\n`);
		console.log(`${chalk.red(opts)}\n`);
		return;
	}
	const requestOptions = {
		method: 'PATCH',
		uri: `https://api.github.com/repos/${owner}/${repo}/releases/${releaseId}?access_token=${token}`,
		headers: { 'User-Agent': userAgent },
		body: opts,
		json: true,
	};
	const response = await rp(requestOptions);
	return response;
}

/**
 * 删除release
 * @param {string} env
 * @param {number} releaseId
 */
async function deleteRelease(env, releaseId) {
	const { owner, repo, token } = getRepoInfo(env);
	const requestOptions = {
		method: 'DELETE',
		uri: `https://api.github.com/repos/${owner}/${repo}/releases/${releaseId}?access_token=${token}`,
		headers: { 'User-Agent': userAgent },
	};
	const response = await rp(requestOptions);
	return response;
}

/**
 * 获取release的所有的assets
 * @param {string} env
 * @param {number} releaseId
 */
async function getReleaseAssets(env, releaseId) {
	const { owner, repo, token } = getRepoInfo(env);
	const requestOptions = Object.assign({
		uri: `https://api.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets?access_token=${token}`,
	}, commonGetRequestOptions);
	const response = await rp(requestOptions);
	return response;
}

/**
 * 获取指定asset信息
 * @param {string} env
 * @param {number} assetId
 */
async function getSingleReleaseAsset(env, assetId) {
	try {
		const { owner, repo, token } = getRepoInfo(env);
		const requestOptions = Object.assign({
			uri: `https://api.github.com/repos/${owner}/${repo}/releases/assets/${assetId}?access_token=${token}`,
		}, commonGetRequestOptions);
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
 * 删除指定的asset
 * @param {string} env
 * @param {number} assetId
 */
async function deleteReleaseAsset(env, assetId) {
	const { owner, repo, token } = getRepoInfo(env);
	const requestOptions = {
		method: 'DELETE',
		uri: `https://api.github.com/repos/${owner}/${repo}/releases/assets/${assetId}?access_token=${token}`,
		headers: { 'User-Agent': userAgent },
	};
	const response = await rp(requestOptions);
	return response;
}

/**
 * 上传Asset到release
 * @param {string} env
 * @param {number} releaseId
 * @param {string} name		// asset上传完成后的名字
 * @param {Buffer} buffer	// 要上传的asset
 */
async function uploadReleaseAsset(env, releaseId, name, buffer) {
	const { owner, repo, token } = getRepoInfo(env);
	const requestOptions = {
		method: 'POST',
		uri: `https://uploads.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets?access_token=${token}&name=${name}`,
		headers: { 'User-Agent': userAgent, 'Content-Type': 'application/zip' },
		body: buffer,
	};
	const response = await rp(requestOptions);
	return response;
}

/**
 * 删除release中所有的asset
 * @param {string} env
 * @param {number} releaseId
 */
async function deleteAllReleaseAssets(env, releaseId) {
	const assets = await getReleaseAssets(env, releaseId);
	if (assets) {
		for (asset of assets) {
			asset.id && await deleteReleaseAsset(env, asset.id)
		}
	}
}

async function uploadFileToGithub(env, releaseId, path, name) {
	const btf = fs.readFileSync(path);
	rsp = await uploadReleaseAsset(env, releaseId, name, btf);
}

async function releaseToGithub(env, draft, prerelease, description) {
	try {
		const currentVersion = pkg.version;
		const { owner, repo } = getRepoInfo(env)
		console.log(`${chalk.green('Publishing')} ${currentVersion} to Github for ${env} \n`)
		console.log(`${chalk.blue('REPO INFO')} ${owner} ${repo} \n`)

		const latestReleaseRsp = await getLatestRelease(env);
		latestReleaseRsp && console.log(`${chalk.green('Get')} Latest Release success, version: ${latestReleaseRsp.tag_name}, releaseId: ${latestReleaseRsp.id}\n`)

		const releasesRsp = await getReleases(env)
		console.log(`${chalk.green('Get')} Releases success, ${releasesRsp.map((item) => item.tag_name)}\n`)
		const hasPreRelease = releasesRsp.find((item) => !item.draft && item.prerelease && item.tag_name === currentVersion)
		const hasRelease = releasesRsp.find((item) => !item.draft && !item.prerelease && item.tag_name === currentVersion)
		if (hasRelease && hasRelease.id) {
			console.log(`${chalk.red('Error: ')} The release version ${hasPreRelease.tag_name} already exists on the github, please edit online(${hasRelease.html_url}).\n`)
			return;
		}
		if (hasPreRelease && hasPreRelease.id) {
			console.log(`${chalk.yellow('Warning: ')} The pre-release version ${hasPreRelease.tag_name} already exists on the github, delete it.\n`)
			// 删除github上相同版本的pre-release
			console.log(`${chalk.green('Removing')} pre-Release ${hasPreRelease.id}...\n`)
			rsp = await deleteRelease(env, hasPreRelease.id);
		}

		const createRsp = await createRelease(env, {
			tag_name: currentVersion,
			target_commitish: 'master',
			name: currentVersion,
			body: description,
			draft,
			prerelease,
		});
		let version = createRsp.tag_name;
		let releaseId = createRsp.id;
		console.log(`${chalk.green('Created')} release ${version}, releaseId is ${releaseId} \n`)

		if (releaseId) {
			// 删除release所有的asset
			// console.log(`${chalk.green('Removing')} all assets in release ${releaseId}... \n`)
			// await deleteAllReleaseAssets(env, releaseId);
			console.log(`${chalk.green('Uploading')} ${BUNDLE_ZIP_NAME} to github... \n`)
			await uploadFileToGithub(env, releaseId, path.join(RELEASE_PATH, BUNDLE_ZIP_NAME), BUNDLE_ZIP_NAME);
			console.log(`${chalk.green('Uploading')} ${YML_NAME} to github... \n`)
			await uploadFileToGithub(env, releaseId, path.join(RELEASE_PATH, YML_NAME), YML_NAME);
		}
		const releaseHtmlUrl = createRsp && createRsp.html_url
		releaseHtmlUrl && console.log(`${chalk.green('Publish Success')} ${releaseHtmlUrl}`);
	} catch (error) {
		console.log(`${chalk.red("Error when release to Github")}`);
		console.log(`${chalk.red(error.message || error)}`);
		process.exit(1);
	}
}

module.exports = {
	releaseToGithub
};
