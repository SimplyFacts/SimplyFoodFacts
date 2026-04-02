module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { unstable_transformImportMeta: true }]],
    plugins: [
      ['module-resolver', {
        alias: { '@': './src' },
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
        resolvePath(sourcePath, currentFile, opts) {
          if (sourcePath.includes('expo-router') || sourcePath.includes('ExpoRouter')) {
            return null;
          }
          return undefined;
        }
      }],
    ],
  };
};
