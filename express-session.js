var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
// sessions 폴더에 생성
// 저장소에서 이를 갱신할수 있다.

var app = express(); // express 객체 생성

app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninstalled: true,
    store:new FileStore() // 세션 저장소 추가
})); // 세션 사용

// app.use(function(req, res, next) {
//     if (!req.session.views) { // session에 views가 없으면
//         req.session.views = {};
//     }

//     var pathname = parseurl(req).pathname;

//     // 세션 수 세기(있으면 추가)
//     req.session.views[pathname] = (req.session.views[pathname] || 0)+1

//     next();
// });

// app.get('/foo', function(req, res, next) {
//     res.send('you viewed this page '+req.session.views['/foo']+' times');
// });

// app.get('/bar', function(req, res, next) {
//     res.send('you viewed this page '+req.session.views['/bar']+' times');
// });

app.get('/', function(req, res, next) {
    console.log(req.session);
    if(req.session.num === undefined) {
        req.session.num = 1; // 1부터 시작
    } else {
        req.session.num += 1
    }
    res.send(`Views : ${req.session.num}`);
    // res.send('Hello session');
});

app.listen(3000, function() {
    console.log('3000!');
});