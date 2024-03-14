const devCerts = require('office-addin-dev-certs');
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CustomFunctionsPlugin = require("custom-functions-metadata-plugin");
const { merge } = require('webpack-merge');

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return {
    ca: httpsOptions.ca,
    key: httpsOptions.key,
    cert: httpsOptions.cert,
  };
}

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), async (config, { options }) => {
  const isDevelopment = config.mode === 'development';

  // eslint-disable-next-line no-console
  // console.log('WEBPACK OPTIONS', options);

  // eslint-disable-next-line no-console
  // console.log('WEBPACK BASE CONFIG', config);

  const mergedConfig = merge(config, {
    output: {
      scriptType: 'text/javascript',
      // TODO - delete this after moving to single entry point (deployUrl is set in project.json instead)
      publicPath: !isDevelopment ? options.deployUrl : '/',
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'manifest*.xml',
            to: '[name][ext]',
          },
          {
            from: 'staticwebapp.config.json',
            to: 'staticwebapp.config.json',
          },
          {
            from: 'src/functions/functions.json',
            to: 'functions.json',
          },
        ],
      }),
      // TODO - move these separate html files and entrypoints to be routes of react-router in main.tsx
      new HtmlWebpackPlugin({
        filename: 'taskpane.html',
        template: './src/taskpane/taskpane.html',
        chunks: ['taskpane', 'polyfills'],
      }),
      new HtmlWebpackPlugin({
        filename: 'commands.html',
        template: './src/commands/commands.html',
        chunks: ['commands', 'polyfills'],
      }),
      new HtmlWebpackPlugin({
        filename: 'functions.html',
        template: './src/functions/functions.html',
        chunks: ['functions', 'polyfills'],
      }),
      // TODO - use 'yarn nx run generate-custom-functions-metadata' for now before building. Something about the plugin isn't working with webpack.
      // new CustomFunctionsPlugin({ input: `${options.sourceRoot}/functions/functions.ts`, output: 'functions.json'}),
    ],
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
      server: {
        type: 'https',
        options: isDevelopment ? await getHttpsOptions() : {},
      },
      historyApiFallback: {
        rewrites: [
          { from: /^\/taskpane?/, to: '/taskpane.html' },
        ],
      },
      port: 3000,
      proxy: {
        '/dlgw/graphql': {
          target: 'https://ghexcel.int.oncmg.io',
          changeOrigin: true,
          ws: true,
          onProxyReq: proxyReq => {
            proxyReq.setHeader('X-Forwarded-Host', 'ghexcel.int.oncmg.io');
          },
          logLevel: 'debug',
          secure: true,
        },
      },
    },
  });

  // eslint-disable-next-line no-console
  // console.log('WEBPACK MERGED CONFIG', mergedConfig);

  return mergedConfig;
});
