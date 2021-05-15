var content = { results: [] };
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, Origin, Content-Type, X-Auth-Token',
  'access-control-max-age': 10 // Seconds.
};
var requestHandler = function (request, response) {
  var statusCode = 404;
  var url = request.url;
  var method = request.method;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  if (url === '/classes/messages') {
    if (method === 'GET') {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(content));
    } else if (method === 'POST') {
      request.on('data', (chunk) => {
        var message = JSON.parse((chunk.toString()));
        content.results.push(message);
        console.log('zappy', content.results);
      });
      request.on('end', () => {
        console.log('zippy', content.results);
        statusCode = 201;
        response.writeHead(201, headers);
        response.end(JSON.stringify(content.results));
      });
    }
  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(content));
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;