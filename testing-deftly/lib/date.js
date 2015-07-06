var date = function() {
    var date = new Date();
    return ((date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear());
};

module.exports = date;