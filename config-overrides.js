const { override, fixBabelImports, addWebpackResolve, addWebpackPlugin, addWebpackAlias } = require('customize-cra');
const webpack = require("webpack")
const addLessLoader = require("customize-cra-less-loader");


module.exports = override(
    // Load antd
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    // Add `javascriptEnabled` and antd theme configuration
    // to the Less loader
    addLessLoader({
        lessLoaderOptions: {
            lessOptions: {
                javascriptEnabled: true,
                modifyVars: { '@primary-color': '#1DA57A' },
            }
        }
    }),

    addWebpackResolve({
        fallback: {
            'fs': false,
            "path": require.resolve("path-browserify"),
            'stream': require.resolve('stream-browserify'),
            'buffer': require.resolve('buffer/'),
            'util': require.resolve('util/'),
            'assert': require.resolve('assert/'),
            'http': require.resolve('stream-http/'),
            'url': require.resolve('url/'),
            'https': require.resolve('https-browserify/'),
            'os': require.resolve('os-browserify/'),
            'crypto': require.resolve('crypto-browserify'),
        },
    }),
    addWebpackPlugin(new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
    })),

    addWebpackPlugin(new webpack.ProvidePlugin({
        process: "process/browser",
    })),

    addWebpackAlias({
        "buffer": "buffer",
        "stream": "stream-browserify",
        '@': 'resources/js',
    })
)
