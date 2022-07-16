// eslint-disable-next-line no-undef
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = {
  '/api': 'https://api.gearfocus.div4.pgtest.co/api',
  '/apiAdmin': 'https://api.gearfocus.div4.pgtest.co/apiAdmin',
};

// eslint-disable-next-line no-undef
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.gearfocus.div4.pgtest.co',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '',
        '^/apiAdmin': '',
      },
      onProxyReq: function (proxyReq, req, res) {
        proxyReq.removeHeader('Origin');
      },
      router,
      logLevel: 'debug',
    }),
  );
};
