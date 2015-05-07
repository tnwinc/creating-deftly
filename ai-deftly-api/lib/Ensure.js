'use strict';
if (!module) {
    var module = {};
}

module.Ensure = function(test, requirement) {
    if (!test) {
        throw ('Requirement: ' + requirement + ', FAILD WITH ' + test);
    } else {
        return test;
    }
};
