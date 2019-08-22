const VueLoaderPlugin = require("vue-loader/lib/plugin")
const nodeExternals = require("webpack-node-externals")

module.exports = {
	entry: "./app.js",
	watch: true,
	mode: "development",
	devtool: "inline-source-map",
	output: {
		filename: "dashboard.js",
		libraryTarget: "commonjs"
	},
	target: "node",
	externals: [nodeExternals()].concat(["../../dist/build"]),
	plugins: [new VueLoaderPlugin()],
	module: {
		// module.rules is the same as module.loaders in 1.x
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader"
			}
		]
	}
}
