function I__MODE__PROCESSOR (txt_, MODE) {
    /* MODE is conteined in data-proc_number of I_MODE.svg file
    ** it discribes what way to implement text in to places of patters
    */
    var attr4imode = {"id" : "changabletext", "class" : "changeable__text_place", "text-anchor" : "middle", "font-family" : fontsArr[currentFontIndex], "font-size": "30px", cy:45, "fill": "#333366" };
    switch (MODE) {
        case "0" : {
            /*
            **
             */

            changabletextS = output.change_multitext(output_attr.width * 0.5, 20, txt_, output_attr.width, output_attr.height, attr4imode);
        };
            break;

        case "1" : {
            /*
             **
             */

        };
            break;

        default : {}
    }
}


Snap.plugin(function (Snap, Element, Paper, glob) {
    Paper.prototype.change_multitext = function (x, y, txt, max_width, max_height, attributes) {

        var abc = txt;
        var output = Snap("#output_text"),
            temp = output.text(0, 20, txt).attr(attributes);
        temp.attr({"fill":"none", "stroke":"blue"});
        var size_= temp.getBBox(),
            letter_width = size_.width / abc.length;
        temp.remove();

        var words = txt.split(" ");
        var width_so_far = 0, current_line=0, lines=[''];
        for (var i = 0; i < words.length; i++) {

            var l = words[i].length;
            if (width_so_far + (l * letter_width) > max_width) {
                lines.push('');
                current_line++;
                width_so_far = 0;
            }
            width_so_far += l * letter_width;
            lines[current_line] += words[i] + " ";
        }

        var t = this.text(x,y,lines).attr(attributes);
        var font__ratio = (current_line - 3) * 4,
            dy__ratio = ( current_line * 0.1 < 1.1 ) ? current_line * 0.1 : 1.1;
        t.attr({"font-size" : 50 - font__ratio});
        var tspans = t.selectAll("tspan:nth-child(n+2)");
        tspans.attr({
            dy: 1.6 - dy__ratio + "em",
            x: x
        });

        fit_in (output, t);

        return t;
    };
});
