#Ensure.js

#JSON

#Obj(object)

**isObject()**

    Returns: Boolean

    Example uses:
    Obj([1,2,3]).isObject() //false
    Obj({name: 'Me'}).isObject() //true

**isArray()**

    Returns: Boolean

    Example uses:
    Obj([1,2,3]).isArray() //true
    Obj({name: 'Me'}).isArray() //false

**keys()**

    Returns: Array

    Example uses:
    Obj([1,2,3]).keys() // 0,1,2
    Obj({name: 'me'}).keys() // name

**forEach(callback)**

    Returns: Callback(value, index)

    @callback: Function to be run on each key in an object

    Example uses:
    Obj([1,2,3]).forEach(function(item, index) {
        alert(item + ' - ' + index);
    });
    // 1 - 0
    // 2 - 1
    // 3 - 2
    Obj({name: 'me'}).forEach(function(value, key) {
        alert(value + ' - ' + key);
    });
    // me - name

**filter(callback)**

    Returns: Array

    @callback: Function to evaluate on each item in the object.
               If the functions' return value is truthy, that
               value is pushed into the returned array.

    Example uses:
    alert(Obj([1,2,3]).filter(function(n) {
        if (n > 1) return n;
    }));
    //[2,3]
    alert(Obj({name: 'me', age: 25, race: 'man'}).filter(function(value, key) {
        if (key != 'age') return value;
    }));
    //['me','man']

**map(callback)**

    Returns: Array

    @callback: Function who's returned value will populate the new array

    Example uses:
    alert(Obj([{name: 'me'}, {name: 'them'}]).map(function(i) {
        return (i.name);
    }));
    // ['me', 'them']

**indexOf(value)**

    Returns: Integer index or -1

    @value: the value in the array or object you are looking for

    Example uses:
    alert(Obj(1,2,3).indexOf(2));
    // 1
    alert(Obj({firstName: 'Tom', lastName: 'Peter'}).indexOf('Tom'));
    //firstName

#Ai

**getDoc()**

    Returns: active document

**openFile(filePath, colorSpace)**

    Returns: active document
    Opens the provided file and returns the active document
    @filePath  : The full path to the file
    @colorSpace: Either 'RGB' or 'CMYK', DEFAULT: 'RGB'

    Example uses:
    var doc = Ai.openFile('my/path/to/file.ai');
    var otherDoc = Ai.openFile('my/path/to/otherFile.ai', 'CMYK');

**save(document)**

    saves the document

**build(document, destination, scale, extension, artboardRange, artboardIndex)**

    Exports the file with the correct extension and artboard range.
    @document
        The document you want to build
    @destination
        The path + output file name as string
    @scale
        - does not yet use scale -
    @extension
        Any of the following ['PNG', 'JPG', 'EPS', 'SVG', 'SWF', 'AI']
    @artboardRange
        OPTIONAL
        Examples '5', '1-2', '1,5-7,9' An empty string will save all artboards.
    @artboardIndex
        OPTIONAL
        For AI build, artboardIndex should be the zero based index Int
        DEFAULT is the first artboard

    Example uses:
    Ai.build(doc, './output.png', 1, 'PNG');
    Ai.build(doc, name, 1, 'SWF', index+1);

**closeAndQuit(document)**

    Closes the document without saving changes and quits Illustrator

