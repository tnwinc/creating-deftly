

'use strict';
if (!module || !module.Ensure) {
    throw("ERROR: the Fla.jsfl module requires Ensure.js to be included first. (fla_build_lib: FLASH CODE)");
    var Ensure = module.Ensure;
}

module.Fla = function() {
    // Helper functions
    var processLayer = function(lyr, index, timeline) {
        lyr.index = index;
        lyr.keyframes = lyr.frames.filter(function(f, index) { if(f.startFrame == index) return true; });
        lyr.show = function() {lyr.visible = true; return lyr;};
        lyr.hide = function() {lyr.visible = false; return lyr;};
        lyr.lock = function() {lyr.locked = true; return lyr;};
        lyr.unlock = function() {lyr.locked = false; return lyr;};
        lyr.select = function() {timeline.currentLayer = index; return lyr;};
        lyr.insertKeyframe = function(frameIndex) {
            lyr.select();
            if (frameIndex > 0) frameIndex--;
            if (frameIndex == lyr.frames[frameIndex].startFrame) return lyr.frames[frameIndex];
            timeline.insertKeyframe(frameIndex);
            return lyr.frames[frameIndex];
        };
        return lyr;
    };

    var processObjectList = function(list) {
        return {
            list  : list,
            names : list.map(function(o) {return o.name}),
            first : list[0],
            last  : list[list.length-1],
            count : list.length
        }
    };

    var processLibItem = function(item, index) {
        if (item.itemType == 'font') return;
        if(!index) index = undefined;
        item._index = index;

        var splitIndex = item.name.lastIndexOf('/');
        if (splitIndex < 0) {
            splitIndex = 0;
            item._path = '';
        } else {
            splitIndex++;
            item._path = item.name.substring(0, splitIndex);
        }
        item._name = (item.name.substr(splitIndex));
        
        item._select = function() {
            doc.library.selectItem(item.name);
            return item;
        };
        
        var addMovieClipMethods = function() {
            item._setClass = function(name) {
                item.linkageExportForAS = true;
                item.linkageClassName = name;
                return item;
            };
            item._removeClass = function() {
                item.linkageClassName = '';
                item.linkageExportForAS = false;
                return item;
            };
        };

        if (item.itemType == 'movie clip') {
            addMovieClipMethods();
        }
        
        if (item.itemType == 'movie clip' || item.itemType == 'graphic' || item.itemType == 'button') {
            item._edit = function() {
                doc.library.editItem(item.name);
                var timeline = doc.getTimeline();
                timeline.layers.forEach(function(l, i) {
                    processLayer(l, i, timeline)
                });
                return timeline;
            };
            item._layers = function() {
                var timeline = item._edit();
                return processObjectList(timeline.layers);
            };
            item._setSymbolType = function(type) {
                symbolTypes = {
                    MOVIECLIP: 'movie clip',
                    GRAPHIC  : 'graphic',
                    BUTTON   : 'button'
                };
                Ensure(symbolTypes[type], type + ' must be a valid symbolType [MOVIECLIP, GRAPHIC, BUTTON');
                item._select();
                doc.library.setItemProperty('symbolType', symbolTypes[type]);
                if (symbolTypes[type] == 'movie clip') {
                    addMovieClipMethods();
                }
                return item;
            }
        }

        if (item.itemType == 'movie clip' || item.itemType == 'graphic' || item.itemType == 'button' || item.itemType == 'bitmap') {
            item._addToStage = function(x, y) {
                if (!x) x = 0;
                if (!y) y = 0;
                doc.selection = [];
                item._select();
                if (doc.library.addItemToDocument({x: x, y: y})) {
                    Fla.print('Added ' + item._name + ' to ' + doc.getTimeline().name, 'LibraryItem._addToStage');
                    var instance = doc.selection[0];
                    instance.x = x;
                    instance.y = y;
                    return instance;
                } else {
                    Fla.print('Something went wrong while adding ' + item._name + ' to ' + doc.getTimeline().name, 'LibraryItem._addToStage');
                    return false;
                }
            };
        }
        
        item._rename = function(name) {
            item._select();
            doc.library.renameItem(name);
            item._name = name;
            return item;
        };
        
        item._moveToFolder = function(dest, replace) {
            doc.library.moveToFolder(dest, item.name, replace);
            item._path = dest;
            return item;
        };

        return item;
    };

    var processTimeline = function(timeline) {

    };

    var getObjectByName = function(objArray, name) {
        var item = objArray.filter(function(item) { if(item._name == name) return item; })[0];
        if (!item) return item;
        item._select();
        return item;
    };

    // Core Api
    var print = function(message, context) {
        if(!context) context = 'method';
        fl.trace('fla_build_lib:' + context + ': ' + message);
    };
    var getDoc = function() {
        return fl.getDocumentDOM();
    };
    var openFile = function(filePath) {
        fl.openDocument(FLfile.platformPathToURI(filePath));
        return fl.getDocumentDOM();
    };
    var save = function(doc) {
        doc.save(false);
    };
    var build = function(doc, dirPath, fileName, ext) {
        fl.clearPublishCache();
        fl.publishCacheEnabled = false;
        var profile;
        //Delete a prev attempted temp profile
        if (doc.publishProfiles.indexOf('@temp') != -1) {
            doc.currentPublishProfile = '@temp';
            doc.deletePublishProfile();
        }
        //Make a copy of the 1st profile and tweak
        doc.currentPublishProfile=doc.publishProfiles[0];
        profile=new XML(doc.exportPublishProfileString());
        doc.addNewPublishProfile('@temp');
        doc.currentPublishProfile='@temp';
        profile.@name='@temp';
        
        //build either the swf or mp4
        if(ext.toLowerCase() === "mp4") {
            doc.exportVideo('file://' + dirPath + '/' + fileName + '.mov');
        } else {
            profile.PublishFormatProperties.defaultNames=0;
            //All three of these need to be set to get it to actually use the file name
            profile.PublishFormatProperties.flash=1;
            profile.PublishFormatProperties.html=0;
            profile.PublishFormatProperties.flashDefaultName=0;
            profile.PublishFormatProperties.flashFileName = dirPath + '/' + fileName + '.swf';

            profile.PublishFormatProperties.OmitTraceActions=0;
            profile.PublishFlashProperties.Report='0';
            profile.PublishFlashProperties.Quality='80';
            profile.PublishFlashProperties.ActionScriptVersion=3;
            profile.PublishFlashProperties.AS3PackagePaths='.';
            profile.PublishFlashProperties.DebuggingPermitted=1; //Need debugging
            profile.PublishFlashProperties.AS3ConfigConst=<AS3ConfigConst>DEBUG::translator='false';APP::externalMp3='false';DEBUG::reels='false';APP::isIntegrated='false';APP::urlParams='';</AS3ConfigConst>
            profile.PublishFlashProperties.AS3Strict=2;
            profile.PublishFlashProperties.AS3Flags=4102;
            profile.PublishFlashProperties.AS3AutoDeclare=4096;

            doc.importPublishProfileString(profile);
            doc.currentPublishProfile=doc.publishProfiles[1];
            
            //Publish it now and delete the temp profile
            doc.publish();
        }
        
        //clean up and close
        doc.deletePublishProfile();
        
        fl.compilerErrors.save('file://' + dirPath + '/tmp_compile.err');
        //DO NOT CLOSE THE FILE, JUST QUIT. OTHERWISE FLASH WILL STALL
    };
    var closeAndQuit = function(doc) {
        //DO NOT CLOSE THE FILE, JUST QUIT. OTHERWISE FLASH WILL STALL
        fl.quit(false);
    };
    var importToLibrary = function(doc, filePath, ui) {
        if (ui) {
            var URI = fl.browseForFileURL("select", "Import File");
            if (URI == null){
                return 0; //short circut if the user hits cancel
            } else {
                filePath = URI;
            }
        }
        var libBefore = doc.library.items.length;
        doc.importFile(FLfile.platformPathToURI(filePath),true,false,false);
        var libAfter = doc.library.items.length;
        //Check to make sure the user didn't press CANCEL in the import options prompt
        if (libAfter > libBefore){
            this.print("Imported " + filePath, 'importToLibrary');
            return 1;
        }
        else return 0;
    };
    var getScenes = function(doc) {
        var result = [];
        doc.timelines.forEach(function(scene, index) {
            var layers = scene.layers.map(function(l, i) {
                return processLayer(l, i, scene);
            });
            var sceneObj = function(scene, index) {
                var select = function() {
                    doc.editScene(index);
                    return scene;
                }
                return {
                    _index   : index,
                    _name    : scene.name,
                    _timeline: scene,
                    _layers  : processObjectList(layers),
                    _select  : select,
                    _edit    : select,
                    _getLayerByName: function(name) {
                        var lyr = layers.filter(function(lyr) { if(lyr.name == name) return lyr; })[0];
                        return lyr;
                    },
                    _rename  : function(name) {
                        select();
                        doc.renameScene(name);
                        return scene;
                    },
                }
            };
            result.push(sceneObj(scene, index));
        });
        
        return result;
    };
    var getLibItems = function(doc) {
        var result = [];
        doc.library.items.forEach(function(item, index) {
            if (item.itemType == 'font') return;
            result.push(processLibItem(item, index));
        });
        return result;
    };
    var getSceneByName = function(doc, name) {
        return getObjectByName(this.getScenes(doc), name);
    };
    var getLibItemByName = function(doc, name) {
        return getObjectByName(this.getLibItems(doc), name);
    };
    var setDocumentSize = function(doc, width, height) {
        doc.width = Math.floor(width);
        doc.height = Math.floor(height);
        return doc;
    };
    var matchDocumentToInstance = function(doc, instance) {
        Fla.setDocumentSize(doc, instance.width, instance.height);
        return doc;
    };
    var convertToSymbol = function(selection, type, name, registrationPoint) {
        var newSelection = [];
        if(!selection) newSelection = doc.selection;
        if (Object.prototype.toString.apply(selection) === '[object Array]') {
            newSelection = selection;
        } else {
            newSelection.push(selection);
        }
        doc.selectNone();
        doc.selection = newSelection;
        return processLibItem(doc.convertToSymbol(type, name, registrationPoint));
    };
    return {
        print                  : print,
        getDoc                 : getDoc,
        openFile               : openFile,
        save                   : save,
        build                  : build,
        closeAndQuit           : closeAndQuit,
        importToLibrary        : importToLibrary,
        getScenes              : getScenes,
        processLibItem         : processLibItem,
        getLibItems            : getLibItems,
        getSceneByName         : getSceneByName,
        getLibItemByName       : getLibItemByName,
        setDocumentSize        : setDocumentSize,
        matchDocumentToInstance: matchDocumentToInstance,
        convertToSymbol        : convertToSymbol,
    };
};
