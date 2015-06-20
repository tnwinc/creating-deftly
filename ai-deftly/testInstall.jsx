#target illustrator

var moduleNotFound = function(name){
    alert("Failed to load module: " + name);
    return false;
}

var test = function() {
    if (!Console) return moduleNotFound("Console");
    if (!Ensure) return moduleNotFound("Ensure");
    if (!Obj) return moduleNotFound("Obj");
    if (!JSON) return moduleNotFound("JSON");
    if (!Ai) return moduleNotFound("Ai");
    if (!string) return moduleNotFound("string");
    return true;
}

if (test()) {
    alert("Creating Deftly installed successfully!");
    app.quit();
}