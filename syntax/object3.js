var v1 = 'v1';
var v2 = 'v2';

var o = {
    v1:'v1',
    v2:'v2'
}; // 변수 자체를 객체의 key로 선언

function f1() {
    console.log(o.v1); // v1의 value값
}

function f2() {
    console.log(o.v2);
}

f1();
f2();

var o = {
    v1:'v1',
    v2:'v2',
    f1:function() { // 람다함수
        //console.log(o.v1);
        console.log(this.v1); // 자기 자신 객체 포인터
    },
    f2:function() {
        //console.log(o.v2);
        console.log(this.v2);
    }
};

o.f1(); // 객체 안 함수 실행
o.f2();