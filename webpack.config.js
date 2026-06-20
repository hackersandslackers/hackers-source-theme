const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',

    entry: {
        screen: './assets/css/screen.css',
        source: './assets/js/main.js',
        posts: './assets/js/posts.js',
    },

    output: {
        path: path.resolve(__dirname, 'assets/built'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {url: false}},
                    'postcss-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },

    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({filename: '[name].css'}),
    ],

    optimization: {
        minimizer: ['...', new CssMinimizerPlugin()],
    },

    stats: {
        colors: true,
        modules: false,
    },
};
