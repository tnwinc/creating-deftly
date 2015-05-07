#target Illustrator
'use strict';
if (!module || !module.Obj || !module.Ensure) {
    throw "Ai.js depends on Obj.js and Ensure.js, requiring them to be assigned to var Obj and Ensure first."
}
var Obj = module.Obj;
module.Ai = {
    getDoc          : function() {
        if (app.documents.length > 0){
            return app.activeDocument;
        } else {
            throw('ai.js: Please open an Illustrator file');
        }
    },
    hide            : function(layer){
        layer.visible = false;
        return(layer);
    },
    show            : function(layer){
        layer.visible = true;
        return(layer);
    },
    lock            : function(layer){
        layer.locked = true;
        return layer;
    },
    unlock          : function(layer){
        layer.locked = false;
        return layer;
    },
    layers          : function(docOrLyr) {
        var result = [];
        for (i = 0; i < docOrLyr.layers.length; i++) {
            result.push(docOrLyr.layers[i]);
        }
        return result;
    },
    getLockedLayers : function(docOrLyr) {
        return Obj(Ai.layers(docOrLyr)).filter(function(l) {
            if (l.locked) return l;
        });
    },
    bringToFront    : function(lyr) {
        var restoreLock = false;
        if(lyr.locked){
            lyr.unlock();
            restoreLock = true;
        };
        lyr.zOrder(ZOrderMethod.BRINGTOFRONT);
        if (restoreLock) lyr.lock();
        return lyr;
    },
    bringForward    : function(lyr, times) {
        var restoreLock = false;
        var lockedLayers = Ai.getLockedLayers(lyr.parent);
        if(lockedLayers.length){
            restoreLock = true;
            Obj(lockedLayers).forEach(Ai.unlock);
        };
        if (!times) times = 1;
        while (times > 0) {
            lyr.zOrder(ZOrderMethod.BRINGFORWARD);
            times--;
        }
        if (restoreLock) Obj(lockedLayers).forEach(Ai.lock);
        return lyr;
    },
    sendToBack      : function() {
        var restoreLock = false;
        if(lyr.locked){
            lyr.unlock();
            restoreLock = true;
        };
        lyr.zOrder(ZOrderMethod.SENDTOBACK);
        if (restoreLock) lyr.lock();
        return lyr;
    },
    sendBackward    : function(lyr, times) {
        var restoreLock = false;
        var lockedLayers = Ai.getLockedLayers(lyr.parent);
        if(lockedLayers.length){
            restoreLock = true;
            Obj(lockedLayers).forEach(Ai.unlock);
        };
        if (!times) times = 1;
        while (times > 0) {
            lyr.zOrder(ZOrderMethod.SENDBACKWARD);
            times--;
        }
        if (restoreLock) Obj(lockedLayers).forEach(Ai.lock);
        return lyr;
    },
    addGroupFromFile: function(docOrLyr, filePath, name) {
        var layer = docOrLyr;
        var restoreLock = false;
        var activeLayer = (docOrLyr.activeLayer); //check if doc
        if(activeLayer) layer = activeLayer;
        if (layer.locked) {
            restoreLock = true;
            Ai.unlock(layer);
        };
        var file = new File(filePath);
        var group = layer.groupItems.createFromFile(file);
        if(name) group.name = name;
        if (restoreLock) Ai.lock(layer);
        return group;
    },
    addLayer        : function(docOrLyr, name) {
        var result = docOrLyr.layers.add();
        result.name = name;
        return result;
    },
    point           : function(_x, _y) {
      return {x: _x, y: _y};
    },
    addCtrlRectProps: function(item){
        var rect = undefined;
        if (item.controlBounds) {
            rect = item.controlBounds;
        }
        if (item.artboardRect) {
            rect = item.artboardRect;
        }
        Ensure(rect, 'AddCtrlRectProps must be called on either a pageItem or an artboard.\nError Info - Object: ' + item + ', Name: ' + item.name);

        item.cLeft = rect[0];
        item.cTop = rect[1];
        item.cRight = rect[2];
        item.cBottom = rect[3];

        item.cX = rect[0];
        item.cY = rect[1];
        item.cPosition = Ai.point(item.cX, item.cY);
        item.cWidth = Math.abs(item.cRight - item.cX);
        item.cHeight = Math.abs(item.cBottom - item.cTop);

        Ensure((item.cLeft <= item.cRight) && (item.cTop >= item.cBottom), item + ': ' + item.controlBounds + ' must be a valid rect');

        return item;
    },
    getItemByName   : function(docOrLyr, name) {
        var item = docOrLyr.pageItems.getByName(name);
        if (item) return Ai.addCtrlRectProps(item);
    },
    setUpLayer      : function(lyr) {
        var init = function(lyr) {
            lyr.show = function() {
                return Ai.show(lyr);
            };
            lyr.hide = function() {
                return Ai.hide(lyr);
            };
            lyr.lock = function() {
                return Ai.lock(lyr);
            };
            lyr.unlock = function() {
                return Ai.unlock(lyr);
            };
            lyr.bringToFront = function() {
                return Ai.bringToFront(lyr);
            };
            lyr.bringForward = function(times) {
                return Ai.bringForward(lyr, times);
            };
            lyr.sendToBack = function() {
                return Ai.sendToBack(lyr);
            };
            lyr.sendBackward = function(times) {
                return Ai.sendBackward(lyr, times);
            };
            lyr.addGroupFromFile = function(filePath, name) {
                return Ai.addGroupFromFile(lyr, filePath, name);
            };
            lyr.addLayer = function(name) {
                return init(Ai.addLayer(lyr, name));
            };
            lyr.getItemByName = function(name) {
                return Ai.getItemByName(lyr, name);
            };
            var pageItems = [];
            var count = lyr.pageItems.length;
            var index = 0;
            while (index < count) {
                pageItems.push(Ai.addCtrlRectProps(lyr.pageItems[index]));
                index++;
            };
            if(pageItems) {
                lyr._items = {
                    list : pageItems,
                    names: Obj(pageItems).map(function(i) {return i.name}),
                    first: pageItems[0],
                    last : pageItems[count-1],
                    count: count
                };
            };
            var subLayers = Ai.layers(lyr);
            if (subLayers) {
                lyr._layers = {
                    list : subLayers,
                    names: Obj(subLayers).map(function(l) {return l.name}),
                    first: subLayers[0],
                    last : subLayers[subLayers.length-1],
                    count: subLayers.length
                };
            };
            Obj(subLayers).forEach(function(l) {init(l);});
            return lyr;
        };

        return init(lyr);
    },
    getAllLayers    : function(docOrLyr) {
        var result = [];
        Obj(Ai.layers(docOrLyr)).forEach(function(l) {
            Ai.setUpLayer(l);
            var pushLayers = function(lyr) {
                result.push(lyr);
                if (lyr._layers) Obj(lyr._layers.list).forEach(pushLayers);
            };
            pushLayers(l);
        });
        return result;
    },
    artboards       : function(doc) {
        var result = [];
        for (i = 0; i < doc.artboards.length; i++) {
            result.push(this.addCtrlRectProps(doc.artboards[i]));
        }
        return result;
    },
    getLayerByName  : function(layers, name){
        var result = null;
        Obj(layers).forEach(function(lyr){
            if (result != null) {
                return;
            };
            if (lyr.name.match(name) != null) {
                result = lyr;
            };
        });
        return result;
    },
    getArtboardIndex: function(artboards, name) {
        var result = undefined;
        Obj(artboards).forEach(function(ab, index){
            if (result) {
                return;
            } else if (ab.name == name) {
                result = index;
            }
        });
        return result;
    },
    exportJPEG      : function(doc, dest, scale){
        var fileSpec = new File(dest);
        var type = ExportType.JPEG;
        var exportOptions = new ExportOptionsJPEG();
        exportOptions.antiAliasing = false;
        exportOptions.artBoardClipping = true;
        exportOptions.blurAmount = 0.0; //0.0-2.0 Default 0.0
        exportOptions.artboardRange = 2; //<---------Not specified in docs
        exportOptions.matte = true;
        // exportOptions.matteColor = {red: 255, green: 255, blue: 255};
        exportOptions.optimization = true; //Should the image be optimized for web viewing? Default: true
        exportOptions.qualitySetting = 60; //Range: 0 to 100.
        exportOptions.saveAsHTML = true;
        exportOptions.typename = 'jpeg' //<---------Does this work in flash to set a logo class? Maybe we should extract this.
        exportOptions.horizontalScale = scale;
        exportOptions.verticalScale = scale;
        doc.exportFile( fileSpec, type, exportOptions );
    },
    exportPNG       : function(doc, dest, scale){
        var fileSpec = new File(dest);
        var type = ExportType.PNG24;
        var exportOptions = new ExportOptionsPNG24();
        exportOptions.antiAliasing = false;
        exportOptions.artBoardClipping = true;
        exportOptions.artboardRange = ''; //<---------Not specified in docs
        exportOptions.matte = true;
        // exportOptions.matteColor = {red: 255, green: 255, blue: 255};
        exportOptions.saveAsHTML = false;
        exportOptions.transparency = true;
        exportOptions.typename = 'png' //<---------Does this work in flash to set a logo class?
        exportOptions.horizontalScale = scale;
        exportOptions.verticalScale = scale;
        doc.exportFile( fileSpec, type, exportOptions );
    },
    exportSVG       : function(doc, dest, range){
        var fileSpec = new File(dest);
        var type = ExportType.SVG;
        var exportOptions = new ExportOptionsSVG();
        exportOptions.saveMultipleArtboards = true; //Default false
        exportOptions.artboardRange = range; //e.g. '1-2' or '1,5-7,9' An empty string will save all artboards
        exportOptions.compressed = false; //default false
        exportOptions.coordinatePrecision = 3; //1-7 Default 3
        exportOptions.cssProperties = SVGCSSPropertyLocation.STYLEATTRIBUTES;
        exportOptions.documentEncoding = SVGDocumentEncoding.ASCII;
        exportOptions.DTD = SVGDTDVersion.SVG1_1; //The SVG version to which the file should conform.
        exportOptions.embedRasterImages = false;
        exportOptions.fontSubsetting = SVGFontSubsetting.ALLGLYPHS;
        exportOptions.fontType = SVGFontType.CEFFONT //The type of font to included in the exported file. Default: SVGFontType.CEFFONT
        exportOptions.includeFileInfo = false;
        exportOptions.includeUnusedStyles = false;
        exportOptions.includeVariablesAndDatasets = false;
        exportOptions.optimizeForSVGViewer = false;
        exportOptions.preserveEditability = false;
        exportOptions.slices = false;
        exportOptions.sVGAutoKerning = false;
        exportOptions.sVGTextOnPath = false;
        exportOptions.typename = 'svg' //<---------Does this work in flash to set a logo class?
        doc.exportFile( fileSpec, type, exportOptions );
    },
    exportSWF       : function(doc, dest, range){
        var fileSpec = new File(dest);
        var type = ExportType.FLASH;
        var exportOptions = new ExportOptionsFlash();
        exportOptions.artClipping = ArtClippingOption.OUTPUTARTBOUNDS;
        exportOptions.saveMultipleArtboards = true; //default false
        exportOptions.artboardRange = range; //e.g. '1-2' or '1,5-7,9' An empty string will save all artboards
        // exportOptions.matteColor = {red: 255, green: 255, blue: 255};
        // exportOptions.backgroundLayers = []; //A list of layers to be included as the static background of the exported Flash frames.
        exportOptions.blendAnimation = BlendAnimationType.NOBLENDANIMATION;
        exportOptions.compressed = false; //default false
        exportOptions.convertTextToOutlines = true; //default false
        exportOptions.curveQuality = 7; //default 7
        exportOptions.exportAllSymbols = false; //default false
        exportOptions.exportStyle = FlashExportStyle.ASFLASHFILE;
        exportOptions.exportVersion = FlashExportVersion.FLASHVERSION9;
        exportOptions.frameRate = 12.0; //The display rate in frames per second. Range: 0.01–120.0. Default: 12.0
        exportOptions.ignoreTextKerning = false; //default false
        exportOptions.imageFormat = FlashImageFormat.LOSSLESS;
        exportOptions.includeMetadata = false; //If true, include minimal XMP metadata in the SWF file. Default: false
        exportOptions.jpegMethod = FlashJPEGMethod.Standard;
        exportOptions.jpegQuality = 6; //Level of compression to use. Range 1 to 10.Default: 3
        exportOptions.layerOrder = LayerOrderType.BOTTOMUP;
        exportOptions.looping = false;
        exportOptions.playbackAccess = FlashPlaybackSecurity.PlaybackLocal;
        exportOptions.preserveAppearance = false; //If true, preserve appearance. If false, preserve editability. Default: false
        exportOptions.readOnly = false;
        exportOptions.replacing = SaveOptions.SAVECHANGES//Default: SaveOptions.PROMPTTOSAVECHANGES; //This should overwrite without a warning
        exportOptions.resolution = 72; //The resolution in pixels per inch. Range: 72–2400. Default: 72
        exportOptions.typename = 'swf' //<---------Does this work in flash to set a logo class?
        doc.exportFile( fileSpec, type, exportOptions );
    },
    exportEPS       : function(doc, dest) {
        var fileSpec = new File(dest);
        var exportOptions = new EPSSaveOptions();
        exportOptions.saveMultipleArtboards = true; //default false
        exportOptions.artboardRange = ''; //e.g. '1-2' or '1,5-7,9' An empty string will save all artboards
        exportOptions.cmykPostScript = false;
        //exportOptions.compatibility = Compatibility.ILLUSTRATOR18;
        exportOptions.compatibleGradientPrinting = false; //If true, create a raster item of the gradient or gradient mesh so that PostScript Level 2 printers can print the object. Default: false
        exportOptions.embedAllFonts = true; //Embeds all fonts used in the document. Default: false
        exportOptions.embedLinkedFiles = true; //If true, linked image files are to be included in the saved document.
        exportOptions.flattenOuput = OutputFlattening.PRESERVEAPPEARANCE; //How should transparency be flattened for file formats older than Illustrator 9.
        exportOptions.includeDocumentThumbnails = true;
        exportOptions.overprint = PDFOverprint.PRESERVEPDFOVERPRINT; //Whether to preserve, discard, or simulate the overprint.
        exportOptions.postScript = EPSPostScriptLevelEnum.LEVEL2; //PostScript Language Level to use (Level 1 valid for file format version 8 or older). Default
        exportOptions.preview = EPSPreview.COLORTIFF;
        exportOptions.typename = 'eps'; //<---------Does this work in flash to set a logo class?
        doc.saveAs( fileSpec, exportOptions );
    },
    exportAI        : function(doc, dest, artboardIndex){
        //make a duplicate of the desired artboard at the zero index
        if (artboardIndex != null && artboardIndex != undefined) {
            Ensure((typeof artboardIndex) === 'number', 'exportAi:@artboardIndex: ' + artboardIndex + ' must be an integer');
            var artboards = doc.artboards;
            Ensure(artboardIndex < artboards.length, 'exportAi:@artboardIndex: ' + artboardIndex + ' must be a valid 0 based index. ' + doc + ' has ' + artboards.length + ' artboards. A valid input would be any integer between 0-' + artboards.length-1);
            var artboard = artboards[artboardIndex];
            var rect = artboard.artboardRect;
            artboards.insert(rect, 0);
            artboards[0].name = artboards[artboardIndex+1].name;
            Obj(artboards).forEach(function(ab, i) {
                if (artboards[0].name == artboards[i].name) return;
                var name = doc.artboards[i].name;
                Ai.hideLayerByName(doc, name);
            });
        }


        var fileSpec = new File(dest);
        var exportOptions = new IllustratorSaveOptions();
        //exportOptions.compatibility = Compatibility.ILLUSTRATOR18;
        exportOptions.compressed = true; //Default true
        exportOptions.embedICCProfile = false; //Default false
        exportOptions.embedLinkedFiles = false; //Default false
        exportOptions.fontSubsetThreshold = 100; //Range 0.0 - 100.0; Default 100
        exportOptions.pdfCompatible = true; //Default true
        exportOptions.typename = 'ai';
        doc.saveAs( fileSpec, exportOptions );
    },
    build           : function(doc, dest, scale, ext, artboardRange, artboardIndex) {
        if (!artboardRange) {
            artboardRange = '';
        }
        var realScale = scale*100;
        switch (ext.toUpperCase()) {
            case 'PNG':
                this.exportPNG(doc, dest, realScale);
                break;
            case 'JPG':
                this.exportJPEG(doc, dest, realScale);
                break;
            case 'EPS':
                this.exportEPS(doc, dest, realScale);
                break;
            case 'SVG':
                this.exportSVG(doc, dest, artboardRange);
                break;
            case 'SWF':
                this.exportSWF(doc, dest, artboardRange);
                break;
            case 'AI':
                this.exportAI(doc, dest, artboardIndex);
            default:
                this.exportJPEG(doc, dest, realScale);
                break;
        }
    },
    openFile        : function(filePath, colorSpace) {
        if(!colorSpace) {
            colorSpace = DocumentColorSpace.RGB
        } else {
            colorSpace = DocumentColorSpace[colorSpace.toUpperCase()];
        }
        file = new File(filePath, colorSpace);
        app.open(file);
        return this.getDoc();
    },
    save            : function(doc) {
        doc.save();
    },
    closeAndQuit           : function(doc) {
        doc.close(SaveOptions.DONOTSAVECHANGES);
        app.quit();
    },
    hideLayerByName        : function(docOrLayer, regEx) {
        var theLayer = this.getLayerByName(this.layers(docOrLayer), regEx);
        this.hide(theLayer);
    },
    showLayerByName        : function(docOrLayer, regEx) {
        var theLayer = this.getLayerByName(this.layers(docOrLayer), regEx);
        this.show(theLayer);
    },
    getArtboardIndexByName : function(doc, regEx) {
        return this.getArtboardIndex(this.artboards(doc), regEx);
    },
    setActiveArtboardByName: function(doc, regEx) {
        var index = this.getArtboardIndexByName(doc, regEx);
        if (index == undefined) {
            return undefined;
        }
        doc.artboards.setActiveArtboardIndex(index);
        return this.addCtrlRectProps(doc.artboards[index]);
    },
    setGlobalColorByName   : function(doc, name, R, G, B) {
        var theSwatch = doc.swatches.getByName(name);
        Ensure(theSwatch.color.spot, name + ' must be a global swatch.');
        var theColor = new RGBColor();
        theColor.red = R;
        theColor.green = G;
        theColor.blue = B;
        theSwatch.color.spot.color = theColor;
    },
    newLayer               : function(docOrLayer, name) {
        return Ai.setUpLayer(Ai.addLayer(docOrLayer, name));
    },
    moveItemToPos          : function(item, x, y) {
        Ai.addCtrlRectProps(item);
        item.translate(-item.cX, -item.cY);
        item.translate(x, y);
        return item;
    },
    alignItem              : function(item) {
        var moveTo = Ai.moveItemToPos;
        var setUpItems = function(item1, item2) {
            Ai.addCtrlRectProps(item1);
            Ai.addCtrlRectProps(item2);
        };
        var _toLeftOf = function(matchItem) {
            setUpItems(item, matchItem);
            moveTo(item, matchItem.cLeft, item.cTop);
            return item;
        };
        var _toTopOf = function(matchItem) {
            setUpItems(item, matchItem);
            moveTo(item, item.cLeft, matchItem.cTop);
            return item;
        };
        var _toRightOf = function(matchItem) {
            setUpItems(item, matchItem);
            moveTo(item, matchItem.cRight-item.cWidth, item.cTop);
            return item;
        };
        var _toBottomOf = function(matchItem) {
            setUpItems(item, matchItem);
            moveTo(item, item.cLeft, matchItem.cBottom+item.cHeight);
            return item;
        };
        var _toCenterOf = function(matchItem) {
            setUpItems(item, matchItem);
            var x = matchItem.cX + matchItem.cWidth/2 - item.cWidth/2;
            var y = matchItem.cY - matchItem.cHeight/2 + item.cHeight/2;
            moveTo(item, x, y);
            return item;
        };
        return {
            toLeftOf  : _toLeftOf,
            toTopOf   : _toTopOf,
            toRightOf : _toRightOf,
            toBottomOf: _toBottomOf,
            toCenterOf: _toCenterOf
        };
    },
    matchItem              : function(item) {
        var setUpItems = function(item1, item2) {
            Ai.addCtrlRectProps(item1);
            Ai.addCtrlRectProps(item2);
        };
        var difference = null;
        var moveToPos = Ai.moveItemToPos;

        var _toPoseOf = function(matchItem, _item) {
            if(!_item) _item = item;
            Ai.addCtrlRectProps(matchItem);
            moveToPos(_item, matchItem.cX, matchItem.cY);
            return _item;
        };
        var _toHeightOf = function(matchItem, _item) {
            if(!_item) _item = item;
            setUpItems(matchItem, _item);
            var diff = _item.cHeight - _item.height;
            difference = ((matchItem.cHeight - diff)/_item.cHeight);
            _item.height = matchItem.cHeight - diff;
            return _item;
        };
        var _toWidthOf = function(matchItem, _item) {
            if(!_item) _item = item;
            setUpItems(matchItem, _item);
            var diff = _item.cWidth - _item.width
            difference = ((matchItem.cWidth - diff)/_item.cWidth);
            _item.width = matchItem.cWidth - diff;
            return _item;
        };
        var _to = function(matchItem, keepAspectRatio, alignment, _item) {
            if(!_item) _item = item;
            setUpItems(matchItem, _item);
            var alignments = {
                LEFT  : 'toLeftOf',
                TOP   : 'toTopOf',
                RIGHT : 'toRightOf',
                BOTTOM: 'toBottomOf',
                CENTER: 'toCenterOf'
            };
            if (!alignment) alignment = 'CENTER';
            var align = Ensure(alignments[alignment], alignment + ' must be valid [LEFT, TOP, RIGHT, BOTTOM, CENTER]');

            if (!keepAspectRatio) {
                _toPoseOf(matchItem, _item);
                _toHeightOf(matchItem, _item);
                _toWidthOf(matchItem, _item);
            } else {
                var maxWidth = matchItem.cWidth;
                var maxHeight = matchItem.cHeight;

                var scaleToWidth = function() {
                    _toWidthOf(matchItem, _item);
                    _item.height *= difference;
                    setUpItems(matchItem, _item);
                };
                var scaleToHeight = function() {
                    _toHeightOf(matchItem, _item);
                    _item.width *= difference;
                    setUpItems(matchItem, _item);
                }

                //should we match the width or the height?
                if (maxWidth < maxHeight) {
                    scaleToWidth();
                    if (_item.cHeight > matchItem.cHeight) scaleToHeight();
                } else {
                   scaleToHeight();
                   if (_item.cWidth > matchItem.cWidth) scaleToWidth();
                }
                Ai.alignItem(_item).toCenterOf(matchItem);
                Ai.alignItem(_item)[align](matchItem);
            };
            return _item;
        };
        return {
            toPosOf             : _toPoseOf,
            toHeightOf          : _toHeightOf,
            toWidthOf           : _toWidthOf,
            to                  : _to
        };
    },
    replaceSymbolItemWithSymbol  : function(doc, symbolItem, symbol) {
        Ensure(symbolItem.typename === 'SymbolItem', 'Ai.replaceSymbolItemWithSymbol: argument1 must be a SymbolItem');
        Ensure(symbol.typename === 'Symbol', 'Ai.replaceSymbolItemWithSymbol: argument2 must be a Symbol');
        
        var tmpLyr = Ai.newLayer(doc, 'tmpLyr');
        var targetSize = tmpLyr.symbolItems.add(symbolItem.symbol);
        var replacementSymbol = tmpLyr.symbolItems.add(symbol);
        Ai.matchItem(replacementSymbol).to(targetSize, true, 'CENTER');
        var resizedReplacementSymbol = doc.symbols.add(replacementSymbol, SymbolRegistrationPoint.SYMBOLCENTERPOINT);
        tmpLyr.remove();
        var symbolName = symbol.name;
        symbol.name = symbolName + '_original';
        resizedReplacementSymbol.name = symbolName;
        symbolItem.symbol = resizedReplacementSymbol;
    },
    removeHiddenPageItems        : function(docLayerOrGroup) {
        var count = docLayerOrGroup.pageItems.length;
        var index = 0;
        while(index < count){
            if (docLayerOrGroup.pageItems[index].hidden){
                docLayerOrGroup.pageItems[index].remove();
                index--;
                count--;
            }
            index++;
        }
    },
    makeSymbol                   : function(doc, item, name, registrationPoint) {
        if (!registrationPoint) {
            registrationPoint = 'SYMBOLCENTERPOINT';
        }
        var symbol = doc.symbols.add(item, SymbolRegistrationPoint[registrationPoint]);
        if (name){
            symbol.name = name;
        }
        return(symbol);
    },
};