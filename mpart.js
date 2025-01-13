var M = {
    v:'v',
    f:function() {
        console.log(this.v);
    }
};

module.exports = M;
// 다른 파일에서도 객체를 사용할 수 있게 함 : module.exports