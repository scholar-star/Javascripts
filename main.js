console.log('Hello no deamon');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var helmet = require('helmet');
// var app = http.createServer(function(request, response) {
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;

//     if(pathname === '/') {
//         if(queryData.id === undefined) {
//             fs.readdir('./data', function(error, filelist) {
//                 var title = 'Welcome';
//                 var description = 'Hello, Node.js';
//                 var list = template.list(filelist);
//                 var html = template.HTML(title, list,
//                     `<h2>${title}</h2><p>${description}</p>`,
//                     `<a href="/create">create</a>`
//                 );
//                 response.writeHead(200);
//                 response.end(html);
//             });
//         } else {
//             fs.readdir('./data', function(error, filelist) {
//                 var filteredId = path.parse(queryData.id).base;
//                 fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
//                     var title = queryData.id;
//                     var sanitizedTitle = sanitizeHtml(title);
//                     var sanitizedDescription = sanitizeHtml(description, {
//                         allowedTags:['h1']
//                     });
//                     var list = template.list(filelist);
//                     var html = template.HTML(sanitizedTitle, list,
//                         `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
//                         `<a href="/create">create</a>
//                         <a href="/update?id=${sanitizedTitle}">update</a>
//                         <form action="delete_process" method="post">
//                             <input type="hidden" name="id" value="${sanitizedTitle}">
//                             <input type="submit" value="delete">
//                         </form>`
//                     );
//                     response.writeHead(200);
//                     response.end(html);
//                 });
//             });
//         }
//     } else if(pathname === '/create') {
//         fs.readdir('./data', function(error, filelist) {
//             var title = 'WEB - create';
//             var list = template.list(filelist);
//             var html = template.HTML(title, list, `
//                 <form action="/create_process" method="post">
//                     <p><input type="text" name="title" placeholder="title"></p>
//                     <p>
//                         <textarea name="description" placeholder="description"></textarea>
//                     </p>
//                     <p>
//                         <input type="submit">
//                     </p>
//                 </form>
//             `, '');
//             response.writeHead(200);
//             response.end(html);
//         });
//     } else if(pathname === '/create_process') {
//         var body = '';
//         request.on('data', function(data) {
//             body = body + data;
//         });
//         request.on('end', function() {
//             var post = qs.parse(body);
//             var title = post.title;
//             var description = post.description;
//             fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
//                 response.writeHead(302, {Location: `/?id=${title}`});
//                 response.end();
//             });
//         });
//     } else if(pathname === '/update') {
//         fs.readdir('./data', function(error, filelist) {
//             var filteredId = path.parse(queryData.id).base;
//             fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
//                 var title = queryData.id;
//                 var list = template.list(filelist);
//                 var html = template.HTML(title, list,
//                     `
//                     <form action="/update_process" method="post">
//                         <input type="hidden" name="id" value="${title}">
//                         <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//                         <p>
//                             <textarea name="description" placeholder="description">${description}</textarea>
//                         </p>
//                         <p>
//                             <input type="submit">
//                         </p>
//                     </form>
//                     `,
//                     `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
//                 );
//                 response.writeHead(200);
//                 response.end(html);
//             });
//         });
//     } else if(pathname === '/update_process') {
//         var body = '';
//         request.on('data', function(data) {
//             body = body + data;
//         });
//         request.on('end', function() {
//             var post = qs.parse(body);
//             var id = post.id;
//             var title = post.title;
//             var description = post.description;
//             fs.rename(`data/${id}`, `data/${title}`, function(error) {
//                 fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
//                     response.writeHead(302, {Location: `/?id=${title}`});
//                     response.end();
//                 });
//             });
//         });
//     } else if(pathname === '/delete_process') {
//         var body = '';
//         request.on('data', function(data) {
//             body = body + data;
//         });
//         request.on('end', function() {
//             var post = qs.parse(body);
//             var id = post.id;
//             var filteredId = path.parse(id).base;
//             fs.unlink(`data/${filteredId}`, function(error) {
//                 response.writeHead(302, {Location: `/`});
//                 response.end();
//             });
//         });
//     } else {
//         response.writeHead(404);
//         response.end('Not found');
//     }
// });
// app.listen(3000);

const express = require('express');
const app = express();
var bodyParser = require('body-parser'); // 서드파티 미들웨어
// 프레임워크 객체
var compression = require('compression');  
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');


app.use(compression()); // express 객체가 compression을 사용하도록 설정(모든 요청 때마다 읽는다)
app.get('*', function(request, response, next) { // GET 방식을 사용하는 모든 path에서 실행
    fs.readdir('./data', function(error, filelist) {
        request.list = filelist;
        next();
    });
});

app.use(bodyParser.urlencoded({extended: false})); // 미들웨어 사용
//app.use(function(req, res, next) {
//     fs.readdir('./data', function(error, filelist) {
//         req.list = filelist; // req 객체에 list(filelist) 추가, req에서 전역적으로 사용 가능능
//         next(); // 다음 미들웨어
//     });
// }); // 사용자 지정 함수 미들웨어


app.use('/', indexRouter);
app.use('/topic', topicRouter); // /topic으로 시작하는 주소에 topicRouter 적용.

app.use(function(req, res, next) {
    res.status(404).send("Sorry, can't find it!"); // 404 에러일 때 보낼 메세지
});

app.use(function(err, req, res, next) { // 서버 내부 에러(500)일 때 받는 미들웨어
    console.error(err.stack);
    res.status(500).send("Something broke!")
});

app.use(express.static('public')); // 정적 폴더 파일 서비스

app.listen(3000, ()=> {
    console.log(`Example app listening at port 3000`);
});
