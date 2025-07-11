module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'babel-plugin-module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@/assets': './assets',
            //adicionar outros aliases aqui se precisar
            //ex: '@/assets': './assets'
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
