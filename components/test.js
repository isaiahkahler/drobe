 require('color');
 
 function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorDistance(color1, color2) {
    let color1obj = hexToRgb(color1);
    let color2obj = hexToRgb(color2);
    return Math.sqrt(
      Math.pow(color1obj.r - color2obj.r, 2) +
      Math.pow(color1obj.g - color2obj.g, 2) +
      Math.pow(color1obj.b - color2obj.b, 2)
    );
  }

  function clipRange(value, initialRange, finalRange){
    return finalRange * value / initialRange;
  }

  const colorSpaceMaxDistance = 441.6729559300637;


 function getCompliment(color ) {

    // let c = Color(color);
    // let hsv = c.hsv();
    // console.log(hsv);
    // hsv.h =HueShift(temphsv.hue,180.0);
    // temprgb=HSV2RGB(temphsv);
    return "h"
  }

  getCompliment("#ff0000")