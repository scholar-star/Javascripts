var express = require('express');
var router = express.Router();
var template = require('../lib/template');

router.get("/", function(req,res) { // 라우팅
    //fs.readdir('./data', function(error, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(req.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <img src="/images/busanjin.jpeg" style="width: 300px; display: block; margin-top: 10px;">`,
        `<a href="/topic/create">create</a>`
    );
    res.send(html); // 응답을 보여줌
    //});
});

module.exports = router; // 모듈로서 내보내기