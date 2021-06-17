/**
 * Primary file for APIs
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');

var config = require('./config');

var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, function () {
    console.log(`The server is running on ${config.httpPort} in ${config.envName} mode`);
});

var httpsServerOption = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOption, function (req, res) {
    unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, function () {
    console.log(`The server is running on ${config.httpsPort} in ${config.envName} mode`);
});

// All the server logic for both http and https server
var unifiedServer = function (req, res) {
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObejct = parsedUrl.query;

    // Get the headers as an object
    var headers = req.headers;

    // Get the http methos
    var method = req.method.toString();

    // Get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    })

    req.on('end', function () {
        buffer += decoder.end();

        // Choose the handler this request goes to
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObejct': queryStringObejct,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // Route the request to the handler specfied in the Router
        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof statusCode == 'number' ? statusCode : 200;

            payload = typeof payload == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log("Returning this response - " + statusCode, payloadString);
        })
    })
}

// Define the handler
var handlers = {};

// ping handler
handlers.ping = function (data, callback) {
    callback(200);
}

// Not Found handler
handlers.notFound = function (data, callback) {
    callback(404);
}

// Define a request router
var router = {
    'ping': handlers.ping
}