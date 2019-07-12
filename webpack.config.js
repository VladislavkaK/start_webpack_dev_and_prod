const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let typeScriptLoaders = [];

typeScriptLoaders.push('babel-loader');

typeScriptLoaders.push(
    {
        loader: 'awesome-typescript-loader',
        query: {
            configFileName: 'tsconfig.json',
            silent: true
        }
    },
    {
        loader: 'tslint-loader',
        query: {
            configFile: 'tslintconfig.json'
        },
    }
);

const styleLoaders = ExtractTextWebpackPlugin.extract({
    use: [
        {
            loader: 'css-loader',
            options: {
                minimize: true,
            }
        },
        {
            loader: 'sass-loader',
            options: {
                includePaths: ['./src'],
                minimize: true,
            }
        }
    ],
});

const fontLoaders = [{
    loader: 'file-loader',
    options: {
        name: 'assets/fonts/[name].[ext]?[hash]',
    },
}];

const imageLoaders = [{
    loader: 'file-loader',
    options: {
        name: 'assets/images/[name].[ext]?[hash]',
    },
}];

imageLoaders.push('image-webpack-loader');

module.exports = {
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        modules: [
            'src',
            'node_modules'
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
                // exclude: /node_modules/,
                // loaders: typeScriptLoaders,
            },
            {
                test: /\.scss$/,
                loader: styleLoaders,
            },
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                  // "url" loader works like "file" loader except that it embeds assets
                  // smaller than specified limit in bytes as data URLs to avoid requests.
                  // A missing `test` is equivalent to a match.
                  {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                    loader: require.resolve('url-loader'),
                    options: {
                      limit: 10000,
                      name: 'assets/images/[name].[ext]?[hash]',
                    },
                  },
                   //for svg
                   {
                    test: /\.svg/,
                    use: {
                        loader: 'svg-url-loader',
                        options: {}
                    }
                  },
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: fontLoaders,
            }, 
        ]
    },

    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            title: "Документация Frontend",
            inject: true,
            mobile: true,
            unsupportedBrowser: false,
            links: [],
            scripts: [],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new ExtractTextWebpackPlugin({
            filename: `assets/styles/style.bundle.css`,
            allChunks: true,
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebookincubator/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
              },
              mangle: {
                safari10: true,
              },
              output: {
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebookincubator/create-react-app/issues/2488
                ascii_only: true,
              },
              // sourceMap: shouldUseSourceMap,
            }
            
          
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
    ]
};