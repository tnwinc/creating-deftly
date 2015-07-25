'use strict';
module.exports = function(file) {
    if (!file.exists) throw ('Faild to require, ' + file.name + ' : does not exist!');
    file.open('r');
    var js = file.read();
    file.close();
    return eval(js);
};
