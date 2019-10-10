var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
      url = '/views/member.html';
    }
    if(request.url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200/*, {'Content-Type': 'text/html; charset=utf-8'}*/);
    response.end(fs.readFileSync(__dirname + url));
 
});


app.listen(3000);