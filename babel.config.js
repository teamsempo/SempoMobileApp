// babel.config.js
plugins = [
    ["dynamic-import-node"],
    '@babel/transform-flow-strip-types',
    ['@babel/proposal-class-properties', { "loose": true }],
    '@babel/proposal-object-rest-spread',
    '@babel/transform-runtime'
];
presets = [
    'module:metro-react-native-babel-preset',
];

if (process.env.NODE_ENV === "production") {
    plugins.push("transform-remove-console");
}

module.exports = { presets, plugins, 'sourceMaps': true };