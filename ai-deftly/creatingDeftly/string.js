'use strict';
if (!module) {
    var module = {};
}

this.module.string = function(string) {
    msg = {en: string};
    arguments[0] = msg;
    return localize.apply(this, arguments);
};

String.prototype.upper = function () {
    return this.toUpperCase();
};