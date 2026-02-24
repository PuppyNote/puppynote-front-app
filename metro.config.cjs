// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Required for NativeWind Metro support
  isCSSEnabled: true,
});

config.watchFolders = [path.resolve(__dirname, 'assets')];
config.resolver.assetExts.push('png');

module.exports = withNativeWind(config, { input: './global.css' });
