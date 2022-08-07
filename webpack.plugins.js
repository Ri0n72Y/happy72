const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpakcPlugin = require('copy-webpack-plugin');

module.exports = [
    new ForkTsCheckerWebpackPlugin(),
    new CopyWebpakcPlugin({
        patterns: [
            // { from: 'src/assets', to: 'assets' }
        ]
    })
];
