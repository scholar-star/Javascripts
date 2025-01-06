var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>WEB - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${body}
        </body>
    </html>
    `
}
var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url,true).query; // query 부분
    var pathname = url.parse(_url, true).pathname; // pathname 부분
    var title = queryData.id;
    console.log(url.parse(_url,true));
    //console.log(queryData.id);
    // if(_url=='/') {
    //     title = 'Welcome';
    // }
    // if(_url == '/favicon.ico') {
    //     return response.writeHead(404);
    //     // header에 404 표시
    // }
    //response.writeHead(200);
    if(pathname=='/') {
        if(queryData.id === undefined) {
            fs.readdir('./public', function(err, filelist) {
                //console.log(filelist);
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = '<ul>';
                var i = 0;
                while(i<filelist.length) {
                    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i += 1;
                }
                list += '</ul>';
                var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                response.writeHead(200);
                response.end(template); // template 문자열로 응답 
            });
        } else {
            fs.readdir('./public', function(err, filelist) {
                var list = '<ul>';
                var i = 0;
                while(i < filelist.length) {
                    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`; // localhost:3000/?id=${filelist[i]}
                    i+=1;
                }
                list +='</ul>';
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                    var title = queryData.id;
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        } 
    } else {
        response.writeHead(404); // 404 error
        response.end('Not Found'); // string 전달
    }
});
app.listen(3000);