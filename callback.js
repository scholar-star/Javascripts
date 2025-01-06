var a = function () {
    console.log('A');
} // void lambda 함수

function slowfunc(callback) {
    // 오래 걸리는 함수 실행 처리 종료 -> callback 함수를 바로 호출하여 실행
    callback();
}

a(); // 함수 호출
slowfunc(a);