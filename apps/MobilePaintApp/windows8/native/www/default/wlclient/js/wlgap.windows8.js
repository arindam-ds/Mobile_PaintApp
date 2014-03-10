
/* JavaScript content from wlclient/js/wlgap.windows8.js in windows8 Common Resources */
/**
 * @license
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * Options Menu Implementation for Windows8. Please note: In Windows8 terminology,
 * Options Menu is actually the Application Bar.
 */
__WLOptionsMenu = function () {
    var isInit = false;
    var itemIdToItem = {};

    /**
     * Initializes the options menu. Must be called before using any other OptionsMenu function.
     * @param {Object} [options] Options for customizing the options menu init state opcaity - a decimal
     * number between 0.0 and 1.0 that represents the opacity factor. 1.0 is fully opaque, 0.0
     * is fully transparent.
     */

    // TODO remove opacity, has no meaning in Windows8

    this.init = function (options) {
        // validate arguments
        WL.Validators.validateOptions({
            opacity: 'number'
        }, options, 'WL.OptionsMenu.init options');
        var defaultOptions = {
            opacity: 1.0
        };
        WLJSX.Object.extend(defaultOptions, options);
        // call windows8 code
        WLJSX.remove('#WLappBar');
        wlAppBar = WLJSX.newElement('<div/>', {
            'data-win-control': 'WinJS.UI.AppBar',
            'id': 'WLappBar'
        });
        WLJSX.append(WLJSX.$('content'), wlAppBar);
        this.appBar = new WinJS.UI.AppBar(wlAppBar, {});
        isInit = true;
        // show application bar
        this.appBar.show();
    };

    /**
     * Return true if the OptionsMenu is initialized
     */
    function isInitialized() {
        if (!isInit) {
            WL.Logger.error("WL.OptionsMenu.init() must be called first.");
        }
        return isInit;
    }
    ;

    /**
     * Adds an item to the Options Menu. Can be called only after initializing the menu. Items are ordered on
     * the menu according to the order in which they were added. If you add a item with an existing ID, the
     * new item replaces the existing one. No more than 4 items allowed (redundant items are ignored).
     * 
     * @param id Mandatory string. Identifies the item.
     * 
     * @param callback Mandatory JavaScript function. The callback function that should be invoked when the
     *  user touches the item.
     * 
     * @param title Mandatory string. The title of the item.
     * 
     * @param options - Hash options object. Available options: image - The path to the item's image, starting
     *  from the application root directory. enabled - Boolean. Defines whether the item is enabled or disabled.
     * @return WL.OptionsMenu.Item
     */
    this.addItem = function (id, callback, title, options) {
        // error handling
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments(['string', 'function', 'string', 'object'], arguments, 'WL.OptionsMenu.addItem');
        WL.Validators.validateOptions({
            enabled: 'boolean',
            image: 'string'
        }, options, 'WL.OptionsMenu.addItem options');
        var defaultOptions = {
            enabled: true,
            image: null
        };
        WLJSX.Object.extend(defaultOptions, options);
        // no more than 4 items allowed.
        var itemCount = 0;
        for (var k in itemIdToItem) {
            itemCount++;
        }
        if (itemCount >= 4) {
            WL.Logger.error("WL.OptionsMenu.addItem: No more than 4 items allowed.");
            return;
        }

        // creates new item, add it to the hash, and call native code
        var newItem = new WL.OptionsMenu.Item(id, callback, title, defaultOptions.image, defaultOptions.enabled);
        itemIdToItem[id] = newItem;
        return newItem;
    };

    /**
     * Returns the item with the specified ID. Once you get an item, you can use it's set methods to change
     * the item's properties.
     * @param id Mandatory string. The ID of the required item.
     * @return A WL.OptionMenu.Item object. If the specified ID is not found, the method returns null.
     */
    this.getItem = function (id) {
        // error handling
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments(['string'], arguments, 'WL.OptionsMenu.getItem');
        // retrieves the item from the hash, and returns it
        var item = itemIdToItem[id];
        return (typeof item != 'undefined') ? item : null;
    };

    /**
     * Removes the item with the indicated ID from the menu. Can be called only after initializing the menu.
     * If no item is found with the specified ID, nothing happens.
     * <p>
     * If no item is found with the specified ID, nothing happens.
     * @param id Mandatory string. The ID of the item to be removed.
     */
    this.removeItem = function (id) {
        // error handling
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments(['string'], arguments, 'WL.OptionsMenu.removeItem');
        // if item exists - removes the item from the hash, and calls the native code.
        if (typeof itemIdToItem[id] != 'undefined') {
            delete itemIdToItem[id];
            this.appBar.hideCommands([id], true);
        }
    };

    /**
     * Removes all items from the menu. Can be called only after initializing the menu.
     */
    this.removeItems = function () {
        // error handling
        if (!isInitialized()) {
            return;
        }
        for (var k in itemIdToItem) {
            this.removeItem(k);
        }
    };

    /**
     * Enables/Disables the menu.
     * @param isEnabled boolean signifying the request
     */
    this.setEnabled = function (isEnabled) {
        // error handling
        if (!isInitialized()) {
            return;
        }
        WL.Validators.validateArguments(['boolean'], arguments, 'WL.OptionsMenu.setEnabled');
        // calls the native code
        //WL.OptionsMenu.getItem('a').appBarCommand.disabled = true
        this.appBar.disabled = !isEnabled;

    };

    /**
     * @return whether the menu is enabled.
     */
    this.isEnabled = function () {
        // error handling
        if (!isInitialized()) {
            return;
        }
        // calls Windows8 code. returning the oposite value since Worklight API is asking for if it is 
        // enabled and Windows8 is asking if it is disabled
        return !this.appBar.disabled;
    };

    /**
     * Set the menu visibility.
     * @param isVisible boolean signifying the request
     */
    this.setVisible = function (isVisible) {
        // error handling
        WL.Validators.validateArguments(['boolean'], arguments, 'WL.OptionsMenu.setVisible');
        // calls Windows8 show method
        this.appBar.show = true;
    };

    /**
     * @return whether the menu is visible.
     */
    this.isVisible = function () {
        // error handling
        if (!isInitialized()) {
            return;
        }
        // calls Windows8 code. returning the oposite value since Worklight API is asking for if it is 
        // visible and Windows8 is asking if it is hidden
        return !this.appBar.hidden;
    };
};

