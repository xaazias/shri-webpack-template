import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatoscopePlugin from '@statoscope/webpack-plugin';

import ModuleLogger from './plugins/moduleLogger';

const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        root: './src/pages/root.tsx',
        root2: './src/pages/root2.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    plugins: [
        new ModuleLogger(),
        new StatoscopePlugin({
            saveStatsTo: 'stats.json',
            saveOnlyStats: false,
            open: false,
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
            buffer: require.resolve('buffer'),
            stream: false,
        },
        alias: {
            'crypto-browserify': path.resolve(__dirname, './src/utils/cryptoAlias'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};

export default config;
