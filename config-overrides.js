const { override, fixBabelImports, addDecoratorsLegacy, addLessLoader, addWebpackAlias } = require('customize-cra');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

const path = require('path');

module.exports = override(
  addDecoratorsLegacy(),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src/'),
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { '@primary-color': '#25b864' },
    localIdentName: '[path][name]-[local]',
  }),
  (config, env) => {
    config = rewireReactHotLoader(config, env);
    return config;
  }
);
