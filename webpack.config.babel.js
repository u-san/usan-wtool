import webpack from 'webpack'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import OfflinePlugin from 'offline-plugin'
import { exec } from 'shelljs'
import path from 'path'
import pxtorem from 'postcss-pxtorem'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

const ENV = process.env.NODE_ENV || 'development'
const isProd = ENV ==='production'
const plugins = []

if (isProd) {
	exec(`rm -rf ${path.join(__dirname, './dist/css')} ${path.join(__dirname, './dist/js')}`)
	if (process.env.npm_config_report) {
		const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
		plugins.push(new BundleAnalyzerPlugin())
	}
}
console.log(ENV)
const postcssOpts = {
	ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
	plugins: () => [
		autoprefixer({
			browsers: ['last 2 versions', 'iOS >= 8', 'Android >= 4']
		}),
		pxtorem({ rootValue: 75, propWhiteList: [] })
	]
}

module.exports = {
	context: path.resolve(__dirname, "src"),
	entry: './index.js',

	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: '/',
		filename: isProd ? 'js/[name]_[chunkhash:5].js' : 'js/[name].js'
	},

	resolve: {
		extensions: ['.jsx', '.js', '.json', '.less'],
		modules: [
			path.resolve(__dirname, "src/lib"),
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		],
		alias: {
			'~': path.resolve(__dirname, "src"),
			'@': path.resolve(__dirname, "src/components"),
			style: path.resolve(__dirname, "src/style"),
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: path.resolve(__dirname, 'src'),
				enforce: 'pre',
				use: 'source-map-loader'
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.(less|css)$/,
				include: [path.resolve(__dirname, 'src')],
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { modules: true, importLoaders: 1, minimize: isProd }
					},
					{
						loader: `postcss-loader`,
						options: postcssOpts
					},
					{
						loader: 'less-loader'
					}
				]
			},
			{
				test: /\.(less|css)$/,
				exclude: [path.resolve(__dirname, 'src')],
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { importLoaders: 1, minimize: isProd }
					},
					{
						loader: `postcss-loader`,
						options: postcssOpts
					},
					{
						loader: 'less-loader'
					}
				]
			},

			{
				test: /\.json$/,
				use: 'json-loader'
			},
			{
				test: /\.(xml|html|txt|md)$/,
				use: 'raw-loader'
			},
			{
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				use: ENV==='production' ? 'file-loader' : 'url-loader'
			}
		]
	},
	optimization: {
		minimize: isProd,
		splitChunks: {
			chunks: 'all'
		}
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new MiniCssExtractPlugin({
			filename: isProd ? 'css/[name]_[chunkhash:5].css' : 'css/[name].css',
			chunkFilename: isProd ? 'css/[id]_[chunkhash:5].css' : 'css/[id].css',
			allChunks: true
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(ENV)
		}),
		new HtmlWebpackPlugin({
			template: './index.ejs',
			minify: { collapseWhitespace: isProd }
		}),
		new CopyWebpackPlugin([
			{ from: './manifest.json', to: './' },
			{ from: './favicon.ico', to: './' }
		])
	].concat(plugins, isProd ? [
		new OfflinePlugin({
			relativePaths: false,
			AppCache: false,
			excludes: ['_redirects'],
			ServiceWorker: {
				events: true
			},
			cacheMaps: [
				{
					match: /.*/,
					to: '/',
					requestTypes: ['navigate']
				}
			],
			publicPath: '/'
		})
	] : []),

	stats: { colors: true },

	node: {
		global: true,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	},

	devtool: 'eval',

	devServer: {
		port: process.env.PORT || 8080,
		host: 'localhost',
		publicPath: '/',
		contentBase: './src',
		historyApiFallback: true,
		open: true,
		openPage: '',
		proxy: {
			// OPTIONAL: proxy configuration:
			// '/optional-prefix/**': { // path pattern to rewrite
			//   target: 'http://target-host.com',
			//   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
			// }
		}
	}
}
