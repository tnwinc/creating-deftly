var expect = function(test) {
    var logResult = function(result, operator, got) {
        var index = its.length-1;
        if (result) {
            passing++;
        } else {
            failing++;
        }
        its[index].tests.push({
            passed  : result,
            expected: test,
            operator: operator,
            got     : got,
            time    : time()
        });
    };

    return {
        to: {
            be: function(expected) {
                return logResult(test === expected, 'to be       : ', expected);
            },
            equal: function(expected) {
                return logResult(test == expected, 'to equal    : ', expected);
            },
            not: {
                be: function(unexpected) {
                        return logResult(test !== unexpected, 'to NOT be   : ', unexpected);
                },
                equal: function(unexpected) {
                        return logResult(test != unexpected, 'to NOT equal: ', unexpected);
                }
            }
        }
    };
};