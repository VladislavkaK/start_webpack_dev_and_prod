// production config
const merge = require('webpack-merge');
const path = require('path');

const commonConfig = require('./webpack.config');

module.exports = merge(commonConfig, {
    mode: 'production',
    entry: {
        app: ['./src/index.tsx'],
        vendor: [
            'axios',
            'babel-polyfill',
            'history',
            'immutable',
            'react',
            'react-dom',
            'react-redux',
            'react-router-dom',
            'react-router-redux',
            'redux',
            'redux-immutable',
            'redux-saga',
        ]
    },
    output: {
        filename: `assets/js/[name].[hash].js`,
        path: path.resolve('dist'),
        chunkFilename: `assets/js/[name].[hash].js`,
        publicPath: '/',
    },
    devtool: 'source-map',
    plugins: [],
});