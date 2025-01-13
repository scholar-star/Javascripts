var members = ['egoing', 'k8805', 'hoya'];
// 배열
console.log(members[1]);

var roles = {
    'programmer':'egoing',
    'designer':'k8805',
    'manager':'hoya'
};
// 객체(key : value)
console.log(roles.designer);
console.log(roles['designer']); // key-value

var i=0;
while(i<members.length) {
    console.log('array loop', members[i]);
    i += 1;
}

for(var name in roles) {// name => key
    console.log('object =>',name);
}

for (var name in roles) {
    console.log('object =>',name, 'value =>',roles[name]);
}