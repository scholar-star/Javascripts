const express = require('express');
const mariadb = require('mysql');
const url = require('url');
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
        var sub_url = req.url;
        console.log(sub_url);
        var queryData = url.parse(sub_url,true).query;
        var distinct = queryData.distinct;
        var unit = queryData.unit;
        // queryData에 있던 구와 동 변수화 완료
        var jsondata = JSON.parse(response.body);
        var subarray = jsondata.data;
        // subarray.forEach(function(sub) {
        //     console.log(sub["지번주소"]);
        // });
        // javascript 객체로 분할 완료
        // DB 작성, 필터링을 더 쉽게 하기 위한 JSON Data Insert
        // const conn = mariadb.createConnection({
        //     host: 'localhost',
        //     user: 'root',
        //     password: '4221',
        //     database: 'pusan_subway'
        // });

        // DB -> 정규식을 이용해 queryString으로 검색, response body에 붙이기
        // 전략으로 수정
        console.log(distinct);
        console.log(unit);
        subarray.forEach(function(sub) {
            var roadadd = sub["도로명주소"];
            var line = sub["선명"];
            var station = sub["역명"];
            var address = sub["지번주소"];
            var oper = sub["철도운영기관"];
        })
        res.send(response.body);
    });
});

app.listen(port, function() {
    console.log("connected");
})
