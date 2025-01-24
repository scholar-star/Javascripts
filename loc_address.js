const express = require('express');
const app = express();
const port = 3000;

app.use('/htmls',express.static('htmls'));

app.post('/location', (req, res) => {
    var word = req.body.word;
    var request = requires('request');
    var options = {
        'method':'GET',
        'url': "https://dapi.kakao.com/v2/local/search/keyword.json?query="+encodeURI(word),
        'headers': {
            'Authorization':'KaKaoAK 1f59b180d3f2afb9bf74e8adce63848f'
        }
    };
    request(options, function(error, response) {
        if (error) throw new Error(error);
        console.log(req.body.word);
        res.send(response.body);
    }); // option : request에 대한 설정
    // callback 실행
});

app.listen(port, () => {
    console.log("Connection Success");
});