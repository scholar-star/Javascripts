var http = require('http');
var cookie = require('cookie');

http.createServer(function(req, res) {
    console.log(req.headers.cookie);
    var cookies = {}; // 객체형
    if(req.headers.cookie !== undefined) {
        cookies = cookie.parse(req.headers.cookie);
    }
    console.log(cookies);
    // header cookie
    res.writeHead(200, {
        'Set-Cookie':[
             'yummy_cookie=choco',
             'tasty_cookie=strawberry',
             `Permanent=cookies; Max-age=${60*60*24*30}`,
             'Secure=Secure; Secure', // Secure option : https에서만 전송
             'HttpOnly=HttpOnly; HttpOnly', // JavaScript에서는 전달받지 못함.
             'Path=Path; Path=/cookie', // 해당 경로에서 작동하는 쿠키
             'Domain=Domain; Domain=o2.org' // o2.org Domain에서만 작동
         ] // 영구 쿠키(웹브라우저 종료 후에도 유지)
        // Set-Cookie : 쿠키설정
        // Set-Cookie를 해제해도 브라우저에 서버는 쿠키를 보냄.
    }); // status 200
    res.end('Cookie!');
}).listen(3000); // 3000번 포트에 웹 서버 실행