var http = require("http"),
  httpProxy = require("http-proxy"),
  HttpProxyRules = require("http-proxy-rules");

var proxy = httpProxy.createProxy();

const createProxyServer = async (rules) => {
  http
    .createServer(function (req, res) {
      console.log("Rules2", rules);
      const proxyRules = new HttpProxyRules({ rules: rules });
      var target = proxyRules.match(req);
      if (target) {
        return proxy.web(req, res, {
          target: target,
        });
      }

      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(
        "The request url and path did not match any of the listed rules!"
      );
    })
    .listen(process.env.SERVER_PORT, () => {
      console.log("starting proxy");
    });
};

module.exports = {
  createProxyServer,
};
