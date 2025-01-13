var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); // querystring module
var sanitizeHtml = require('sanitize-html');
const path = require('path');
var template = require('./lib/template.js'); // 외부 라이브러리로 리팩토링

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
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `<h2>${title}</h2><p>${description}</p>`,
                `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html); // template 문자열로 응답 
            });
        } else {
            fs.readdir('./data', function(err, filelist) {
                var filterId = path.parse(queryData.id).base; // 일부만 골라내 정제
                fs.readFile(`./data/${filterId}`, 'utf8', function(err, description) {
                    // 이곳에서 페이지를 개략적으로 만든 상태에서 redirection.
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(description, {
                        allowedTags:['h2']
                    }); // h2만 html 적용
                    var list = template.list(filelist);
                    var html = template.HTML(title, list, `
                        <h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                        `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a> 
                        <form action="delete_process", method="post"
                        onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                            <input type="hidden" name="id" value=${sanitizedTitle}> 
                            <input type="submit" value="delete">
                        </form>`);
                        // key-value
                        // form action : path에 "/"를 붙이지 않음(같은 파일일 경우)
                    response.writeHead(200);
                    response.end(html);
                });
            });
        } 
    } else if(pathname==="/create") { // localhost:3000/create
        fs.readdir('./data',function(error, filelist) {
            var title = "Welcome";
            var list = template.list(filelist); // placeholder : 입력의 가이드라인
            var html = template.HTML(title, list, `
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
            response.end(html);
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
            var filterId = path.parse(queryData.id).base;
            fs.readFile(`./data/${filterId}`,'utf8',function(err, description) {
                var title = queryData.id;
                var list = template.list(filelist); // list -> HTML로 template화
                var html = template.HTML(title, list, // hidden : 수정 못하도록 숨기는 기능 
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
                response.end(html);
            });
        });
    }
    else if(pathname === '/update_process') {
        var body = "";
        request.on('data',function(data) {
            body += data;
        });
        request.on('end', function(data) {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`./data/${id}`, `./data/${title}`,function(error) { // 파일 이름 재설정
                fs.writeFile(`./data/${title}`, description, 'utf8', function(err) { // 재설정 파일에다 전체 description 다시 쓰기
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
    }
    else if(pathname === "/delete_process") { 
        var body = "";
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`./data/${filteredId}`, function(error) { // 파일 삭제
                response.writeHead(302, {Location:'/'}); 
                // redirection to Home
                response.end();
            });
        });
    }
    else {
        response.writeHead(404); // 404 error
        response.end('Not Found'); // string 전달
    }
});
app.listen(3000);