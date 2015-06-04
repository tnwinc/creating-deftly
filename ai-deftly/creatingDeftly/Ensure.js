'use strict';
if (!this.module.Console) {
    throw "Ensure.js depends on Console.js. Requiring it to be assigned to var Console first."
}

module.Ensure = function(test, requirement) {
    if (!test) {
        Console.error('Requirement: ' + requirement + ', FAILD WITH ' + test);
    } else {
        return test;
    }
};
