
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, "dist/")

module.exports = (_env, argv) => {
  let entryPoints = {
    VideoComponent: {
      path: "./src/map.js",
      template: "./public/video_component.html",
      outputHtml: "video_component.html",
      build: true
    },
  }

  let entry = {}

  // edit webpack plugins here!
  let plugins = [
    new HtmlWebpackPlugin({
      inject: false,
      template: "./public/config.html",
      filename: "config.html",
      build: true
    })
  ]

  for (name in entryPoints) {
    if (entryPoints[name].build) {
      entry[name] = entryPoints[name].path
      if (argv.mode === 'production') {
        plugins.push(new HtmlWebpackPlugin({
          inject: true,
          chunks: [name],
          template: entryPoints[name].template,
          filename: entryPoints[name].outputHtml
        }))
      }
    }
  }

  let config = {
    entry,
    optimization: {
      minimize: false // neccessary to pass Twitch's review process
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: "file-loader",
          options: {
            name: "img/[name].[ext]"
          }
        }
      ]
    },
    resolve: { extensions: ['*', '.js'] },
    output: {
      filename: "[name].bundle.js",
      path: bundlePath
    },
    plugins
  }
  if (argv.mode === 'development') {
    config.devServer = {
      contentBase: path.join(__dirname, 'public'),
      host: 'localhost',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      port: 8080
    }
  }

  return config;
}