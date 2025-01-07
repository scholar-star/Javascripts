const express = require('express');
const app = express();
const port = 3000;

const requestOptions = {
    method: "GET",
    redirect: "follow"
};
  
fetch("https://api.odcloud.kr/api/15041101/v1/uddi:0b0d9485-641f-4595-a8c6-c5a87a0ef14e?page=1&serviceKey=4iA7WACtbuMvl7qskilXkYKrykO5YurZUOnVBf1YczV%2BeKSAE1kbx7tqRGt2DZk21IhpnE80lnbTEKRCJ3CWOA%3D%3D&perPage=115", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

app.listen(function() {
    console.log("connected");
})
