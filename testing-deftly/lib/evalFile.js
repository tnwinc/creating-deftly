var evalFile = function(file) {
    file.open("r");
    var js = file.read();
    file.close();
    eval(js);
};