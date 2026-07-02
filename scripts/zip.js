const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const {name} = require('../package.json');
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const outputPath = path.join(distDir, `${name}.zip`);

const ignored = [
    'node_modules/**',
    'dist/**',
    '.git/**',
    'scripts/**',
    'pnpm-debug.log',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'AGENTS.md',
    'CLAUDE.md',
    'webpack.config.js',
    'postcss.config.js',
    'babel.config.js',
];

fs.mkdirSync(distDir, {recursive: true});

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {zlib: {level: 9}});

output.on('close', () => {
    const kb = (archive.pointer() / 1024).toFixed(1);
    console.log(`Created ${outputPath} (${kb} KB)`);
});

archive.on('error', err => {
    throw err;
});

archive.pipe(output);
archive.glob('**', {cwd: root, ignore: ignored});
archive.finalize();