__WL.prototype.OptionsMenu = new __WLOptionsMenu;
WL.OptionsMenu = new __WLOptionsMenu;

/**
 * The item that represents an options menu item (i.e. application bar image button)
 */
WL.OptionsMenu.Item = WLJSX.Class.create({
    initialize: function (id, callbackFunction, title, imagePath, enabled) {
        this.id = id;
        this.callbackFunction = callbackFunction;
        this.title = title;
        this.imagePath = imagePath;
        this.enabled = enabled;
        this.imagePathPrefix = 'Resources/applicationBar/';

        wlAppBarButton = WLJSX.newElement('<button />', {
            'id' : this.id
        });
        WLJSX.append(WLJSX.$('WLappBar'), wlAppBarButton);
        this.appBarCommand = new WinJS.UI.AppBarCommand(document.getElementById(this.id), { id: id, icon: 'url(' + this.imagePathPrefix + imagePath + ')', label: title });
        document.getElementById(this.id).addEventListener('click', this.callbackFunction, false);

    },

    setTitle: function (title) {
        WL.Validators.validateArguments(['string'], arguments, 'WL.OptionsMenu.Item.setTitle');
        this.appBarCommand.label = title;

    },

    setImagePath: function (imagePath) {
        WL.Validators.validateArguments(['string'], arguments, 'WL.OptionsMenu.Item.setImagePath');
        this.appBarCommand.icon = this.imagePathPrefix + imagePath;
    },

    setEnabled: function (enabled) {
        WL.Validators.validateArguments(['boolean'], arguments, 'WL.OptionsMenu.Item.setEnabled');
        this.appBarCommand.disabled = !enabled;
    }
});
