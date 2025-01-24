console.log('Hello no deamon');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

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

app.get("/", function(req,res) { // 라우팅
    //fs.readdir('./data', function(error, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(req.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
    );
    res.send(html); // 응답을 보여줌
    //});
});

// 시맨틱 url : 쿼리 스트링 없이 경로만으로 정보 전달 - key/value 형태로 전달
app.get("/page/:pageId", function(req, res) {
    // parameter에 시멘틱 정보가 들어간다
    // {"pageId":":pageId"}
    //console.log(req.list);
    //fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(req.params.pageId).base; // path.parse로 시멘틱에서 값을 얻어 가져온다(보안도 해결)
    fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description) {
        var title = req.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1'] // h1 태그만은 허용
        });
        var list = template.list(req.list);
        var html = template.HTML(sanitizedTitle, list, 
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a>
                <a href="/update/${sanitizedTitle}">update</a>
                <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
            </form>`
        );
        res.send(html);
    });
    //});
});

app.get("/create", function(req, res) {
    // fs.readdir('./data', function(error, filelist) {
    var title = 'WEB - create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, 
        `<form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
        </form>`
    ,'');
    res.send(html);
    //});
});

app.post("/create_process", function(req, res) {
    // var body = '';
    // req.on('data', function(data) {
    //     body += data;
    // });
    // req.on('end', function() {
    //     var post = qs.parse(body); // 메세지 body를 파싱, 변수들을 얻어낸다.
    //     var title = post.title;
    //     var description = post.description;
    //     fs.writeFile(`./data/${title}`,description, 'utf8', function(err) {
    //         res.writeHead(302, {Location: `/page/${title}`}); // 리다이렉션으로 해당 id 페이지로 이동
    //         res.end();
    //     });
    // });
    console.log(req.list);
    var post = req.body; // body-parser가 쪼개고 건진 data를 가져온다.
    var title = post.title;
    var description = post.description;
    fs.writeFile(`./data/${title}`, description, 'utf8', function(err) {
        res.redirect(`/page/${title}`);
        res.end();
    });
});

app.get('/update/:pageId', function(req, res) {
    //fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filteredId}`,'utf8', function(err, description) {
        var title = req.params.pageId;
        var list = template.list(req.list);
        var html = template.HTML(title, list, 
        `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p><textarea name="description"
                placeholder="description">${description}</textarea></p>
            <p><input type="submit"></p>`,
            `<a href="/create"><create></a> <a href="/update/${title}">update</a>`
        );
        res.send(html);
    });
    //});
});

app.post("/update_process", function(req, res) {
    // var body = '';
    // req.on('data', function(data) {
    //     body += data;
    // });
    // req.on('end', function() {
    //     var post = qs.parse(body); // body에서 data를 가져온다.
    //     var id = post.id;
    //     var title = post.title;
    //     var description = post.description;
    //     fs.rename(`./data/${id}`, `./data/${title}`, function(error) {
    //         fs.writeFile(`./data/${title}`, description, 'utf8', function(err) {
    //             res.redirect(`/page/${title}`);
    //             res.end();
    //         });
    //     });
    // });
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`./data/${id}`, `./data/${title}`, function(error) {
        fs.writeFile(`./data/${title}`, description, 'utf8', function(err) {
            res.redirect(`/page/${title}`);
            res.end();
        });
    });
});

app.post("/delete_process", function(req, res) {
    // var body = '';
    // req.on('data', function(data) {
    //     body += data;
    // });
    // req.on('end', function() {
    //     var post = qs.parse(body);
    //     var id = post.id;
    //     var filterId = path.parse(id).base;
    //     fs.unlink(`./data/${filterId}`, function(error) {
    //         res.redirect('/');
    //     });
    // });
    var post = req.body;
    var id = post.id;
    var filterId = path.parse(id).base;
    fs.unlink(`./data/${filterId}`, function(error) {
        res.redirect('/');
    });
});

app.listen(3000, ()=> {
    console.log(`Example app listening at port 3000`);
});
