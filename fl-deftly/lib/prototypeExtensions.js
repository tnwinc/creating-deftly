//Object Extensions & Polyfill
if (!Object.keys) {
    Object.keys = function (obj) {
        if (obj !== Object(obj)) {
            throw new TypeError('Object.keys called on a non-object');
        }
        var keys = [], p;
        for (p in obj) {
            keys.push(p);
        }
        return keys;
    }
}

//Array Extensions
if (!Array.prototype.first) Array.prototype.first = function() {return this[0];}
if (!Array.prototype.last) Array.prototype.last = function() {return this[this.length-1];}