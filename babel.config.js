module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      // NativeWind's CSS interop babel plugin (without worklets - we use Reanimated 3.x)
      require('react-native-css-interop/dist/babel-plugin').default,
      // JSX transform for nativewind
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
          importSource: 'nativewind',
        },
      ],
      // Reanimated MUST be last
      'react-native-reanimated/plugin',
    ],
  };
};
