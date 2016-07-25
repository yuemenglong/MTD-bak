exports.polyfit = function(xn, yn) {
    if (xn.length != yn.length) {
        throw new Error("Xn, Yn Lenght Not Match");
    }
    // 设A=∑xi^2,B=∑xi,C=∑yixi,D=∑yi，则方程化为：
    // Aa+Bb=C 
    // Ba+nb=D
    // 解出a,b得：
    // a=(Cn-BD)/(An-BB) 
    // b=(AD-CB)/(An-BB) 
    var n = xn.length;
    var A = xn.reduce(function(acc, item) {
        return acc + item * item;
    }, 0);
    var B = xn.reduce(function(acc, item) {
        return acc + item;
    }, 0);
    var C = xn.reduce(function(acc, item, i) {
        return acc + item * yn[i];
    }, 0);
    var D = yn.reduce(function(acc, item) {
        return acc + item;
    }, 0);
    var k = (C * n - B * D) / (A * n - B * B);
    var b = (A * D - C * B) / (A * n - B * B);
    return { k: k, b: b };
}
