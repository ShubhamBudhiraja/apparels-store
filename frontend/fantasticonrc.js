module.exports = {
    inputDir: './src/icons',
    outputDir: './public/fonts',
    fontTypes: ['ttf', 'woff', 'woff2', 'svg', 'eot'],
    assetTypes: ['ts', 'css'],
    pathOptions: {
        css: 'styles/icons.scss',
    },
    normalize: true,
    descent: 45,
    fontsUrl: '../public/fonts',
};