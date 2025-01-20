var db = require('./db.js');
var template = require('./template.js')
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response) { 
    db.query(`SELECT * FROM topic`, function(error, topics) {
    // console.log(topics);
    // response.writeHead(200);
    // response.end('Success');
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = template.list(topics);
        var html = template.HTML(title, list, 
            `<h2>${title}</h2>
            ${description}`, `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    }); // db.query(질의, 콜백함수(에러, 처리결과))
}

exports.page = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
        db.query(`SELECT * FROM topic`, function(error, topics) {
        if(error) {
            throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,[queryData.id], function(error2, topic) {
            // ?에 넣는 코드는 정제됨(공격 의도 코드를 방어)
            if(error2) {
                throw error2;
            }
            //console.log(topic[0].title);
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list, 
                `<h2>${sanitizeHtml(title)}</h2>
                ${sanitizeHtml(description)}
                <p>by ${sanitizeHtml(topic[0].name)}</p>`, `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                    <input type="hidden" name="id" value=${queryData.id}> 
                    <input type="submit" value="delete">
                </form>`
                // queryData.id : sql에서 방어됨
            );
            response.writeHead(200);
            response.end(html);
        }); 
    });
}

exports.create = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(error2, authors) {
            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(sanitizeHtml(title), list,
                `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        ${template.authorSelect(authors)}
                    </p>
                    <p><input type="submit">
                </form>`,
                `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function(request, response) {
    var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            // var title = post.title;
            // var description = post.description;
            // fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            //     response.writeHead(302, {Location: `/?id=${title}`});
            //     response.end();
            // });
            db.query(`INSERT INTO topic (title, description, created, author_id)
                VALUES (?, ?, NOW(), ?)`,[post.title, post.description,post.author],
            function(error, result) {
                if(error) {
                    throw error;
                }
                response.writeHead(302, {Location:`/?id=${result.insertId}`}); // 추가된 id
                response.end();
            })
        });
}

exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics) {
        if(error) {
                throw error;
            }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic) {
            db.query(`SELECT * FROM author`, function(error2, authors) {
                var list = template.list(topics);
                var html = template.HTML(sanitizeHtml(topic[0].title), list, // input value = "들어가 있는 값"
                    `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value=${topic[0].id}>
                        <p><input type="text" name="title" placeholder="title" value=${sanitizeHtml(topic[0].title)}></p>
                        <p><textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
                        <p>${template.authorSelect(authors, topic[0].author_id)}</p>
                        <p><input type="submit"></p>
                    </form>`, `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = function(request, response) {
    var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            // var id = post.id;
            // var title = post.title;
            // var description = post.description;
            // fs.rename(`data/${id}`, `data/${title}`, function(error) {
            //     fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            //         response.writeHead(302, {Location: `/?id=${title}`});
            //         response.end();
            //     });
            // });
            db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',[post.title, post.description, post.author, post.id],
                // update table set col1=val1... where 조건
                function(error, result) {
                    // if(error) {
                    //     throw error;
                    // }
                    response.writeHead(302, {Location:`/?id=${post.id}`});
                    // 리다이렉션 - end
                    response.end();
                }
            );
        });
}

exports.delete_process = function(request, response) {
    var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            // var id = post.id;
            // var filteredId = path.parse(id).base;
            // fs.unlink(`data/${filteredId}`, function(error) {
            //     response.writeHead(302, {Location: `/`});
            //     response.end();
            // });
            db.query('DELETE FROM topic WHERE id=?',[post.id],function(error, result) {
                if(error) {
                    throw error;
                }
                response.writeHead(302, {Location:"/"});
                response.end();
            });
        });
    }