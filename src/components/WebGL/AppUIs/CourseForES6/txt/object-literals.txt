//Short hand for writing propperty
var lok = 'Wong Lok';
var a1 = {
    lok
};
var a2 = {
    lok: lok
};
console.log(a1);
console.log(a2);

//Short hand for writing dynamic propperty
var b1 = {
    [lok]: 'dynamic property'
};
var b2 = {
    'Wong Lok': 'dynamic property'
};
console.log(b1);
console.log(b2);

//Short hand for writing functions
var c1 = {
    add(a, b){
        return a + b;
    }
};
var c2 = {
    add: function(a, b){
        return a + b;
    }
};
console.log(c1.add(1,2));
console.log(c2.add(1,2));

