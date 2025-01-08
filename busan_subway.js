const express = require('express');
const app = express();
const port = 3000;

app.use('/htmls', express.static('htmls'));

app.get("/subway", function (req, res) {
    var request = require('request');
    var options = {
        'method': 'GET',
        'url': 'https://api.odcloud.kr/api/15041101/v1/uddi:0b0d9485-641f-4595-a8c6-c5a87a0ef14e?page=1&serviceKey=4iA7WACtbuMvl7qskilXkYKrykO5YurZUOnVBf1YczV%2BeKSAE1kbx7tqRGt2DZk21IhpnE80lnbTEKRCJ3CWOA%3D%3D&perPage=115'
    };
    request(options, function(error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.send(response.body);
    })
});

app.listen(port, function() {
    console.log("connected");
})
