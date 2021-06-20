/**
 * Request handlers
 */

// Define the handler
var handlers = {};

// users handler
handlers.users = function (data, callback) {
    var acceptableMethod = ['post', 'get', 'put', 'delete'];

    if (acceptableMethod.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    }
    else {
        callback(405);
    }
}

// Container for the users submethods
handlers._users = {};

// Users - POST
handlers._users.post = function (data, callback) {

}

// Users - GET
handlers._users.get = function (data, callback) {

}

// Users - PUT
handlers._users.put = function (data, callback) {

}

// Users - DELETE
handlers._users.delete = function (data, callback) {

}

// ping handler
handlers.ping = function (data, callback) {
    callback(200);
}

// Not Found handler
handlers.notFound = function (data, callback) {
    callback(404);
}

module.exports = handlers;