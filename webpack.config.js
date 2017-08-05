const path = require("path")
const copyWebpackPlugin = require("copy-webpack-plugin")

const entryDir = path.join(__dirname, "/src/entry")
const nodeModulesDir = path.join(__dirname, "node_modules")

const config = {
    watch: true,
    entry: {
        location: path.join(entryDir, "location.js")
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist/js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: [nodeModulesDir]
            },
            /*{
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                transformToRequire: {img: ""}
                }
            }*/
        ]
    },
    resolve: {
        alias:{'vue$': 'vue/dist/vue.common.js'}
    },
    plugins: [
        new copyWebpackPlugin([
        {from: "./src/imgs", to: "../imgs"},
        {from: "./src/template", to: "../html"},
        {from: "./src/css", to: "../css"}
        ])
    ],
    devServer: {
        host: "0.0.0.0",
        contentBase: "./dist",
        port: 8088,
        colors: true,
        compress: true,
    }
}

module.exports = config