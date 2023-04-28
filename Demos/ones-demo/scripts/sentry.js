const SentryCli = require('@sentry/cli');
const dotenv = require("dotenv")
dotenv.config()
console.log('SENTRY_INCLUDE', process.env.SENTRY_INCLUDE)
function main() {
    const release = process.env.RELEASE
    const options = {
      release,
      rewrite: true,
      include: process.env.SENTRY_INCLUDE ? [process.env.SENTRY_INCLUDE] : ['./build'], // ['./dest/scripts/'],
      urlPrefix: process.env.SENTRY_URL_PREFIX || `~/static/scripts/js`, // `~/wiki/scripts/`,
      // ignore: ['*.js'],
      validate: true,
    };
    console.log('info:', process.env.SENTRY_URL, process.env.SENTRY_AUTH_TOKEN)
    const sentryCli = new SentryCli(null, {
      url: process.env.SENTRY_URL,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    });
    const sentryCliRelease = sentryCli.releases;

    return sentryCliRelease
      .new(release)
      .then(() => sentryCliRelease.uploadSourceMaps(release, options))
      .then(() => sentryCliRelease.finalize(release))
      // .then(() => callback());
}

main()