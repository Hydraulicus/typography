'use strict'

var output_attr = {};
var output = Snap("#pattern_svg");
var fontsArr;
var currentFontIndex;
var changabletextS;

function initAnimation(obj) {
    var init_text = obj.init_text;
    const PATTERNS__MODE = "PATTERNS__MODE",
          GENERATOR__MODE = "GENERATOR__MODE",
          I__MODE = "I__MODE";

    var current_pattern = {
        N : 2,
        MODE : "",
        PROC_NUMBER : "0"
    };

    var myLoadList = obj.patterns,
        myLoadListWithPath = obj.patterns.map( el => obj.path2patterns + el),
        screensPatterns = []; //array of ajax patterns

    fontsArr = obj.fonts;
    currentFontIndex = 0;
    var butt__styleit = document.getElementById('styleit');
    var butt__refont = document.getElementById('refont');
    var inputText = document.querySelector('textarea');

    var status__bar = document.querySelector('#status__bar > span');
    status__bar.innerHTML="Status:";

    output.loadFilesDisplayOrdered( myLoadListWithPath, onAllLoaded, onEachLoaded );

    function initPattern(pattern_index_in_arr) {
        Snap('#pattern_svg').append( screensPatterns[ pattern_index_in_arr ] );
        output = Snap(obj.output);
        output_attr = {
            //width : output.getBBox().width,
            //height : output.getBBox().height

            //width : Snap.select('#pattern_svg').getBBox().width,
            //height : Snap.select('#pattern_svg').getBBox().height

            width : document.getElementById('pattern_svg').getBoundingClientRect().width,
            height : document.getElementById('pattern_svg').getBoundingClientRect().height
        };
        changabletextS = document.getElementById('changabletext');
        current_pattern.N = pattern_index_in_arr;
        current_pattern.MODE = document.getElementById('output_text').getAttribute('data-mode');
        current_pattern.PROC_NUMBER = document.getElementById('output_text').getAttribute('data-proc_number');
        status__bar.innerHTML=`Current pattern : ${myLoadList[current_pattern.N]}`;
    }

    function onAllLoaded( Pattern_array ) {
        status__bar.innerHTML=`Status: All patterns are loaded`;
        screensPatterns = Pattern_array;
        initPattern(current_pattern.N, current_pattern.PROC_NUMBER);
        typeWriter(init_text, 0, () => {butt__styleit.disabled = false; });
    }

    function onEachLoaded( frag, fileName ) {
        status__bar.innerHTML=`Set pattern ${fileName} is loaded`;
    }

    butt__styleit.onclick = function() { //clicked "Stile it!" button
        output.remove(); // remove current pattern
        current_pattern.N = ( (current_pattern.N + 1) <= myLoadList.length-1 ) ? current_pattern.N + 1 : 0;
        initPattern(current_pattern.N); // init new pattern
        setTimeout( () => {redrawOutput (inputText.value);}, 100 ); // fill new pattern
    };

    butt__refont.onclick = function() {
        function getStylePropertyValue(elem, prop) {
            return window.getComputedStyle(elem).getPropertyValue(prop);
        };

        let lineArr = Array.prototype.slice.call(document.getElementsByClassName('changeable__text_place'));
        let currentFont =  getStylePropertyValue(lineArr[0], "font-family");
        let currentN =  fontsArr.indexOf(currentFont);
        currentFontIndex = ( currentN+1 < fontsArr.length ) ? currentN+1 : 0;

        lineArr.forEach( el => { el.style.fontFamily = fontsArr[currentFontIndex]; } );
        setTimeout( () => {redrawOutput (inputText.value);}, 100 );
        status__bar.innerHTML=`Set font : ${fontsArr[currentFontIndex]}`;
    };

    if (inputText.addEventListener) {
        inputText.addEventListener('input', function() {
            // event handling code for sane browsers
            redrawOutput (inputText.value);
        }, false);
    } else if (inputText.attachEvent) {
        inputText.attachEvent('onpropertychange', function() {
            // IE-specific event handling code
            redrawOutput (inputText.value);
        });
    }


    function redrawOutput (txt) {

        switch (current_pattern.MODE) {
            case PATTERNS__MODE : {
                    PATTERN__MODE__PROCESSOR(txt, current_pattern.PROC_NUMBER);
                    fit_in (output, document.getElementById("group4scale"));
                };
                break;

            case GENERATOR__MODE : {};
                break;

            case I__MODE : {
                    changabletextS.remove();
                    I__MODE__PROCESSOR(txt, current_pattern.PROC_NUMBER);
                    //changabletextS = output.change_multitext(output_attr.width * 0.5, 20, txt, output_attr.width, output_attr.height, {"id" : "changabletext", "class" : "changeable__text_place", "text-anchor" : "middle", "font-family" : fontsArr[currentFontIndex], "font-size": "30px", cy:45, "fill": "#333366" });
                };
                break;

            default : {}
        }
    };


    function typeWriter(text, i, fnCallback) {
        butt__styleit.disabled = true;
        // check if text isn't finished yet
        if (i < (text.length)) {
            inputText.value = text.substring(0, i+1);
            // wait for a while and call this function again for next character
            setTimeout(function() {
                redrawOutput (inputText.value);
                typeWriter(text, i + 1, fnCallback)
            }, 50);
        }
        // text finished, call callback if there is a callback function
        else if (typeof fnCallback == 'function') {
            // call callback after timeout
            setTimeout(fnCallback, 700);
        }
    }

};//end of init function

function fit_in (target, object_txt) {//where (Snap.select("#...")), what
    var bbox = object_txt.getBBox();
    //var margin = bbox.width * 0.05;
    var margin = 0;
    //console.log("target", target.node, "object_txt ", object_txt, bbox);
    target.attr('viewBox', [bbox.x - margin, bbox.y - margin, bbox.width + margin*2, bbox.height + margin*2].join(' '));
}
