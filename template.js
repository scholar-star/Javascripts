module.exports = {
    HTML:function(title, list, body, control) {
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
        </html>
        `;
    },
    list:function(topics) {
        var list = '<ul>';
        var i = 0;
        while(i < topics.length) { // topic : 개별 객체(프로퍼티로 지정 가능)
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`; // database id로 구분자 지정
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }
}
