var fs = require('fs');

// // sync readFile
// console.log('A');
// var result = fs.readFileSync('texts/sample.txt','utf8');
// // task가 끝날때까지 대기하고 다음 동작을 수행하므로 callback이 없음.
// console.log(result);
// console.log('C');

// async readFile
console.log('A');
fs.readFile('texts/sample.txt', 'utf8', function(err, result) {
    console.log(result);
});
console.log('C');
// readfile 처리 속도 < console.log('C') 처리 속도도