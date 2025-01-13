function f1() {
    console.log(1+1);
    console.log(1+2);
}

// var i = if(true) {console.log(1)};
// if문은 구문

// var i = while(true) {console.log(1)};
// while문은 구문

var f = function() {
    console.log(1+1);
    console.log(1+2);
}

console.log(f); // 함수 객체가 나온다.
f();

var a = [f]; // 함수들의 배열도 사용 가능
a[0]();

var o = {
    func:f
};
o.func(); // 객체(key - value)로서의 함수