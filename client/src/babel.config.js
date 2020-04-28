module.exports = function (api) {
  api.cache(true);
  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
    'stage-0',
    '@emotion/babel-preset-css-prop',
    {
      autoLabel: process.env.NODE_ENV !== 'production',
      labelFormat: '[dirname]-[local]'
    }
  ];
  const plugins = [
    'emotion',
    '@babel/plugin-proposal-optional-chaining',
    ['babel-plugin-import', { libraryName: '@material-ui/core', libraryDirectory: 'components', camel2DashComponentName: false }],
  ];
  return { presets, plugins };
};
