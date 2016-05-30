
/**
 * 
 * add helper functions to this file. If you find yourself
 * reusing functions over and over, consider adding it here.
 * 
 */


/**
 * pass a string to this function and a truthy
 * value us returned if it is a valid email format.
 */
export function validateEmail(value) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}


/**
 * helper function to get the client x and y position 
 * for touch screen or mouse
 */
export function clientPosition(e) {
    if (e.targetTouches && (e.targetTouches.length >= 1)) {
        return {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        };
    }
    return {
        x: e.clientX,
        y: e.clientY
    };
}


/**
 * returns the vendor Prefix of an element
 */
export function jsVendorPrefix(prop){
    var vendors = 'Khtml Ms O Moz Webkit'.split(' ');
    var div = document.createElement('div');
    var len = vendors.length;
    var vendor;
    
    if ( prop in div.style ) return prop;
    
    prop = prop.replace(/^[a-z]/, function(val) {
        return val.toUpperCase();
    });
    
    return vendors.filter(vendor => vendor + prop in div.style)[0] + prop;
}