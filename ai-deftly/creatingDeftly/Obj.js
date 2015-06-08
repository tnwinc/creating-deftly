'use strict';
if (!module) {
    var module = {};
}

this.module.Obj = function(object) {
    return {
        isObject: function() {
            if (object.toString() === '[object Object]') {
                return true;
            }
            return false;
        },
        isArray : function() {
            if (Object.prototype.toString.call(object) === '[object Array]') {
                return true;
            }
            return false;
        },
        keys    : function() {
            var result = [];
            for (var key in object) {
                result.push(key);
            }
            return result;
        },
        forEach : function(callback, _object) {
            if (!_object) _object = object;
            var useKey = this.isObject(), index = 0;
            for (var key in _object){
                if (useKey) {
                    callback(object[key], key);
                } else {
                    callback(object[key], index);
                }
                index++;
            }
        },
        filter  : function(callback, _object) {
            if (!_object) _object = object;
            var result = [];
            this.forEach(function(item, index) {
                var test = callback(item, index);
                if (test) result.push(test);
            }, _object);
            return result;
        },
        map     : function(callback, _object) {
            if (!_object) _object = object;
            var result = [];
            this.forEach(function(item, index) {
                result.push(callback(item, index));
            }, _object);
            return result;
        },
        indexOf : function(testValue, _object) {
            if (!_object) _object = object;
            var result = -1;
            this.forEach(function(item, index) {
                if (testValue == item) result = index;
            }, _object);
            return result;
        }
    };
};