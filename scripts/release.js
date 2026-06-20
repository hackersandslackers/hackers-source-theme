const path = require('path');
const fs = require('fs');
const releaseUtils = require('@tryghost/release-utils');
const inquirer = require('inquirer');

const REPO = 'TryGhost/Source';
const REPO_READONLY = 'TryGhost/Source';
const CHANGELOG_PATH = path.join(process.cwd(), '.', 'changelog.md');

(async () => {
    const packageJSON = JSON.parse(fs.readFileSync('./package.json'));
    const newVersion = packageJSON.version;

    if (!newVersion || newVersion === '') {
        console.log(`Invalid version: ${newVersion}`);
        return;
    }

    console.log(`\nCreating release for ${newVersion}...`);

    const githubToken = process.env.GST_TOKEN;

    if (!githubToken) {
        console.log('Please configure your environment with a GitHub token located in GST_TOKEN');
        return;
    }

    const prompt = inquirer.createPromptModule();
    const result = await prompt([{
        type: 'input',
        name: 'compatibleWithGhost',
        message: 'Which version of Ghost is it compatible with?',
        default: '5.67.0',
    }]);

    const compatibleWithGhost = result.compatibleWithGhost;

    const releasesResponse = await releaseUtils.releases.get({
        userAgent: 'Source',
        uri: `https://api.github.com/repos/${REPO_READONLY}/releases`,
    });

    if (!releasesResponse || !releasesResponse.length) {
        console.log('No releases found. Skipping...');
        return;
    }

    let previousVersion = releasesResponse[0].tag_name || releasesResponse[0].name;
    console.log(`Previous version: ${previousVersion}`);

    const changelog = new releaseUtils.Changelog({
        changelogPath: CHANGELOG_PATH,
        folder: path.join(process.cwd(), '.'),
    });

    changelog
        .write({
            githubRepoPath: `https://github.com/${REPO}`,
            lastVersion: previousVersion,
        })
        .sort()
        .clean();

    const newReleaseResponse = await releaseUtils.releases.create({
        draft: true,
        preRelease: false,
        tagName: 'v' + newVersion,
        releaseName: newVersion,
        userAgent: 'Source',
        uri: `https://api.github.com/repos/${REPO}/releases`,
        github: {token: githubToken},
        content: [`**Compatible with Ghost ≥ ${compatibleWithGhost}**\n\n`],
        changelogPath: CHANGELOG_PATH,
    });

    console.log(`\nRelease draft generated: ${newReleaseResponse.releaseUrl}\n`);
})().catch(err => {
    console.error(err);
    process.exit(1);
});
