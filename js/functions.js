"use strict";

Snap.plugin(function (Snap, Element, Paper, global) {

    var loadedscreensPatterns = [];

    function addLoadedFrags(whichSVG, fragList, runWhenFinishedFunc, returnVar) {
        // This is called once all the loaded frags are complete
        for (var myEl, count = 0; count < fragList.length; count++) {
            loadedscreensPatterns.push(fragList[count]);
        }
        runWhenFinishedFunc(loadedscreensPatterns);
    }

    Paper.prototype.loadFilesDisplayOrdered = function (list, afterAllLoadedFunc, onEachElementLoadFunc) {
        var image,
            fragLoadedCount = 0,
            listLength = list.length,
            fragList = [],
            whichSVG = this;

        for (var count = 0; count < listLength; count++) {
            (function () {
                var whichEl = count,
                    fileName = list[whichEl],
                    image = Snap.load(fileName, function (loadedFragment) {
                    fragLoadedCount++;
                    onEachElementLoadFunc(loadedFragment, fileName);
                    fragList[whichEl] = loadedFragment;
                    if (fragLoadedCount >= listLength) {
                        addLoadedFrags(whichSVG, fragList, afterAllLoadedFunc);
                    }
                });
            })();
        }
    };
});

/*
** Remove element by id
** http://stackoverflow.com/questions/3387427/remove-element-by-id
 */
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};