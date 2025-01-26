var express = require('express');
var router = express.Router(); // 라우터객체
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');

router.get("/create", function(req, res) {
    // fs.readdir('./data', function(error, filelist) {
    var title = 'WEB - create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, 
        `<form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
        </form>`
    ,'');
    res.send(html);
    //});
});

router.post("/create_process", function(req, res) {
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
        res.redirect(`/topic/${title}`);
        res.end();
    });
});

router.get('/update/:pageId', function(req, res) {
    //fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`./data/${filteredId}`,'utf8', function(err, description) {
        var title = req.params.pageId;
        var list = template.list(req.list);
        var html = template.HTML(title, list, 
        `<form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p><textarea name="description"
                placeholder="description">${description}</textarea></p>
            <p><input type="submit"></p>`,
            `<a href="/topic/create"><create></a> <a href="/topic/update/${title}">update</a>`
        );
        res.send(html);
    });
    //});
});

router.post("/update_process", function(req, res) {
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
            res.redirect(`/topic/${title}`);
            res.end();
        });
    });
});

router.post("/delete_process", function(req, res) {
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

// 시맨틱 url : 쿼리 스트링 없이 경로만으로 정보 전달 - key/value 형태로 전달
router.get("/:pageId", function(req, res, next) { // 라우팅 없으면 혼동 발생
    // parameter에 시멘틱 정보가 들어간다
    // {"pageId":":pageId"}
    //console.log(req.list);
    //fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(req.params.pageId).base; // path.parse로 시멘틱에서 값을 얻어 가져온다(보안도 해결)
    fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description) {
        if (err) {
            next(err); // 에러가 발생하면 다음 미들웨어로 넘긴다
        } else {
            var title = req.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags:['h1'] // h1 태그만은 허용
            });
            var list = template.list(req.list);
            var html = template.HTML(sanitizedTitle, list, 
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                `<a href="/topic/create">create</a>
                    <a href="/topic/update/${sanitizedTitle}">update</a>
                    <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`
            );
            res.send(html);
        }
    });
    //});
});

module.exports = router; // 라우터 객체를 모듈로 내보낸다.