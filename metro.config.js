const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adicionar extensões web
config.resolver.platforms = ['ios', 'android', 'web'];

// Melhor handling para assets web
config.resolver.assetExts.push('ttf', 'otf', 'xml', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg');

module.exports = config;