**setUpLayer(layer)**

    Returns: Layer

    Modifies the layer along with all of it's sublayers with these functions:
    .show()
        Returns self
        makes the layer Visible
    .hide()
        Returns self
        makes the layer Invisible
    .lock()
        Returns self
        Locks the layer
    .unlock()
        Returns self
        Unlocks the layer
    .brinToFront()
        Returns self
        Changes the zOrder to put it at the top of the stack
    .bringForward(times)
        Returns self
        Move up stack @times Default 1
    .sendToBack()
        Returns self
        Changes the zOrder position to the end of the stack
    .sendBackward(times)
        Returns self;
        Move down stack @times Default 1
    .addGroupFromFile(filePath, name)
        Returns Group Item
        Adds group from @filePath with Optional @name
    .addLayer(name)
        Returns Sub Layer [Layer Object]
        Creates a sublayer with @name
    .getItemByName(name)
        Returns PageItem
        Gets first element in the collection with @name

    If has pageItems
    ._items    - An object with the following keys
        .list  - Array of PageItems in layer
        .names - Array of PageItem names
        .first - First PageItem layer object
        .last  - Last PageItem layer object
        .count - Number of PageItems

    If has sublayers
    ._layers   - An object with the following keys
        .list  - Array of sublayers layer objects
        .names - Array of sublayer names
        .first - First sublayer layer object
        .last  - Last sublayer layer object
        .count - Number of sublayers
_Note: .\_layers does not include shapes, images, or groups_

    Example uses:
    var doc = Ai.getDoc();
    var layers = Ai.layers(doc)
    Ai.setUpLayer(layers[0]).sendToBack().bringForward(2);
    //The top most layer in the document will be moved to the end of the stack and then up two.
    
**layers(document or layer)**

    Returns: Array

    If the document or layer has layers, an array of those layers is returned

**getAllLayers(document or layer)**

    Returns: Array of layer objects within the document or layer

    Recurses through all layers and sublayers, setting them up and returning them in an array.

    Example uses:
    var doc = Ai.getDoc();
    var myLayer = Ai.getLayerByName(Ai.getAllLayers(doc), 'myLayer');

**getLockedLayers(document or layer)**

    Returns: Array
    Takes in a document or layer and returns on array of layer objects who's
    .locked parameter was set to true.

    Usefull for keeping track of what layers were locked before performing an oporation and then easily restoring them afterward.

**artboards(document)**

    needs documentation

**getLayerByName(layers, regEx)**

    needs documentation

**getArtboardIndex(artboards, regEx)**

  - *Remember that this returns a 0 based index. So if you are calling something that requires a range, you will need to add 1 to the index value.*

**hide(layer)**

    needs documentation

**show(layer)**

    needs documentation

**lock(layer)**

    needs documentation

**unlock(layer)**

    needs documentation

**bringToFront(layer)**

    Changes the layer's zOrder position to be the first in the stack

**bringForward(layer, times)**

    Moves the layer's zOrder position up @times Default: 1

**sendToBack(layer)**

    Changes the layer's zOrder position to be last in the stack

**sendBackward(layer, times)**

    Moves the layer's zOrder position down @times Default: 1

**addGroupFromFile(documentOrLayer, filePath)**

    Returns: Group Item
    Adds the @filePath as a groupItem in @DocumentOrLayer

    Example uses:
    var doc = Ai.getDoc();
    var myImage = Ai.addGroupFromFile(doc, '/path/to/my/file.svg')

**getItemByName(documentOrLayer, name)**

    Returns: PageItem
    Gets the first element in the collection with the specified name.

**exportJPEG(document, destination, scale)**

    needs documentation  - does not yet use scale

**exportPNG(document, destination, scale)**

    needs documentation  - does not yet use scale

**exportSVG(document, destination)**

    needs documentation

**exportSWF(document, destination, artboard_range)**

    @document      : usually the active document
    @destination   : the path + output file name as string
    @artboard_range: e.g. '5' or '1-2' or '1,5-7,9' An empty string will save all artboards.

**exportEPS(document, destination)**

    needs documentation

**exportAI**(document, destination, artboardIndex)

    @document
        The document you want to saveAs
    @destination
        The path + output file name as string
    @artboardIndex
        Integer, must be a valid 0 based artboard index

**hideLayerByName(DocumentOrLayer, regEx)**

    needs documentation

**showLayerByName(DocumentOrLayer, regEx)**

    needs documentation

**getArtboardIndexByName(doc, regEx)**

    needs documentation

