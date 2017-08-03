

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
    var _pwd = fl.scriptURI;
    _pwd = _pwd.substr(0 , _pwd.lastIndexOf("/")+1);
    var print = function(message, context) {
        if(!context) context = 'method';
        fl.trace('fla_build_lib:' + context + ': ' + message);
    };
    var getDoc = function() {
        var doc = fl.getDocumentDOM();
        doc.x = 0;
        doc.y = 0;
        return doc;
    };
    var openFile = function(filePathOrURI) {
        var fileURI = filePathOrURI;
        if (!filePathOrURI.startsWith('file:///')) fileURI = FLfile.platformPathToURI(filePathOrURI);
        fl.openDocument(fileURI);
        return Fla.getDoc();
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
    var moveItemToPos = function(item, x, y) {
        item.x = x || 0;
        item.y = y || 0;
        return item;
    };
    var ensureShapeValues = function(obj) {
        Ensure(obj.x != undefined, 'Object, ' + obj.name + ', is missing the x property');
        Ensure(obj.y != undefined, 'Object, ' + obj.name + ', is missing the y property');
        Ensure(obj.width != undefined, 'Object, ' + obj.name + ', is missing the width property');
        Ensure(obj.height != undefined, 'Object, ' +  obj.name + ', is missing the height property');
    }
    var alignItem = function(item) {
        ensureShapeValues(item);
        var moveTo = Fla.moveItemToPos;
        var _toLeftOf = function(matchItem) {
            ensureShapeValues(matchItem);
            moveTo(item, matchItem.x, item.y);
            return item;
        };
        var _toTopOf = function(matchItem) {
            ensureShapeValues(matchItem);
            moveTo(item, item.x, matchItem.y);
            return item;
        };
        var _toRightOf = function(matchItem) {
            ensureShapeValues(matchItem);
            moveTo(item, matchItem.x+matchItem.width-item.width, item.y);
            return item;
        };
        var _toBottomOf = function(matchItem) {
            ensureShapeValues(matchItem);
            moveTo(item, item.x, matchItem.y+matchItem.height-item.height);
            return item;
        };
        var _toCenterOf = function(matchItem) {
            ensureShapeValues(matchItem);
            var x = matchItem.x + matchItem.width/2 - item.width/2;
            var y = matchItem.y + matchItem.height/2 - item.height/2;
            moveTo(item, x, y);
            return item;
        };
        var _toTopLeftOf = function(matchItem) {
            ensureShapeValues(matchItem);
            _toTopOf(matchItem);
            _toLeftOf(matchItem);
            return item;
        }
        var _toTopRightOf = function(matchItem) {
            ensureShapeValues(matchItem);
            _toTopOf(matchItem);
            _toRightOf(matchItem);
            return item;
        };
        var _toBottomRightOf = function(matchItem) {
            ensureShapeValues(matchItem);
            _toBottomOf(matchItem);
            _toRightOf(matchItem);
            return item;
        };
        var _toBottomLeftOf = function(matchItem) {
            ensureShapeValues(matchItem);
            _toBottomOf(matchItem);
            _toLeftOf(matchItem);
            return item;
        };
        return {
            toLeftOf        : _toLeftOf,
            toTopLeftOf     : _toTopLeftOf,
            toTopOf         : _toTopOf,
            toTopRightOf    : _toTopRightOf,
            toRightOf       : _toRightOf,
            toBottomRightOf : _toBottomRightOf,
            toBottomOf      : _toBottomOf,
            toBottomLeftOf  : _toBottomLeftOf,
            toCenterOf      : _toCenterOf
        };
    };
    var matchItem = function(item) {
        var difference = null;
        var moveToPos = Fla.moveItemToPos;

        var _toPoseOf = function(matchItem, _item) {
            if(!_item) _item = item;
            _item.x = matchItem.x;
            _item.y = matchItem.y;
            return _item;
        };
        var _toHeightOf = function(matchItem, _item) {
            if(!_item) _item = item;
            difference = (matchItem.height/_item.height);
            _item.height = matchItem.height;
            return _item;
        };
        var _toWidthOf = function(matchItem, _item) {
            if(!_item) _item = item;
            difference = (matchItem.width/_item.width);
            _item.width = matchItem.width;
            return _item;
        };
        var _to = function(matchItem, keepAspectRatio, alignment, _item) {
            if(!_item) _item = item;
            var alignments = {
                LEFT            : 'toLeftOf',
                TOP_LEFT        : 'toTopLeftOf',
                TOP             : 'toTopOf',
                TOP_RIGHT       : 'toTopRightOf',
                RIGHT           : 'toRightOf',
                BOTTOM_RIGHT    : 'toBottomRightOf',
                BOTTOM          : 'toBottomOf',
                BOTTOM_LEFT     : 'toBottomLeftOf',
                CENTER          : 'toCenterOf'
            };
            if (!alignment) alignment = 'CENTER';
            var align = Ensure(alignments[alignment], alignment + ' must be valid [LEFT, TOP, RIGHT, BOTTOM, CENTER]');

            if (!keepAspectRatio) {
                _toPoseOf(matchItem, _item);
                _toHeightOf(matchItem, _item);
                _toWidthOf(matchItem, _item);
            } else {
                var maxWidth = matchItem.width;
                var maxHeight = matchItem.height;

                var scaleToWidth = function() {
                    _toWidthOf(matchItem, _item);
                    _item.height *= difference;
                };
                var scaleToHeight = function() {
                    _toHeightOf(matchItem, _item);
                    _item.width *= difference;
                }

                //should we match the width or the height?
                if (maxWidth < maxHeight) {
                    scaleToWidth();
                    if (_item.height > matchItem.height) scaleToHeight();
                } else {
                   scaleToHeight();
                   if (_item.width > matchItem.width) scaleToWidth();
                }
                Fla.alignItem(_item).toCenterOf(matchItem);
                Fla.alignItem(_item)[align](matchItem);
            };
            return _item;
        };
        return {
            toPosOf             : _toPoseOf,
            toHeightOf          : _toHeightOf,
            toWidthOf           : _toWidthOf,
            to                  : _to
        };
    };
    return {
        pwd                     : _pwd,
        print                   : print,
        getDoc                  : getDoc,
        openFile                : openFile,
        save                    : save,
        build                   : build,
        closeAndQuit            : closeAndQuit,
        importToLibrary         : importToLibrary,
        getScenes               : getScenes,
        processLibItem          : processLibItem,
        getLibItems             : getLibItems,
        getSceneByName          : getSceneByName,
        getLibItemByName        : getLibItemByName,
        setDocumentSize         : setDocumentSize,
        matchDocumentToInstance : matchDocumentToInstance,
        convertToSymbol         : convertToSymbol,
        moveItemToPos           : moveItemToPos,
        alignItem               : alignItem,
        matchItem               : matchItem
    };
};
