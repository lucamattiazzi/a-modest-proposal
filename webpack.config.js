const { buildWebpackConfig } = require('webpack-preset-accurapp')

function mdLoader() {
  return (context, { addLoader }) =>
    addLoader({
      test: /\.md$/i,
      loader: 'raw-loader',
    })
}

module.exports = buildWebpackConfig([mdLoader()])
