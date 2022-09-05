import * as path from 'path';
import * as Webpack from 'webpack';

const configurations: Webpack.Configuration[] = [
    {
        entry: './src/index.tsx',
        mode: 'development',
        devtool: 'source-map',
        target: 'node',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js'
        },

        module: {
            rules: [
                {
                    test: /\.[tj]sx?$/,
                    use: [
                        'babel-loader'
                    ]
                }
            ]
        },

        resolve: {
            extensions: ['...', '.ts', '.tsx']
        }
    },
    {
        entry: './src/client/index.tsx',
        mode: 'development',
        devtool: 'source-map',
        target: 'web',
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'bundle.js'
        },

        module: {
            rules: [
                {
                    test: /\.[tj]sx?$/,
                    use: [
                        'babel-loader'
                    ]
                }
            ]
        },

        resolve: {
            extensions: ['...', '.ts', '.tsx']
        }
    }
];

export default configurations;