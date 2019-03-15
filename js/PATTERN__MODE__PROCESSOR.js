"use strict";

function PATTERN__MODE__PROCESSOR(txt, MODE) {
    /* MODE is conteined in data-proc_number of pattern.svg file
    ** it discribe what way to implement text in to placess in patters
    */
    var words = txt.split(/\s+/);
    var lineArr = Array.prototype.slice.call(document.getElementsByClassName('changeable__text_place'));
    lineArr.forEach(function (el) {
        el.textContent = "";
    });

    switch (MODE) {
        case "0":
            {
                /*
                ** In this pattern 3 lines
                ** in 1st and last - one word, other words in 2nd line
                 */
                lineArr[0].textContent = words[0];
                lineArr[2].textContent = words[words.length - 1];
                words = words.slice(1, words.length - 1);
                lineArr[1].textContent = words.join(" ");
            };
            break;

        case "1":
            {
                /*
                ** In this pattern 4 lines
                ** words  are allocated equally
                ** and stretch lines to width horizontaly
                 */
                var subarrays = chunkify(words, 4, true);
                subarrays.forEach(function (el, i) {
                    lineArr[i].textContent = el.join(" ");
                });

                var lines = Snap.selectAll(".changeable__text_place");
                var widths = [];
                lines.forEach(function (el, i) {
                    el.attr({ "transform": "matrix( 1, 0, 0, 1, 1, 0)" });
                    var BBox = el.getBBox();
                    widths[i] = BBox.width;
                    var scale_factor = output_attr.width / BBox.width;
                    el.attr({ "transform": "matrix( " + scale_factor + ", 0, 0, 1, " + BBox.x * -1 * scale_factor + ", 0)" });
                });
            };
            break;

        case "2":
            {
                /*
                 ** In this pattern 4 lines
                 ** words  are allocated equally
                 ** and change font-size of lines for fit into width
                 */

                var _subarrays = chunkify(words, 4, true);
                _subarrays.forEach(function (el, i) {
                    lineArr[i].textContent = el.join(" ");
                });

                var _lines = Snap.selectAll(".changeable__text_place");
                //var widths = [];
                _lines.forEach(function (el, i) {

                    var maxFontSize = 56; //px
                    var max_scale_factor = 8;
                    //get size of word in pixels
                    var abc = el.node.textContent;
                    var output = Snap("#output_text"),
                        temp = output.text(0, 20, abc).attr(el.attr()).attr({ "font-size": maxFontSize + "px" });
                    var size_ = temp.getBBox();
                    temp.remove();

                    var scale_factor = output_attr.width / size_.width;
                    //var scale_factor = 1;
                    //console.log(output_attr);
                    if (scale_factor > max_scale_factor) scale_factor = max_scale_factor;

                    var calculatedFontSize = maxFontSize * scale_factor;
                    var calculatedDY = i == 0 ? 0 : calculatedFontSize * 0.7 + 30; //shifting of next line. 1st line remain at their place

                    el.attr({ "font-size": calculatedFontSize, "dy": calculatedDY + "px" }); //set atributes to each  <tspan>
                    //console.log (el.node.textContent , size_.height, scale_factor);
                });

                var bbox = _lines.getBBox();
                var margin = bbox.width * 0.05;
                //var margin = 0;
                //console.log( bbox);
                Snap.select("#lines__cover").attr('viewBox', [bbox.x - margin, bbox.y - margin, bbox.width + margin * 2, bbox.height + margin * 2].join(' '));
            };

            break;

        default:
            {}
    }
}

/*
** Splitting a JS array into N arrays
** http://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
 */
function chunkify(a, n, balanced) {

    if (n < 2) return [a];

    var len = a.length,
        out = [],
        i = 0,
        size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    } else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    } else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0) size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));
    }

    return out;
}

//
//Snap.plugin(function (Snap, Element, Paper, glob) {
//    Paper.prototype.fitted_multitext = function (x, y, txt, max_width, max_height, attributes) {
//
//        var abc = txt;
//        var output = Snap("#output_text"),
//            temp = output.text(0, 20, txt).attr(attributes);
//        temp.attr({"fill":"none", "stroke":"blue"});
//        var size_= temp.getBBox(),
//            letter_width = size_.width / abc.length;
//        temp.remove();
//
//        var words = txt.split(" ");
//        var width_so_far = 0, current_line=0, lines=[''];
//        for (var i = 0; i < words.length; i++) {
//
//            var l = words[i].length;
//            if (width_so_far + (l * letter_width) > max_width) {
//                lines.push('');
//                current_line++;
//                width_so_far = 0;
//            }
//            width_so_far += l * letter_width;
//            lines[current_line] += words[i] + " ";
//        }
//
//        var t = this.text(x,y,lines).attr(attributes);
//        var font__ratio = (current_line - 3) * 4,
//            dy__ratio = ( current_line * 0.1 < 1.1 ) ? current_line * 0.1 : 1.1;
//        t.attr({"font-size" : 50 - font__ratio});
//        var tspans = t.selectAll("tspan:nth-child(n+2)");
//        tspans.attr({
//            dy: 1.6 - dy__ratio + "em",
//            x: x
//        });
//
//        fit_in (output, t);
//
//        return t;
//    };
//});