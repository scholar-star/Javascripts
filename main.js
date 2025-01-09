var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); // querystring module

const path = require('path');

function templateList(filelist) {
    var list = '<ul>';
    var i = 0;
    while(i<filelist.length) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i += 1;
    }
    list += '</ul>';
    return list;
}

function templateHTML(title, list, body, control) {
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
            ${control}
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
    if(pathname==='/') {
        if(queryData.id === undefined) {
            fs.readdir('./data', function(err, filelist) {
                //console.log(filelist);
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = templateList(filelist);
                var template = templateHTML(title, list, 
                    `<h2>${title}</h2><p>${description}</p>`,
                `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template); // template 문자열로 응답 
            });
        } else {
            fs.readdir('./data', function(err, filelist) {
                fs.readFile(`./data/${queryData.id}`, 'utf8', function(err, description) {
                    // 이곳에서 페이지를 개략적으로 만든 상태에서 redirection.
                    var title = queryData.id;
                    var list = templateList(filelist);
                    var template = templateHTML(title, list, `
                        <h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        } 
    } else if(pathname==="/create") { // localhost:3000/create
        fs.readdir('./data',function(error, filelist) {
            var title = "Welcome";
            var list = templateList(filelist); // placeholder : 입력의 가이드라인
            var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p> 
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>    
            `,'');
            response.writeHead(200);
            response.end(template);
        });
    }
    else if(pathname==="/create_process") {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() { // event listen, callback 함수 작동
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`./data/${title}`, description, 'utf8', function(err) {
                //response.writeHead(200);
                // 리다이렉션
                response.writeHead(302, {Location: `/?id=${title}`});
                // 302 redirection(임시 이동)과 id가 title인 location으로 redirect 
                response.end();
            });
            //console.log(post); // querystring을 개별로 parsing
        });
    }
    else if(pathname==="/update") {
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`./data/${queryData.id}`,'utf8',function(err, description) {
                var title = queryData.id;
                var list = templateList(filelist); // list -> HTML로 template화
                var template = templateHTML(title, list, // hidden : 수정 못하도록 숨기는 기능 
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value=${title}></p>
                        <p><textarea name="description" placeholder="description">${description}</textarea></p>
                        <p><input type="submit"></p>
                    </form>
                    `
                ,`<a href="/create>create</a> <a href="/update?id=${title}>update</a>`);
                response.writeHead(200);
                response.end(template);
            });
        });
    }
    else {
        response.writeHead(404); // 404 error
        response.end('Not Found'); // string 전달
    }
});
app.listen(3000);