const http = require('http');
const httpProxy = require('http-proxy');

let serverAddress = process.argv[2];

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    //console.log(`Received ${req.method} request for ${req.url}`);

    // Log the request object
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        //console.log(`Forwarding request to ${options.target.href}${req.url}`);
        //console.log(`Request headers: ${JSON.stringify(req.headers)}`);
    });

    // Log the response object
    proxy.on('proxyRes', function (proxyRes, req, res) {
        var body = [];
        proxyRes.on('data', function (chunk) {
            body.push(chunk);
        });
        proxyRes.on('end', function () {
            body = Buffer.concat(body).toString();
            if(isJSON(body)){
                console.log(`Response for ${req.url}:`, body);
            }
        });
    });

    // Forward the request to the target server
    proxy.web(req, res, {
        target: serverAddress,
        changeOrigin: true
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}
