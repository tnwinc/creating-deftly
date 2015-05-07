#Ensure.js

#JSON

#Fla

**print(message, context): void**

    @message : What you want to say
    @context : OPTIONAL but should supply either a method name or something that provides context

    Example uses:
    Fla.print('Imported ' + filePath, 'importToLibrary');
    // fla_build_lib:importToLibrary: Imported /Users/me/desktop/BG_Intro_Chart.ai

**getDoc()**

    Returns the active document.

**openFile(filePath)**

    Returns: active document dom
    Opens the provided file and returns the active document
    Example uses:
    var doc = Fla.openFile('my/path/to/file.fla');

**save(document)**

    saves the document

**build(document, destination, fileName, extension) void**

    Publishes the file with the correct extension
    @document    : The active document
    @destination : the directory path without the file name or an ending /
    @fileName    : Just the file name, no path-to or extension
    @extension   : either 'SWF' or 'MP4'

    Example uses:
    Fla.build(fl.getDocumentDOM(), '/Users/me/desktop', 'output', 'mp4');
    Fla.build(doc, tempDir, 'output', 'swf');

**closeAndQuite(document)**

    Closes and quites flash without saving

**importToLibrary(document, filePath, ui)**

    @document : The active document
    @filePath : The full path to the file including the extension.
                Use an empty string if you plan on setting ui to true.
    @ui       : OPTIONAL: Boolean to let the user browse for a file. Default: false

    Example uses:
    Fla.importToLibrary(doc, '/Users/me/desktop/BG_Intro_Chart.ai');

**getScenes(doc)**

    Returns an array of scene objects with these properties:
    _index         : The 0 based index of the scene in the document
    _name          : The name of of the scene
    _select()      : Opens the scene for editing
                     Returns the scene's timeline
    _layers        : Returns an object with the following keys
                     list  : Array of layer objects
                     names : Array of layer names
                     first : First layer object
                     last  : Last layer object
                     count : number of layers in this symbol
    _edit()        : Alias for _select() above
    _rename(name)  : Renames the scene to @name
                     Returns the scene's timeline

**getSceneByName(document, name)**

    Filters the results of the above method getScenes(doc)
    Selects for Editing (gives focus)
    Returns the first scene whos name matches @name exactly.

    @document : The active document
    @name     : String of the name to search for, must be an exact match.

**getLibItems(document)**

    Returns an array of library item objects with added properties
    See Library Items for the complete list of those properties

**getLibItemByName(document, name)**

    Filters the results of the above method,
    Selects in library and Returns the first occurence of an item whos name matches @name exactly.

    @document : The active document
    @name     : String of the name to search for, must be an exact match.

    Example use:
    Fla.getLibItemByName(doc, '_bg');
    var libItemPath = Fla.getLibItemByName(doc, '_bg');

**Layers**

    Both getScenes(doc) & getLibItems(doc) modify layer objects with the following keys
    .index
        0 based index of the layer on the timeline (top-to-bottom)
    .keyframes
        Returns an array of keyframe [frame objects] in that layer
    .show()
        Sets the layer's visibilty to true
        Returns the Layer
    .hide()
        Sets the layer's visibility to false
        Returns the layer
    .lock()
        Lockes the layer
        Returns the Layer
    .unlock()
        Unlocks the layer
        Returns the layer
    .select()
        Makes the layer current in the timeline
        Returns the layer
    .insertKeyframe(index)
        inserts a keyframe at @index if there isn't one already
        Returns the Frame Object

**Library Items**

    Using getLibItems(document), or getLibItemByName(document, name),
    will add the following keys to Library Item Objects with the exception of
    fonts

    _index
        The 0 based index of the item in the library

    _name
        The name of of the item without any path information

    _path
        The path to the item without the name
        Root items will return an empty string ''

    _select()
        Selects the item in the library
        Returns self

    _rename(name)
        Renames the item's library name
        This cannot be used to move the item
        Returns self

    _moveToFolder(destination, replace)
        Moves the item to the destination in the library.
        Use an empty string '' for destination to place items in the root
        @destingation : String library path, empty string for root
        @replace      : Boolean to auto replace items with conflicting names

    If Symbol

    _edit()
        Selects the item for editing
        Modifies all layers to have the keys found in Layers above
        Returns the object's timeline

    _layers()
        Selects the item, opens for Editing
        Modifies all layers to have the keys found in Layers above
        Returns an object with the following keys
        list  : Array of layer objects
        names : Array of layer names
        first : First layer object
        last  : Last layer object
        count : Number of layers in this symbol

    _addToStage(x, y)
        Selects the item in the library and puts an instance of it on the stage
        @x: Optional x position to place the instance on the stage, Default: 0
        @y: Optional y position to place the instance on the stage, Default: 0
        Returns the symbol instance from the stage

    _setSymbolType(type)
        @type: Enum String: ['MOVIECLIP', 'GRAPHIC', 'BUTTON']
        If changing to a MOVIECLIP, the following methods are also added and become available.
        Returns self

    If Movie Clip

    _setClass(name)
        Sets the item's .linkageExportForAS to true
        Assigns the class name @name
        Returns self

    _removeClass()
        Removes the class name
        Sets the item's .linkageExportForAS to false
        Returns self

**setDocumentSize(document, width, height)**

    Resizes the @document stage to the floor value of @width & @height
    Values are floored because they represent pixels
    Returns @document

**matchDocumentToInstance(document, instance)**

    Resizes @document to the width and height of @instance
    Returns @document
