const path = require("path");
const ROOT_PATH = path.join(__dirname, '..');
const BUILD_PATH = path.join(ROOT_PATH, "bundle");
const RELEASE_PATH = path.join(ROOT_PATH, "dist");
const BUNDLE_ZIP_NAME = 'dist.zip';
const YML_NAME = 'latest.yml';
const MESH_ENV = {
	STAGING: 'staging',
	PROD: 'production',
	INTL: 'international'
}

module.exports = {
	ROOT_PATH,
	BUILD_PATH,
	RELEASE_PATH,
	BUNDLE_ZIP_NAME,
	YML_NAME,
	MESH_ENV
};
