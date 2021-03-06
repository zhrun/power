/**
 * Created by ouyang on 2018/10/8.
 */
// console.log('process.env.NODE_ENV', process.env.NODE_ENV)
// console.log('process.env.VUE_APP_API', process.env.VUE_APP_API)
// console.log('process.env.VUE_APP_PROJECTNAME', process.env.VUE_APP_PROJECTNAME)
const merge = require("webpack-merge")
const path = require('path')
const resolve = dir => {
    return path.join(__dirname, dir)
}
// vue.config.js
module.exports = {
    // (build)生产环境构建文件的目录 // 'dist/web-test'
    // outputDir: 'dist',
    // outputDir: 'dist/' + ((process.env && process.env.VUE_APP_PROJECTNAME) ? process.env.VUE_APP_PROJECTNAME : 'web'),
    baseUrl: './',
    outputDir: 'dist/web/'+process.env.VUE_APP_PROJECTNAME,
    // (build)放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录  Default: ''
    // dev 模式下不起作用
    assetsDir: 'assets',
    chainWebpack: config => {
        // 移除 prefetch 插件 （首次加载无需一次性全部加载所有的chunk）
        config.plugins.delete('prefetch')
        // async/await自动添加trycatch
        config.module
			.rule('js')
			.use('async-catch-loader')
            .loader('async-catch-loader')
            .tap(options =>
                merge(options, {
                    catchCode: `console.log(e)`,
                })
            )
        config.entry('main').add('babel-polyfill')
        // alias 简化路径
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_com', resolve('src/components'))
            .set('_util', resolve('src/utils'))
            .set('_conf', resolve('src/config'))
            .set('_assets', resolve('src/assets'))
            .set('_api', resolve('src/views/index/api'))
    },
    
    // assetsDir: '',
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
    indexPath: 'index.html',
    filenameHashing: true,
    devServer: {
        contentBase: process.env.VUE_APP_PROJECTNAME,
        host: '0.0.0.0',
        port: 9102,
        hot: true,          // 开启热更新
        overlay: true,      // 开启报错提示显示在浏览器遮罩层
        historyApiFallback: true ,  // 设置vue-router的模式是histroy
        disableHostCheck: true
        /* proxy: {
            '/api': {
                target: '<url>',
                ws: true,
                changeOrigin: true
            },
            '/foo': {
                target: '<other_url>'
            }
        } */
    },
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/assets/css/variable.scss";`
            }
        }
    },
    // multi-page 模式
    // pages: undefined,
    pages: {
        index: {
            // page 的入口
            entry: 'src/views/index/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // ctx设置，用于.html文件中静态资源的引入
            // ctx: (process.env.NODE_ENV === 'production' ? ('/' + process.env.VUE_APP_PROJECTNAME) : './'),
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            // title: 'web test',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: true,
    configureWebpack: {
        externals: { 
            T:'T' ,     
        },
        performance: {
            hints: "warning", // 枚举
            maxAssetSize: 100 * 1000 * 1024, // build时静态文件和入口文件大小设置（字节）
            maxEntrypointSize: 100 * 1000 * 1024, // 整数类型（以字节为单位）
            assetFilter: function (assetFilename) {
                // 提供资源文件名的断言函数
                return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
            }
        }

    },
  
};