**setActiveArtboardByName(doc, regEx)**

    needs documentation

**setGlobalColorByName(doc, name, R, G, B)**

    @doc : the active document
    @name: String name must match the global swatch's name exactly
    @R   : The Red value of the desired color
    @G   : The Green value of the desired color
    @B   : The Blue value of the desired color

    Example uses:
    Ai.setGlobalColorByName(doc, 'Color_1', 255, 255, 0);

**newLayer(documentOrLayer, name)**

    Returns: Layer Object
    Creates a new layer inside the @documentOrLayer with name @name
    returns the layer after setting it up with everything from Ai.setUpLayer

    Example Uses:
    var doc = Ai.getDoc();
    Ai.newLayer(doc, 'MyNewLayer');

**moveItemToPos(item, x, y)**

    Returns: @item

    moves the @item to position @x, @y
    Behavior may be a little unpredictable when there are multiple artboards

**alignItem(item)**

    Returns Object with the follwing keys

    .toLeftOf(matchItem)
        aligns @item's leftmost side to the leftmost side of @matchItem
        calculated using both item's control bounds
        Returns @item
    .toTopOf(matchItem)
        aligns @item's top position to the top of @matchItem
        calculated using both item's control bounds
        Returns @item
    .toRightOf(matchItem)
        aligns @item's Rightmost side to the Rightmost side of @matchItem
        calculated using both item's control bounds
        Returns @item
    .toBottomOf(matchItem)
        aligns @item's bottom position to the bottom of @matchItem
        calculated using both item's control bounds
        Returns @item

**matchItem(item)**

    Returns Object with the follwing keys

    .toPosOf(matchItem)
        matches @item's position of @matchItem's position
        calculated using both item's control bounds
        Returns @item
    .toHeightOf(matchItem)
        matches @item's height to that of @matchItem
        calculated using both item's control bounds
        Returns @item
    .toWidthOf(matchItem)
        matches @item's width to that of @matchItem
        calculated using both item's control bounds
        Returns @item
    .to(matchItem, keepAspectRatio)
        matches @item to the position and size of @matchItem
        If @keepAspectRatio is true (Default: false),
            it will choose a best fit and center within @matchItem
        calculated using both item's control bounds
        Returns @item

    Example uses:
    Ai.matchItem(myItem).to(myOtherItem, true);

**replaceSymbolItemWithSymbol(doc, symbolItem, symbol)

    Returns VOID
    @doc        : the active document
    @symbolItem : any SymbolItem (symbol instance) on the artboard
    @symbol     : any Symbol from the symbols library

    Example uses:
    Ai.replaceSymbolItemWithSymbol(doc, placeholder, logo) //Will replace a placeholder symbol on the stage with a logo symbol from the library
    //For rotations and other transformations other than position and size, group the symbol and apply rotations and scew transformations to the group.

**removeHiddenPageItems(docLayerOrGroup)

    Returns VOID
    @docLayerOrGroup : A document, layer, or group item

    Iterates through all the pageItems in the @docLayerOrGroup and removes Hidden pageItems

    Example uses:
    Ai.removeHiddenPageItems(logoGroup);

**makeSymbol(doc, item, name, registrationPoint)

    Returns Symbol (A document symbol, not a symbolItem instance)

    @doc              : the active document
    @item             : any selection or pageItem
    @name             : OPTIONAL - the name to give to the symbol
    @registrationPoint: OPTIONAL - Valid Values are...
                        SYMBOLTOPLEFTPOINT
                        SYMBOLTOPMIDDLEPOINT
                        SYMBOLTOPRIGHTPOINT
                        SYMBOLMIDDLELEFTPOINT
                        SYMBOLCENTERPOINT <-- DEFAULT
                        SYMBOLMIDDLERIGHTPOINT
                        SYMBOLBOTTOMLEFTPOINT
                        SYMBOLBOTTOMMIDDLEPOINT
                        SYMBOLBOTTOMRIGHTPOINT
