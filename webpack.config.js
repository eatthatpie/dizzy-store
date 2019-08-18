const path = require('path');

const configBase = {
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            "@": path.resolve(__dirname, './src')
        }
    }
};

module.exports = [
    Object.assign({}, configBase, {
        target: 'node',
        output: {
            filename: 'dizzy-store.esm.js',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, 'dist')
        }
    }),
    Object.assign({}, configBase, {
        output: {
            filename: 'dizzy-store.min.js',
            library: 'DizzyStore',
            libraryTarget: 'var',
            path: path.resolve(__dirname, 'dist')
        }
    })
];