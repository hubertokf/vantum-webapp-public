const path = require('path')

module.exports = {
  // outputDir: '../backend/assets',

  css: {
    extract: false,
  },


  pwa: {
    name: 'Vantum',
    themeColor: '#006746',
    msTileColor: '#006746',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    iconPaths: {
      favicon32: './src/assets/icons/favicon-32x32.png',
      favicon16: './src/assets/icons/favicon-16x16.png',
      appleTouchIcon: './src/assets/icons/apple-touch-icon.png',
      maskIcon: './src/assets/icons/safari-pinned-tab.svg',
      msTileImage: './src/assets/icons/mstile-150x150.png',
    },
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'public/service-worker.js',
      // ...other Workbox options...
    },
  },

  // css: {
  // 	loaderOptions: {
  // 		postcss: {
  // 			options: { plugins: 'postcss-loader'}
  // 		},
  // 	},
  // },

  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:1337/api',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // }
  devServer: {
    proxy: 'http://127.0.0.1:1337'
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        './src/assets/sass/variables.scss'
      ]
    },
  }
}