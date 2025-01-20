console.log('Hello no deamon');
var http = require('http');
//var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
//var path = require('path');
//var sanitizeHtml = require('sanitize-html');
//var mysql = require('mysql');
// mysql library 추가
var db = require('./lib/db.js');
var topic = require('./lib/topic.js');
// 데이터베이스 연결
var author = require('./lib/author.js');

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined) {
            // fs.readdir('./data', function(error, filelist) {
            //     var title = 'Welcome';
            //     var description = 'Hello, Node.js';
            //     var list = template.list(filelist);
            //     var html = template.HTML(title, list,
            //         `<h2>${title}</h2><p>${description}</p>`,
            //         `<a href="/create">create</a>`
            //     );
            //     response.writeHead(200);
            //     response.end(html);
            // });
            topic.home(request, response); // exports.home 사용
        } else {
            // fs.readdir('./data', function(error, filelist) {
            //     var filteredId = path.parse(queryData.id).base;
            //     fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            //         var title = queryData.id;
            //         var sanitizedTitle = sanitizeHtml(title);
            //         var sanitizedDescription = sanitizeHtml(description, {
            //             allowedTags:['h1']
            //         });
            //         var list = template.list(filelist);
            //         var html = template.HTML(sanitizedTitle, list,
            //             `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
            //             `<a href="/create">create</a>
            //             <a href="/update?id=${sanitizedTitle}">update</a>
            //             <form action="delete_process" method="post">
            //                 <input type="hidden" name="id" value="${sanitizedTitle}">
            //                 <input type="submit" value="delete">
            //             </form>`
            //         );
            //         response.writeHead(200);
            //         response.end(html);
            //     });
            // });
            topic.page(request, response); // exports.page 사용
        }
    } else if(pathname === '/create') {
        // fs.readdir('./data', function(error, filelist) {
        //     var title = 'WEB - create';
        //     var list = template.list(filelist);
        //     var html = template.HTML(title, list, `
        //         <form action="/create_process" method="post">
        //             <p><input type="text" name="title" placeholder="title"></p>
        //             <p>
        //                 <textarea name="description" placeholder="description"></textarea>
        //             </p>
        //             <p>
        //                 <input type="submit">
        //             </p>
        //         </form>
        //     `, '');
        //     response.writeHead(200);
        //     response.end(html);
        // });
        topic.create(request, response); // exports.create 사용
    } else if(pathname === '/create_process') {
        topic.create_process(request, response); // exports.create_process
    } else if(pathname === '/update') {
        //fs.readdir('./data', function(error, filelist) {
            //var filteredId = path.parse(queryData.id).base;
            // fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            //     var title = queryData.id;
            //     var list = template.list(filelist);
            //     var html = template.HTML(title, list,
            //         `
            //         <form action="/update_process" method="post">
            //             <input type="hidden" name="id" value="${title}">
            //             <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            //             <p>
            //                 <textarea name="description" placeholder="description">${description}</textarea>
            //             </p>
            //             <p>
            //                 <input type="submit">
            //             </p>
            //         </form>
            //         `,
            //         `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            //     );
            //     response.writeHead(200);
            //     response.end(html);
            // });
            topic.update(request, response);
        }
     else if(pathname === '/update_process') {
        topic.update_process(request, response);
    } else if(pathname === '/delete_process') {
        topic.delete_process(request, response);
    } else if(pathname === '/author') {
        author.home(request, response);
    } else if(pathname === '/author/create_process') {
        author.create_process(request, response);
    } else if(pathname === '/author/update') {
        author.update(request, response);   
    } else if(pathname === '/author/update_process') {
        author.update_process(request, response);
    } else if(pathname === '/author/delete_process') {
        author.delete_process(request, response);
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);
