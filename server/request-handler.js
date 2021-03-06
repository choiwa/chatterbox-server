/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var storage = require('./log');
let messages = storage.messages;

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  // console.log(request);
  // console.log(response);

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  console.log(request.method);

  
  const { headers, method, url } = request;
  let body = messages;

  // The outgoing status.
  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 404;
  })
 
  if(request.method === 'GET') {
    //respond with saved data.
    
    response.statusCode = 200;
    headers['Content-Type'] = 'text/plain';
    let results = body;
    const responseBody = { headers, method, url, body, results };
    console.log('Response sent: ', responseBody);
    response.write(JSON.stringify(responseBody));
    response.end();

    //TODO
    //1. How to send the data, string?
      //Read our file, respond.
    //2. How to we render data 
    //3. How does the URL affect the data seen by the client.
    // response.write(messages);
  } else if (request.method === 'POST' && request.url ==='/classes/messages') {
    //1. How do we save the new data
    request.on('data', (message) => {
      body.push(message);
      console.log('Message object stored: ', messsage);
      storage.messages.push(message);
    }).on('end', () => {
      response.end(() => body = Buffer.concat(body).toString());
      response.on('error', (err) => {
        console.error(err);
      });

    })
    response.write(JSON.stringify(responseBody));
    response.end();
  }

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  //Did above in GET resuest
  // response.writeHead(statusCode, headers);
  
  // if(request.url ==)

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
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
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;
